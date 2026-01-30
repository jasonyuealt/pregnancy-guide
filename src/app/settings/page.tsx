'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Settings, Baby, Check, Info, Key, AlertCircle } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';

/**
 * 设置页面 - 温馨母婴风格
 */
export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  
  const [dueDate, setDueDate] = useState(settings.dueDate || '');
  const [lmpDate, setLmpDate] = useState(settings.lmpDate || '');
  const [xhsCookie, setXhsCookie] = useState(settings.xhsCookie || '');
  const [saved, setSaved] = useState(false);
  const [showCookieHelp, setShowCookieHelp] = useState(false);

  useEffect(() => {
    if (settings.dueDate) setDueDate(settings.dueDate);
    if (settings.lmpDate) setLmpDate(settings.lmpDate);
    if (settings.xhsCookie) setXhsCookie(settings.xhsCookie);
  }, [settings.dueDate, settings.lmpDate, settings.xhsCookie]);

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
    updateSettings({ dueDate, lmpDate, xhsCookie });
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
    <div className="animate-fade-in space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-2">设置</h1>
        <p className="text-text-secondary">配置孕期信息和小红书 Cookie</p>
      </div>

      {/* 孕期信息 */}
      <div className="card-soft p-6 border border-pink-100">
        <h2 className="font-semibold text-lg text-text-primary mb-5 flex items-center gap-2">
          <Baby className="text-pink-500" size={22} />
          孕期信息
        </h2>

        <div className="space-y-5">
          {/* 末次月经 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              末次月经日期 (LMP) <span className="text-pink-500">*</span>
            </label>
            <DatePicker
              value={lmpDate}
              onChange={handleLmpChange}
              placeholder="选择末次月经日期"
            />
            <p className="text-xs text-text-secondary mt-2 flex items-center gap-1.5">
              <Info size={12} />
              推荐使用，计算更准确
            </p>
          </div>

          {/* 预产期 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              预产期 (EDD)
            </label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="选择预产期"
            />
            <p className="text-xs text-text-secondary mt-2 flex items-center gap-1.5">
              <Info size={12} />
              或直接填写医生给的预产期
            </p>
          </div>
        </div>

        {/* 预览 */}
        {preview && (
          <div className="mt-6 p-5 bg-gradient-to-r from-pink-50 to-peach-50 rounded-2xl border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">当前孕周</p>
                <p className="text-3xl font-bold text-pink-500 font-number">
                  {preview.week}+{preview.day}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary mb-1">{preview.stage}</p>
                <p className="text-xl font-semibold text-text-primary">
                  还有 <span className="text-peach-500 font-number">{preview.daysUntilDue}</span> 天
                </p>
              </div>
            </div>
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-peach-400 rounded-full transition-all duration-700"
                style={{ width: `${preview.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 小红书 Cookie 配置 */}
      <div className="card-soft p-6 border border-peach-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-text-primary flex items-center gap-2">
            <Key className="text-peach-500" size={22} />
            小红书 Cookie 配置
          </h2>
          <button
            onClick={() => setShowCookieHelp(!showCookieHelp)}
            className="text-sm text-pink-500 hover:text-pink-600 transition-colors font-medium"
          >
            {showCookieHelp ? '收起帮助' : '如何获取？'}
          </button>
        </div>

        {/* Cookie 帮助 */}
        {showCookieHelp && (
          <div className="mb-5 p-4 bg-sky-50 rounded-xl border border-sky-200 text-sm text-sky-800">
            <p className="font-semibold mb-3">📚 Cookie 获取步骤：</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>访问 <a href="https://www.xiaohongshu.com" target="_blank" className="text-sky-600 underline">小红书网页版</a> 并登录</li>
              <li>按 F12 打开开发者工具</li>
              <li>点击 Application → Cookies → xiaohongshu.com</li>
              <li>复制 <code className="bg-sky-100 px-1.5 py-0.5 rounded">a1</code>、<code className="bg-sky-100 px-1.5 py-0.5 rounded">web_session</code>、<code className="bg-sky-100 px-1.5 py-0.5 rounded">webId</code> 的值</li>
              <li>按格式填入: <code className="bg-sky-100 px-1.5 py-0.5 rounded">a1=xxx; web_session=xxx; webId=xxx</code></li>
            </ol>
            <p className="mt-3 text-xs text-sky-600 flex items-center gap-1.5">
              <AlertCircle size={12} />
              Cookie 用于提取小红书内容，仅存储在本地
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Cookie 值
          </label>
          <textarea
            value={xhsCookie}
            onChange={(e) => setXhsCookie(e.target.value)}
            placeholder="a1=xxx; web_session=xxx; webId=xxx"
            rows={3}
            className="w-full px-4 py-3 border border-neutral-soft rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all font-mono text-sm bg-white text-text-primary"
          />
          <p className="text-xs text-text-secondary mt-2 flex items-center gap-1.5">
            <Info size={12} />
            配置后可使用链接导入，未配置时使用手动输入
          </p>
        </div>

        {/* 测试按钮 */}
        {xhsCookie && (
          <button
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5005/health');
                const data = await response.json();
                alert(data.playwright_available ? '✓ Python 服务运行正常' : '✗ 服务未就绪');
              } catch {
                alert('✗ Python API 服务未启动\n\n请运行: cd services && ./start.sh');
              }
            }}
            className="mt-4 px-4 py-2 bg-cream-100 text-text-primary rounded-xl hover:bg-cream-200 transition-all text-sm font-medium"
          >
            测试连接
          </button>
        )}
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={!dueDate}
        className={`w-full py-4 rounded-2xl font-semibold text-white transition-all shadow-gentle hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          saved
            ? 'bg-mint-400'
            : 'bg-gradient-to-r from-pink-400 to-peach-400'
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

      <p className="text-center text-xs text-text-soft">
        保存后，首页和知识库会自动更新
      </p>
    </div>
  );
}
