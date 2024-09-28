"use client"; // クライアントコンポーネントとして指定

import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";

type ExcelOperationsProps = {
  workingListFilePath: File | null;
  workingTableFilePath: File | null;
  selectedName: string;
  selectedDate: string;
};

export default function ExcelOperations({
  workingListFilePath,
  workingTableFilePath,
  selectedName,
  selectedDate,
}: ExcelOperationsProps) {
  const [sumByCategory, setSumByCategory] = useState<{ [key: string]: number }>(
    {},
  );

  // 日付の年、月、日を比較する関数
  const isSameOrBefore = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() <= d2.getTime();
  };

  const processExcelFiles = async () => {
    if (!workingListFilePath || !workingTableFilePath) {
      alert("両方のExcelファイルを選択してください。");
      return;
    }

    try {
      // workingListFilePath の Excel ファイルを読み込む
      const listWorkbook = new Workbook();
      const listFileBuffer = await workingListFilePath.arrayBuffer();
      await listWorkbook.xlsx.load(listFileBuffer);
      const listWorksheet = listWorkbook.getWorksheet(1); // 1つ目のシートを取得

      if (!listWorksheet) {
        alert("workingListFilePath のシートが見つかりません。");
        return;
      }

      // workingTableFilePath の Excel ファイルを読み込む
      const tableWorkbook = new Workbook();
      const tableFileBuffer = await workingTableFilePath.arrayBuffer();
      await tableWorkbook.xlsx.load(tableFileBuffer);
      const tableWorksheet = tableWorkbook.getWorksheet(1); // 1つ目のシートを取得

      if (!tableWorksheet) {
        alert("workingTableFilePath のシートが見つかりません。");
        return;
      }

      // selectedDate を Date オブジェクトに変換
      const selectedDateObj = new Date(selectedDate);
      if (isNaN(selectedDateObj.getTime())) {
        alert("選択された日付が無効です。");
        return;
      }

      // workingTableFilePath の A2、A3、A4 のカテゴリ名を取得し、trimして小文字に変換
      const categories = [
        String(tableWorksheet.getCell("A2").value).trim().toLowerCase(),
        String(tableWorksheet.getCell("A3").value).trim().toLowerCase(),
        String(tableWorksheet.getCell("A4").value).trim().toLowerCase(),
      ];

      // sumMap を初期化（A2、A3、A4 に対応するカテゴリごとの合計値を保持）
      const sumMap: { [category: string]: number } = {
        [categories[0]]: 0,
        [categories[1]]: 0,
        [categories[2]]: 0,
      };

      // workingListFilePath のデータを処理
      listWorksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          // ヘッダーをスキップ
          const nameCell = row.getCell(2).value;
          const dateCell = row.getCell(3).value;
          const categoryCell = row.getCell(4).value;
          const valueCell = row.getCell(5).value;

          // 名前が一致し、日付が選択日付以下であることを確認
          let dateValid = false;
          let dateToCompare: Date | null = null;

          if (dateCell instanceof Date) {
            dateToCompare = dateCell;
            dateValid = true;
          } else if (typeof dateCell === "string") {
            const parsedDate = new Date(dateCell);
            if (!isNaN(parsedDate.getTime())) {
              dateToCompare = parsedDate;
              dateValid = true;
            }
          }

          if (
            nameCell === selectedName &&
            dateValid &&
            dateToCompare !== null &&
            isSameOrBefore(dateToCompare, selectedDateObj) // 変更点: isSameOrBefore を使用
          ) {
            const category = String(categoryCell).trim().toLowerCase();
            const value = Number(valueCell);

            if (Object.prototype.hasOwnProperty.call(sumMap, category)) {
              sumMap[category] += isNaN(value) ? 0 : value;
            }
          }
        }
      });

      // 分を時間に変換
      const targetRows = [35, 36, 37]; // 対象の行番号

      targetRows.forEach((rowNumber, index) => {
        const category = categories[index];
        const sumValue = sumMap[category] || 0;
        const truncatedValue = Math.floor((sumValue / 60) * 10) / 10; // 小数点第一位で切り捨て

        tableWorksheet.getCell(`B${rowNumber}`).value = truncatedValue;
      });

      // 残り時間計算
      tableWorksheet.getCell("C35").value =
        (Number(tableWorksheet.getCell("C2").value) || 0) -
        (Number(tableWorksheet.getCell("B35").value) || 0);
      tableWorksheet.getCell("C36").value =
        (Number(tableWorksheet.getCell("C3").value) || 0) -
        (Number(tableWorksheet.getCell("B36").value) || 0);
      tableWorksheet.getCell("C37").value =
        (Number(tableWorksheet.getCell("C4").value) || 0) -
        (Number(tableWorksheet.getCell("B37").value) || 0);

      // 寄与率計算
      tableWorksheet.getCell("D35").value =
        ((Number(tableWorksheet.getCell("B35").value) || 0) /
          (Number(tableWorksheet.getCell("C2").value) || 1)) *
        100;
      tableWorksheet.getCell("D36").value =
        ((Number(tableWorksheet.getCell("B36").value) || 0) /
          (Number(tableWorksheet.getCell("C3").value) || 1)) *
        100;
      tableWorksheet.getCell("D37").value =
        ((Number(tableWorksheet.getCell("B37").value) || 0) /
          (Number(tableWorksheet.getCell("C4").value) || 1)) *
        100;

      // 1B35、B36、B37、C35、C36、C37、D35、D36、D37 の値を小数点第一位で切り捨てる
      const cellsToTruncate = [
        "B35",
        "B36",
        "B37",
        "C35",
        "C36",
        "C37",
        "D35",
        "D36",
        "D37",
      ];

      cellsToTruncate.forEach((cell) => {
        const cellValue = Number(tableWorksheet.getCell(cell).value) || 0;
        const truncated = Math.floor(cellValue * 10) / 10;
        tableWorksheet.getCell(cell).value = truncated;
      });

      // 更新された Excel ファイルを保存（ファイル名を元の workingTableFilePath の名前に設定）
      const buffer = await tableWorkbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), workingTableFilePath.name);

      // 状態を更新して UI に反映
      setSumByCategory(sumMap);
    } catch (error) {
      console.error("Excelファイルの処理中にエラーが発生しました:", error);
      alert(
        "Excelファイルの処理中にエラーが発生しました。コンソールを確認してください。",
      );
    }
  };

  return (
    <div>
      <button
        className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
        onClick={processExcelFiles}
      >
        Excelファイル計算実行
      </button>
    </div>
  );
}
