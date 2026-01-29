'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Settings, Calendar, Baby, Check, Info, CalendarDays } from 'lucide-react';

/**
 * 设置页面 - 预产期和孕周信息
 * 优化日期选择器 + 移动端适配 + 动画效果
 */
export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  
  const [dueDate, setDueDate] = useState(settings.dueDate || '');
  const [lmpDate, setLmpDate] = useState(settings.lmpDate || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings.dueDate) setDueDate(settings.dueDate);
    if (settings.lmpDate) setLmpDate(settings.lmpDate);
  }, [settings.dueDate, settings.lmpDate]);

  // 根据末次月经计算预产期
  const calculateDueDateFromLMP = (lmp: string) => {
    if (!lmp) return '';
    const date = new Date(lmp);
    date.setDate(date.getDate() + 280);
    return date.toISOString().split('T')[0];
  };

  const handleLmpChange = (value: string) => {
    setLmpDate(value);
    if (value) {
      const calculatedDue = calculateDueDateFromLMP(value);
      setDueDate(calculatedDue);
    }
  };

  const handleSave = () => {
    updateSettings({ dueDate, lmpDate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 预览孕周
  const getPreviewWeekInfo = () => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = 280 - diffDays;
    let week = Math.floor(totalDays / 7) + 1;
    let day = (totalDays % 7) + 1;
    if (week < 1) { week = 1; day = 1; }
    if (week > 40) week = 40;
    const daysUntilDue = Math.max(0, diffDays);
    return { week, day, totalDays, daysUntilDue };
  };

  const preview = getPreviewWeekInfo();

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
          <Settings className="text-coral-500" size={22} />
        </div>
        <div>
          <h1 className="font-display text-xl md:text-2xl text-warm-800">设置</h1>
          <p className="text-xs md:text-sm text-warm-600">配置预产期，精确计算孕周</p>
        </div>
      </div>

      {/* 孕期信息卡片 */}
      <div className="card-soft p-4 md:p-6 mb-4 md:mb-6 border border-coral-100 animate-fade-in-up">
        <h2 className="font-display text-base md:text-lg text-warm-800 mb-4 md:mb-5 flex items-center gap-2">
          <Calendar className="text-coral-400" size={18} />
          孕期信息
        </h2>

        {/* 末次月经 */}
        <div className="mb-4 md:mb-5">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            末次月经日期 (LMP)
          </label>
          <div className="relative">
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => handleLmpChange(e.target.value)}
              className="w-full px-4 py-3 md:py-3.5 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200 text-base"
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" size={18} />
          </div>
          {lmpDate && (
            <p className="text-xs text-coral-400 mt-1.5 animate-fade-in">
              {formatDate(lmpDate)}
            </p>
          )}
          <p className="text-xs text-warm-500 mt-1 flex items-center gap-1">
            <Info size={12} />
            填写后会自动计算预产期
          </p>
        </div>

        {/* 预产期 */}
        <div className="mb-4 md:mb-5">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            预产期 (EDD)
          </label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 md:py-3.5 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200 text-base"
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" size={18} />
          </div>
          {dueDate && (
            <p className="text-xs text-coral-400 mt-1.5 animate-fade-in">
              {formatDate(dueDate)}
            </p>
          )}
          <p className="text-xs text-warm-500 mt-1 flex items-center gap-1">
            <Info size={12} />
            如果医生给了预产期，可以直接填写
          </p>
        </div>

        {/* 预览当前孕周 */}
        {preview && (
          <div className="p-4 bg-gradient-to-r from-mint-50 to-sunny-50 rounded-2xl border border-mint-200 animate-fade-in-scale">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Baby className="text-coral-400" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xs md:text-sm text-warm-600 mb-0.5">当前孕周</p>
                <p className="font-display text-lg md:text-xl text-warm-800">
                  孕 {preview.week} 周 {preview.day} 天
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-warm-500">距预产期</p>
                <p className="font-display text-lg md:text-xl text-coral-500">{preview.daysUntilDue} 天</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={!dueDate}
        className={`w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-semibold text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
          saved
            ? 'bg-mint-400 shadow-lg shadow-mint-200'
            : 'gradient-coral hover:shadow-lg hover:shadow-coral-200 disabled:opacity-50'
        }`}
      >
        {saved ? (
          <>
            <Check size={20} className="animate-fade-in-scale" />
            已保存
          </>
        ) : (
          '保存设置'
        )}
      </button>

      <p className="text-center text-xs text-warm-500 mt-3 md:mt-4">
        保存后，首页和时间轴会自动更新孕周信息
      </p>
    </div>
  );
}
