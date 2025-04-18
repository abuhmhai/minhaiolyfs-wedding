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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // For single day rental, start and end date are the same
    onDatesSelected(date, date);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onDatesSelected(null, null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Chọn ngày thuê
        </label>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            minDate={new Date()}
            disabled={isDisabled}
            className="border border-gray-300 rounded-md p-2 w-full"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày thuê"
          />
        </div>
      </div>
      {selectedDate && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Ngày thuê: {selectedDate.toLocaleDateString('vi-VN')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearDate}
            className="text-xs"
          >
            Xóa
          </Button>
        </div>
      )}
    </div>
  );
} 