'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Settings, Baby, Check, Info } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';

/**
 * 设置页面 - 横向紧凑布局，适合 PC
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

  // 预览孕周（使用本地时间，避免时区问题）
  const getPreviewWeekInfo = () => {
    if (!dueDate) return null;
    
    // 解析预产期为本地时间
    const [dueY, dueM, dueD] = dueDate.split('-').map(Number);
    const dueDateObj = new Date(dueY, dueM - 1, dueD);
    
    // 今天（只取日期）
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 距离预产期天数
    const diffMs = dueDateObj.getTime() - today.getTime();
    const daysUntilDue = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    
    // 末次月经 = 预产期 - 280 天
    const lmpDate = new Date(dueDateObj);
    lmpDate.setDate(lmpDate.getDate() - 280);
    
    // 从末次月经到今天的天数
    const pregnancyDays = Math.round((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let week = 1, day = 1;
    if (pregnancyDays >= 0) {
      week = Math.floor(pregnancyDays / 7) + 1;
      day = (pregnancyDays % 7) + 1;
    }
    if (week < 1) { week = 1; day = 1; }
    if (week > 42) week = 42;
    
    const stage = week <= 12 ? '孕早期' : week <= 28 ? '孕中期' : '孕晚期';
    return { week, day, totalDays: pregnancyDays, daysUntilDue, stage };
  };

  const preview = getPreviewWeekInfo();

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
          <Settings className="text-coral-500" size={20} />
        </div>
        <div>
          <h1 className="font-display text-xl text-warm-800">设置</h1>
          <p className="text-sm text-warm-600">配置预产期信息</p>
        </div>
      </div>

      {/* 主内容 - PC 横向布局 */}
      <div className="card-soft border border-coral-100 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-200">
          {/* 左侧：日期输入 */}
          <div className="p-5 md:p-6">
            <h2 className="font-display text-base text-warm-800 mb-4 flex items-center gap-2">
              孕期信息
            </h2>

            {/* 末次月经 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-warm-700 mb-2">
                末次月经日期 (LMP)
              </label>
              <DatePicker
                value={lmpDate}
                onChange={handleLmpChange}
                placeholder="选择末次月经日期"
              />
              <p className="text-xs text-warm-500 mt-1.5 flex items-center gap-1">
                <Info size={11} />
                填写后自动计算预产期
              </p>
            </div>

            {/* 预产期 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-warm-700 mb-2">
                预产期 (EDD)
              </label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                placeholder="选择预产期"
              />
              <p className="text-xs text-warm-500 mt-1.5 flex items-center gap-1">
                <Info size={11} />
                也可直接填写医生给的预产期
              </p>
            </div>

            {/* 保存按钮 */}
            <button
              onClick={handleSave}
              disabled={!dueDate}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] ${
                saved
                  ? 'bg-mint-400 shadow-lg shadow-mint-200'
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

          {/* 右侧：孕周预览 */}
          <div className="p-5 md:p-6 bg-gradient-to-br from-cream-50 to-white">
            <h2 className="font-display text-base text-warm-800 mb-4">当前状态</h2>

            {preview ? (
              <div className="space-y-4">
                {/* 孕周大数字 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center shadow">
                    <Baby className="text-coral-500" size={32} />
                  </div>
                  <div>
                    <p className="font-display text-3xl text-warm-800">
                      {preview.week}
                      <span className="text-lg text-warm-600 ml-1">周</span>
                      <span className="text-xl text-warm-600 ml-2">{preview.day}</span>
                      <span className="text-lg text-warm-600 ml-1">天</span>
                    </p>
                    <p className="text-sm text-warm-500">共 {preview.totalDays} 天</p>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-cream-200">
                    <p className="text-xs text-warm-500 mb-1">当前阶段</p>
                    <p className="font-semibold text-coral-500">{preview.stage}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-cream-200">
                    <p className="text-xs text-warm-500 mb-1">距预产期</p>
                    <p className="font-display text-xl text-coral-500">{preview.daysUntilDue} <span className="text-sm font-normal">天</span></p>
                  </div>
                </div>

                {/* 进度条 */}
                <div>
                  <div className="flex justify-between text-xs text-warm-500 mb-1.5">
                    <span>孕期进度</span>
                    <span>{Math.round((preview.week / 40) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full progress-warm rounded-full transition-all duration-700"
                      style={{ width: `${(preview.week / 40) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-3">
                  <Baby className="text-warm-400" size={32} />
                </div>
                <p className="text-sm text-warm-500">填写日期后显示孕周信息</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-center text-xs text-warm-500 mt-4">
        保存后，首页和时间轴会自动更新
      </p>
    </div>
  );
}
