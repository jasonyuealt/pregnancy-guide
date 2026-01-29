'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 自定义日期选择器 - 风格统一
 */
export default function DatePicker({ value, onChange, placeholder = '选择日期' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 月份天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // 格式化显示
  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  // 选择日期
  const handleSelect = (day: number) => {
    const selected = new Date(year, month, day);
    const formatted = selected.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  // 导航
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // 判断是否选中
  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  // 判断是否今天
  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div ref={containerRef} className="relative">
      {/* 输入框 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-left flex items-center justify-between cursor-pointer hover:border-coral-300 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200"
      >
        <span className={value ? 'text-warm-700' : 'text-warm-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar className="text-warm-400" size={18} />
      </button>

      {/* 弹出层 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-cream-200 z-50 animate-fade-in-scale overflow-hidden">
          {/* 月份导航 */}
          <div className="flex items-center justify-between p-3 border-b border-cream-100 bg-gradient-to-r from-coral-50 to-sunny-50">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft className="text-warm-600" size={18} />
            </button>
            <span className="font-display text-warm-800">
              {year}年{month + 1}月
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <ChevronRight className="text-warm-600" size={18} />
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 p-2 border-b border-cream-100">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-warm-500 font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {/* 空白填充 */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* 日期 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const today = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    selected
                      ? 'gradient-coral text-white shadow'
                      : today
                      ? 'bg-mint-100 text-mint-600'
                      : 'text-warm-700 hover:bg-coral-50'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* 快捷操作 */}
          <div className="flex gap-2 p-2 border-t border-cream-100 bg-cream-50">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setViewDate(today);
                onChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 text-xs text-warm-600 hover:text-coral-500 font-medium cursor-pointer transition-colors duration-200"
            >
              今天
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 text-xs text-warm-600 hover:text-coral-500 font-medium cursor-pointer transition-colors duration-200"
            >
              清除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
