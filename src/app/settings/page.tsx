'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Settings, Calendar, Baby, Check, Info } from 'lucide-react';

/**
 * 设置页面 - 预产期和孕周信息
 */
export default function SettingsPage() {
  const { settings, updateSettings, getCurrentWeekInfo } = useAppStore();
  
  // 本地表单状态
  const [dueDate, setDueDate] = useState(settings.dueDate || '');
  const [lmpDate, setLmpDate] = useState(settings.lmpDate || ''); // 末次月经
  const [saved, setSaved] = useState(false);

  // 从 store 同步初始值
  useEffect(() => {
    if (settings.dueDate) setDueDate(settings.dueDate);
    if (settings.lmpDate) setLmpDate(settings.lmpDate);
  }, [settings.dueDate, settings.lmpDate]);

  // 根据末次月经计算预产期（+280天）
  const calculateDueDateFromLMP = (lmp: string) => {
    if (!lmp) return '';
    const date = new Date(lmp);
    date.setDate(date.getDate() + 280);
    return date.toISOString().split('T')[0];
  };

  // 当末次月经改变时，自动计算预产期
  const handleLmpChange = (value: string) => {
    setLmpDate(value);
    if (value) {
      const calculatedDue = calculateDueDateFromLMP(value);
      setDueDate(calculatedDue);
    }
  };

  // 保存设置
  const handleSave = () => {
    updateSettings({
      dueDate,
      lmpDate,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 获取当前孕周信息（基于输入的预产期预览）
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
    return { week, day, totalDays };
  };

  const preview = getPreviewWeekInfo();

  return (
    <div className="max-w-2xl mx-auto">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
          <Settings className="text-coral-500" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-warm-800">设置</h1>
          <p className="text-sm text-warm-600">配置预产期信息，精确计算孕周</p>
        </div>
      </div>

      {/* 孕期信息卡片 */}
      <div className="card-soft p-6 mb-6 border border-coral-100">
        <h2 className="font-display text-lg text-warm-800 mb-5 flex items-center gap-2">
          <Calendar className="text-coral-400" size={20} />
          孕期信息
        </h2>

        {/* 末次月经 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            末次月经日期 (LMP)
          </label>
          <input
            type="date"
            value={lmpDate}
            onChange={(e) => handleLmpChange(e.target.value)}
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
          <p className="text-xs text-warm-500 mt-1.5 flex items-center gap-1">
            <Info size={12} />
            填写后会自动计算预产期
          </p>
        </div>

        {/* 预产期 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            预产期 (EDD)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 focus:border-coral-400 focus:ring-2 focus:ring-coral-100"
          />
          <p className="text-xs text-warm-500 mt-1.5 flex items-center gap-1">
            <Info size={12} />
            如果医生给了预产期，可以直接填写
          </p>
        </div>

        {/* 预览当前孕周 */}
        {preview && (
          <div className="p-4 bg-gradient-to-r from-mint-50 to-sunny-50 rounded-2xl border border-mint-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Baby className="text-coral-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-warm-600">根据预产期计算，当前</p>
                <p className="font-display text-xl text-warm-800">
                  孕 {preview.week} 周 {preview.day} 天
                  <span className="text-sm text-warm-500 font-normal ml-2">
                    (共 {preview.totalDays} 天)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={!dueDate}
        className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
          saved
            ? 'bg-mint-400'
            : 'gradient-coral hover:shadow-lg disabled:opacity-50'
        }`}
      >
        {saved ? (
          <>
            <Check size={20} />
            已保存
          </>
        ) : (
          '保存设置'
        )}
      </button>

      {/* 提示 */}
      <p className="text-center text-xs text-warm-500 mt-4">
        设置保存后，首页和时间轴会自动更新孕周信息
      </p>
    </div>
  );
}
