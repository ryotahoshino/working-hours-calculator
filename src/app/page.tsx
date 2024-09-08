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

    const handleDateChange = (formattedDate: string) => {
      console.log('Selected Date:', formattedDate);
    };
  
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Calender />
      </div>
      <div className="mb-2">
        <FileSelector id="workingListFilePaths" onSelect={handleSelect} />
      </div>
      <div className="mt-2">
        <FileSelector id="workingTableFilePaths" onSelect={handleSelect} />
      </div>
    </main>
  )
}