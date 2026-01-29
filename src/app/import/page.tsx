'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { parseXiaohongshuUrl, XiaohongshuParseResult } from '@/lib/ai';
import { ImportedItem } from '@/types';
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
  X,
  ShoppingBag,
} from 'lucide-react';

/**
 * 导入管理页面 - 小红书 AI 解析
 */
export default function ImportPage() {
  const { importedItems, addImportedItem, markAsIntegrated } = useAppStore();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<XiaohongshuParseResult | null>(null);
  const [error, setError] = useState('');

  // AI 解析
  const handleParse = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError('');
    setParseResult(null);

    try {
      const result = await parseXiaohongshuUrl(url);
      setParseResult(result);
    } catch (err) {
      setError('解析失败，请重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 确认导入
  const handleConfirmImport = () => {
    if (!parseResult) return;

    const newItem = new ImportedItem({
      sourceUrl: url,
      sourceTitle: parseResult.title,
      targetWeek: parseResult.targetWeek,
      targetStage: parseResult.stage,
      contentType: parseResult.contentType,
      content: parseResult.summary,
      tags: [parseResult.suggestedCategory],
      isIntegrated: false,
    });

    addImportedItem(newItem);
    setUrl('');
    setParseResult(null);
  };

  const integratedCount = importedItems.filter((i) => i.isIntegrated).length;
  const pendingCount = importedItems.length - integratedCount;

  return (
    <div className="animate-fade-in min-h-[calc(100vh-4rem)]">
      {/* 顶部 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow">
          <FileInput className="text-red-500" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-warm-800">导入管理</h1>
          <p className="text-sm text-warm-500">
            共 {importedItems.length} 篇 · 已整合 {integratedCount} · 待处理 <span className="text-coral-500 font-medium">{pendingCount}</span>
          </p>
        </div>
      </div>

      {/* 导入输入区 */}
      <div className="card-soft p-5 border border-coral-100 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="text-coral-400" size={18} />
          <span className="font-semibold text-warm-800">快速导入</span>
        </div>
        <p className="text-sm text-warm-500 mb-4">粘贴小红书文章链接或内容，AI 将自动解析并建议放置位置</p>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴小红书链接或文章标题/内容..."
            className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200"
          />
          <button
            onClick={handleParse}
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

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* 解析结果预览 */}
        {parseResult && (
          <div className="p-4 bg-mint-50 rounded-2xl border border-mint-200 animate-fade-in-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-mint-500" />
                <span className="text-sm font-bold text-mint-600">AI 解析结果</span>
              </div>
              <button
                onClick={() => setParseResult(null)}
                className="p-1 hover:bg-mint-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} className="text-warm-500" />
              </button>
            </div>

            <h4 className="font-bold text-warm-800 text-lg mb-2">{parseResult.title}</h4>
            <p className="text-sm text-warm-600 mb-3">{parseResult.summary}</p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {parseResult.targetWeek && (
                <span className="text-xs bg-coral-100 text-coral-500 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Calendar size={10} />
                  第 {parseResult.targetWeek} 周
                </span>
              )}
              {parseResult.stage && (
                <span className="text-xs bg-sunny-100 text-sunny-600 px-2 py-1 rounded-full font-medium">
                  {parseResult.stage === 'early' ? '孕早期' : parseResult.stage === 'middle' ? '孕中期' : parseResult.stage === 'late' ? '孕晚期' : '待产包'}
                </span>
              )}
              <span className="text-xs bg-lavender-100 text-lavender-500 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Tag size={10} />
                {parseResult.suggestedCategory}
              </span>
            </div>

            {/* 提取的产品 */}
            {parseResult.products.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-warm-500 mb-2 flex items-center gap-1">
                  <ShoppingBag size={12} />
                  提取的产品
                </p>
                <div className="flex flex-wrap gap-2">
                  {parseResult.products.map((p, i) => (
                    <span key={i} className="text-xs bg-white text-warm-600 px-2 py-1 rounded-lg border border-cream-200">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 提取的建议 */}
            {parseResult.tips.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-warm-500 mb-2">提取的建议</p>
                <ul className="space-y-1">
                  {parseResult.tips.slice(0, 3).map((tip, i) => (
                    <li key={i} className="text-sm text-warm-600 flex items-start gap-2">
                      <Check size={14} className="text-mint-400 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setParseResult(null)}
                className="flex-1 py-2.5 bg-white text-warm-600 rounded-xl font-medium border border-cream-200 cursor-pointer hover:bg-cream-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 gradient-coral text-white rounded-xl font-medium cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                确认导入
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 导入列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {importedItems.length > 0 ? (
          importedItems.map((item) => (
            <div
              key={item.id}
              className={`card-soft p-4 border transition-all duration-200 ${
                item.isIntegrated ? 'border-mint-200 bg-mint-50/30' : 'border-coral-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 状态图标 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.isIntegrated ? 'bg-mint-100' : 'bg-red-100'
                }`}>
                  {item.isIntegrated ? (
                    <Check className="text-mint-500" size={18} />
                  ) : (
                    <FileInput className="text-red-400" size={18} />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-800 mb-1 truncate">{item.sourceTitle}</h3>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.targetWeek && (
                      <span className="text-xs bg-coral-50 text-coral-500 px-1.5 py-0.5 rounded">
                        第 {item.targetWeek} 周
                      </span>
                    )}
                    {item.targetStage && (
                      <span className="text-xs bg-sunny-50 text-sunny-600 px-1.5 py-0.5 rounded">
                        {item.targetStage === 'early' ? '孕早期' : item.targetStage === 'middle' ? '孕中期' : item.targetStage === 'late' ? '孕晚期' : '待产包'}
                      </span>
                    )}
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center gap-2">
                    {!item.isIntegrated && (
                      <button
                        onClick={() => markAsIntegrated(item.id)}
                        className="text-xs text-mint-600 hover:text-mint-700 font-medium cursor-pointer"
                      >
                        标记已整合
                      </button>
                    )}
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-warm-400 hover:text-coral-500 cursor-pointer"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 card-soft p-12 border border-cream-200 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <FileInput className="text-warm-400" size={28} />
            </div>
            <h3 className="font-display text-xl text-warm-700 mb-2">暂无导入内容</h3>
            <p className="text-sm text-warm-500">粘贴小红书链接，AI 将自动提取有用信息</p>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="mt-5 p-4 bg-cream-100/50 rounded-2xl border border-cream-200">
        <h3 className="font-semibold text-warm-700 mb-3">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-warm-600">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <span>粘贴小红书链接或内容</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <span>AI 自动解析并提取信息</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <span>确认后自动归类到对应孕周</span>
          </div>
        </div>
      </div>
    </div>
  );
}
