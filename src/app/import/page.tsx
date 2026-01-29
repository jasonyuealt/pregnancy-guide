'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import {
  FileInput,
  Link2,
  Sparkles,
  Check,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  Loader2,
} from 'lucide-react';

/**
 * 导入管理页面 - 管理小红书导入的内容
 */
export default function ImportPage() {
  const { importedItems, markAsIntegrated } = useAppStore();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    // TODO: 实际调用 AI 解析
    setTimeout(() => {
      setIsLoading(false);
      setUrl('');
      alert('导入功能开发中...');
    }, 1500);
  };

  const integratedCount = importedItems.filter((i) => i.isIntegrated).length;
  const pendingCount = importedItems.length - integratedCount;

  return (
    <div className="animate-fade-in min-h-[calc(100vh-4rem)]">
      {/* 顶部 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow">
          <FileInput className="text-red-500" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-warm-800">导入管理</h1>
          <p className="text-sm text-warm-500">
            共 {importedItems.length} 篇 · 已整合 {integratedCount} · 待处理 <span className="text-coral-500 font-medium">{pendingCount}</span>
          </p>
        </div>
      </div>

      {/* 导入输入框 */}
      <div className="card-soft p-5 border border-coral-100 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="text-coral-400" size={18} />
          <span className="font-semibold text-warm-800">快速导入</span>
        </div>
        <p className="text-sm text-warm-500 mb-4">粘贴小红书文章链接，AI 将自动解析内容并建议放置位置</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴小红书链接..."
            className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200"
          />
          <button
            onClick={handleImport}
            disabled={!url.trim() || isLoading}
            className="px-6 py-3 gradient-coral text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                解析中...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI 解析
              </>
            )}
          </button>
        </div>
      </div>

      {/* 导入列表 */}
      <div className="space-y-4">
        {importedItems.length > 0 ? (
          importedItems.map((item) => (
            <div
              key={item.id}
              className={`card-soft p-5 border transition-all duration-200 ${
                item.isIntegrated ? 'border-mint-200 bg-mint-50/30' : 'border-coral-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 状态图标 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.isIntegrated ? 'bg-mint-100' : 'bg-red-100'
                }`}>
                  {item.isIntegrated ? (
                    <Check className="text-mint-500" size={20} />
                  ) : (
                    <FileInput className="text-red-400" size={20} />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-800 mb-2">{item.sourceTitle}</h3>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.targetWeek && (
                      <span className="inline-flex items-center gap-1 text-xs bg-coral-50 text-coral-500 px-2 py-1 rounded-full">
                        <Calendar size={12} />
                        第 {item.targetWeek} 周
                      </span>
                    )}
                    {item.targetStage && (
                      <span className="inline-flex items-center gap-1 text-xs bg-sunny-50 text-sunny-600 px-2 py-1 rounded-full">
                        <Tag size={12} />
                        {item.targetStage === 'early' ? '孕早期' : item.targetStage === 'middle' ? '孕中期' : item.targetStage === 'late' ? '孕晚期' : '待产包'}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs bg-lavender-50 text-lavender-500 px-2 py-1 rounded-full">
                      {item.contentType === 'product' ? '好物' : item.contentType === 'nutrition' ? '饮食' : item.contentType === 'experience' ? '经验' : '知识'}
                    </span>
                  </div>

                  {/* 摘要 */}
                  {item.content && (
                    <p className="text-sm text-warm-600 line-clamp-2">{item.content}</p>
                  )}
                </div>

                {/* 操作 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!item.isIntegrated && (
                    <button
                      onClick={() => markAsIntegrated(item.id)}
                      className="px-3 py-1.5 bg-mint-100 text-mint-600 rounded-lg text-sm font-medium hover:bg-mint-200 transition-colors duration-200 cursor-pointer"
                    >
                      标记已整合
                    </button>
                  )}
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-warm-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card-soft p-12 border border-cream-200 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <FileInput className="text-warm-400" size={28} />
            </div>
            <h3 className="font-display text-xl text-warm-700 mb-2">暂无导入内容</h3>
            <p className="text-sm text-warm-500 mb-4">粘贴小红书链接，AI 将自动提取有用信息</p>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="mt-5 p-5 bg-cream-100/50 rounded-2xl border border-cream-200">
        <h3 className="font-semibold text-warm-700 mb-3">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-warm-600">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <span>粘贴小红书文章链接</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <span>AI 自动解析并提取关键信息</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <span>内容自动整合到对应孕周</span>
          </div>
        </div>
      </div>
    </div>
  );
}
