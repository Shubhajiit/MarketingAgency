'use client';

import { useState } from 'react';
import type { WorkshopSlot } from '@/lib/api/workshops';

interface SlotPickerProps {
  slots: WorkshopSlot[];
  onSelect: (slot: WorkshopSlot) => void;
  selectedSlotId?: string;
}

export default function SlotPicker({ slots, onSelect, selectedSlotId }: SlotPickerProps) {
  // Group slots by date
  const slotsByDate = slots.reduce<Record<string, WorkshopSlot[]>>((acc, slot) => {
    const dateKey = new Date(slot.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(slotsByDate).sort();
  const [selectedDate, setSelectedDate] = useState(dates[0] || '');

  return (
    <div className="space-y-4">
      {/* Date tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dates.map((date) => {
          const d = new Date(date);
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-[#009ee3] text-white border-[#009ee3]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#009ee3] hover:text-[#009ee3]'
              }`}
            >
              {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </button>
          );
        })}
      </div>

      {/* Slots for selected date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(slotsByDate[selectedDate] || []).map((slot) => {
          const isFull = slot.bookedSeats >= slot.totalSeats || !slot.isAvailable;
          const isSelected = slot._id === selectedSlotId;
          const remaining = slot.totalSeats - slot.bookedSeats;

          return (
            <button
              key={slot._id}
              onClick={() => !isFull && onSelect(slot)}
              disabled={isFull}
              className={`p-4 rounded-lg border text-left transition-all ${
                isFull
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-50 border-[#009ee3] ring-2 ring-[#009ee3]/20'
                  : 'bg-white border-gray-200 hover:border-[#009ee3] hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {slot.startTime} - {slot.endTime}
                </span>
                {isFull ? (
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">FULL</span>
                ) : (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {remaining} seat{remaining !== 1 ? 's' : ''} left
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
