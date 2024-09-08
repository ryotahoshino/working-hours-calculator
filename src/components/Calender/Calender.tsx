'use client';

import React, { useState } from "react";
import { format } from "date-fns";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalenderProps {
  onDateChange?: (formattedDate: string) => void;
}

const Calender: React.FC<CalenderProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onDateChange && date) {
      const formattedDate = format(date, 'yyyy/MM/dd');
      onDateChange(formattedDate);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <label className="font-medium">計算する日付の期間を設定してください</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        className="border p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Calender;