'use client';

import Calender from "@/components/Calender/Calender";
import FileSelector from "@/components/FileSelector/FIleSelector";
import { useState } from "react";

export default function Home() {
  const [workingListFilePaths, setWorkingListFilePaths] = useState<string>('');
  const [workingTableFilePaths, setWorkingTableFilePaths] = useState<string>('');


  const handleSelect = (id: string, files: FileList | null) => {
    if (files) {
      const paths = Array.from(files).map((file) => file.name).join('\n');
      if (id === 'workingListFilePaths') {
        setWorkingListFilePaths(paths);
      } else if (id === 'workingTableFilePaths') {
        setWorkingTableFilePaths(paths)
      }
    };
  };

  return (
    <main className="flex min-h-screen flex-col items-start pb-24 justify-between border border-gray-900 rounded-lg shadow-lg">
      <header className="w-full bg-green-600 py-4 text-white">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">勤怠計算ツール</h1>
        </div>
      </header>
      <div className="self-start px-24 py-4">
        <Calender />
      </div>
      <div className="self-start w-full px-24 py-4">
        <label className="font-medium">計算対象者の名前を入力してください</label>
        <input
          type="text"
          className="block w-64 rounded-md border-0 py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="名前を入力してください"
        />
      </div>
      <div className="self-start mb-2 w-full px-24 py-4">
        <label className="font-medium">計算対象のファイルを選択してください</label>
        <FileSelector id="workingListFilePaths" onSelect={handleSelect} />
      </div>
      <div className="self-start mt-2 w-full px-24 py-4">
        <label className="font-medium">計算結果を記入するファイルを選択してください</label>
        <FileSelector id="workingTableFilePaths" onSelect={handleSelect} />
      </div>
    </main>
  )
}