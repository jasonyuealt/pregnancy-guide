'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Settings, Baby, Check, Info } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';

/**
 * 设置页面 - 简化版
 */
export default function SettingsPage() {
  const { settings, updateSettings, getCurrentWeekInfo } = useAppStore();

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
    const [year, month, day] = lmp.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 280);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
    if (!dueDate && !lmpDate) return null;

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();
    const nowDateUTC = Date.UTC(nowYear, nowMonth - 1, nowDay);

    let totalDays = 1;
    let daysUntilDue = 280;

    if (lmpDate) {
      const [lmpYear, lmpMonth, lmpDay] = lmpDate.split('-').map(Number);
      const lmpDateUTC = Date.UTC(lmpYear, lmpMonth - 1, lmpDay);
      totalDays = Math.floor((nowDateUTC - lmpDateUTC) / (1000 * 60 * 60 * 24)) + 1;
      daysUntilDue = Math.max(0, 280 - totalDays);
    } else if (dueDate) {
      const [dueYear, dueMonth, dueDay] = dueDate.split('-').map(Number);
      const dueDateUTC = Date.UTC(dueYear, dueMonth - 1, dueDay);
      daysUntilDue = Math.max(0, Math.floor((dueDateUTC - nowDateUTC) / (1000 * 60 * 60 * 24)));
      totalDays = 280 - daysUntilDue;
    }

    let week = 0;
    let day = 0;
    if (totalDays >= 1) {
      week = Math.floor((totalDays - 1) / 7);
      day = (totalDays - 1) % 7;
    }
    if (week < 0) week = 0;
    if (week > 40) week = 40;

    const stage = week < 13 ? '孕早期' : week < 28 ? '孕中期' : '孕晚期';
    const progress = Math.round((Math.max(1, totalDays) / 280) * 100);

    return { week, day, totalDays: Math.max(1, totalDays), daysUntilDue, stage, progress };
  };

  const preview = getPreviewWeekInfo();

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center shadow">
          <Settings className="text-white" size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-warm-800">设置</h1>
          <p className="text-sm text-warm-500">配置预产期信息</p>
        </div>
      </div>

      {/* 表单 */}
      <div className="bg-white rounded-2xl p-5 border border-cream-200 mb-5">
        {/* 末次月经 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            末次月经日期 (LMP)
          </label>
          <DatePicker
            value={lmpDate}
            onChange={handleLmpChange}
            placeholder="选择末次月经日期"
          />
          <p className="text-xs text-warm-400 mt-2 flex items-center gap-1">
            <Info size={12} />
            填写后自动计算预产期
          </p>
        </div>

        {/* 预产期 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            预产期 (EDD)
          </label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="选择预产期"
          />
          <p className="text-xs text-warm-400 mt-2 flex items-center gap-1">
            <Info size={12} />
            也可直接填写医生给的预产期
          </p>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          disabled={!dueDate && !lmpDate}
          className={`w-full py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
            saved
              ? 'bg-mint-400 shadow-lg'
              : 'gradient-coral hover:shadow-lg disabled:opacity-50'
          }`}
        >
          {saved ? (
            <>
              <Check size={18} className="animate-fade-in-scale" />
              已保存
            </>
          ) : (
            '保存设置'
          )}
        </button>
      </div>

      {/* 预览 */}
      {preview && (
        <div className="bg-white rounded-2xl p-5 border border-mint-200 animate-fade-in-up">
          <h3 className="font-semibold text-warm-800 mb-4">当前状态预览</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
              <Baby className="text-coral-500" size={28} />
            </div>
            <div>
              <p className="font-display text-3xl text-warm-800">
                孕{preview.week}
                <span className="text-xl text-coral-400 ml-1">+{preview.day}</span>
              </p>
              <p className="text-sm text-warm-500">{preview.stage} · 距预产期 {preview.daysUntilDue} 天</p>
            </div>
          </div>

          <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full progress-warm rounded-full transition-all duration-500"
              style={{ width: `${preview.progress}%` }}
            />
          </div>
          <p className="text-xs text-warm-400 text-right mt-1">{preview.progress}%</p>
        </div>
      )}
    </div>
  );
}
