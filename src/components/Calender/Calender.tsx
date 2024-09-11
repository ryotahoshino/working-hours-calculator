'use client';

import React, { useState } from "react";
import { format } from "date-fns";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarProps {
  onDateChange?: (formattedDate: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 日付変更ハンドラー
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onDateChange && date) {
      const formattedDate = format(date, 'yyyy/MM/dd');
      onDateChange(formattedDate);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    if (onDateChange) {
      const formattedDate = format(today, 'yyyy/MM/dd');
      onDateChange(formattedDate);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    if (onDateChange) {
      onDateChange('');
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <label className="font-medium">計算する日付を選択してください</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        className="border p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholderText="日付を選択してください"
      />
      <div className="flex space-x-4">
        <button
          onClick={handleToday}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Today
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Calendar;
