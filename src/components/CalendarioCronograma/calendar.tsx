"use client";
import React, { useEffect, useState } from 'react';

interface CalendarProps {
  selectedDates?: string[]; // ou Date[] dependendo do seu uso
  onChange: (dias: string[]) => void;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Calendar: React.FC<CalendarProps> = ({ selectedDates = [], onChange }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  useEffect(() => {
    if (selectedDates && selectedDates.length > 0) {
      const formatted = selectedDates.map(date => {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        return formatDate(d);
      });

      // Evita update desnecessário
      const changed = formatted.some(date => !selectedDays.includes(date)) || formatted.length !== selectedDays.length;
      if (changed) {
        setSelectedDays(formatted);
      }
    }
  }, [selectedDates]);


  const parseISODateToLocal = (iso: string): Date => {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => new Date(year, month, i + 1));
  };

  const handleCheckboxChange = (dateStr: string) => {
    setSelectedDays(prev => {
      const alreadySelected = prev.includes(dateStr);
      const updated = alreadySelected
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr];
      if (onChange) {
        const converted = updated.map(dateStr => {
          const [dia, mes, ano] = dateStr.split('/');
          return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        });
        onChange(converted);
      }
      return updated;
    });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDays([]); // Limpa seleção ao trocar de mês
  };

  const daysInMonth = getDaysInMonth();


  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="px-4 py-2 bg-neutrals-100 text-primary-500 rounded-md border"
        >
          Anterior
        </button>
        <h2 className="text-xl font-bold text-neutrals-900 capitalize">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => changeMonth('next')}
          className="px-4 py-2 bg-neutrals-100 text-primary-500 rounded-md border"
        >
          Próximo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {daysInMonth.map((day, idx) => {
          const dateStr = formatDate(day);
          return (
            <label
              key={dateStr}
              className="flex flex-col items-center border p-2 rounded-md cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDays.includes(dateStr)}
                onChange={() => handleCheckboxChange(dateStr)}
                className="mb-2"
              />
              <span className="text-xs font-bold text-neutrals-900">
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </span>
              <span className="text-lg font-semibold text-neutrals-800">
                {day.getDate()}
              </span>
            </label>
          );
        })}
      </div>
    </main>
  );
};

export default Calendar;