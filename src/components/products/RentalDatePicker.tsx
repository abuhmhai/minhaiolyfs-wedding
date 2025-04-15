'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';

interface RentalDatePickerProps {
  onDatesSelected: (startDate: Date | null, endDate: Date | null) => void;
  isDisabled?: boolean;
}

export default function RentalDatePicker({ onDatesSelected, isDisabled = false }: RentalDatePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDatesSelected(start, end);
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    onDatesSelected(null, null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Chọn thời gian thuê
        </label>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={new Date()}
            disabled={isDisabled}
            className="border border-gray-300 rounded-md p-2 w-full"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày bắt đầu và kết thúc"
          />
        </div>
      </div>
      {(startDate || endDate) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {startDate && endDate
              ? `${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`
              : startDate
              ? `Bắt đầu: ${startDate.toLocaleDateString('vi-VN')}`
              : ''}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearDates}
            className="text-xs"
          >
            Xóa
          </Button>
        </div>
      )}
    </div>
  );
} 