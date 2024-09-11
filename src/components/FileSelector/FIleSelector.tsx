'use client'; // クライアントコンポーネントとして指定

import React, { useState } from 'react';

interface FileSelectorProps {
  id: string;
  onSelect: (id: string, files: FileList | null) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ id, onSelect }) => {
  const [fileName, setFileName] = useState<string>(''); // ファイル名を保存する状態
  const [fileContents, setFileContents] = useState<string>(''); // ファイルの内容を保存する状態

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContents(text);
      };

      reader.readAsText(file);
      setFileName(file.name);
      onSelect(id, files);
    }
  };

  const placeholder = 
    id === 'workingListFilePaths'
      ? '計算対象ファイル'
      : '計算結果記載対象ファイル'

  return (
    <div className="relative mt-2 rounded-md shadow-sm flex space-x-4">
      <input type="text" className="block w-1/2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={placeholder} value={fileName} />
      <input type="file" id={id} className="lock w-1/2 text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-green-100 file:text-green-700
      hover:file:bg-green-200" multiple={false} onChange={handleChange} />
    </div>
  )
};

export default FileSelector;
