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
    <main className="flex min-h-screen flex-col items-start justify-between p-24">
      <div className="self-start">
        <Calender />
      </div>
      <div className="self-start w-full">
        <input
          type="text"
          className="block w-64 rounded-md border-0 py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="名前を入力してください"
        />
      </div>
      <div className="self-start mb-2 w-full">
        <FileSelector id="workingListFilePaths" onSelect={handleSelect} />
      </div>
      <div className="self-start mt-2 w-full">
        <FileSelector id="workingTableFilePaths" onSelect={handleSelect} />
      </div>
    </main>
  )
}