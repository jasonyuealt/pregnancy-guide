'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { ImportedItem } from '@/types';
import {
  FileInput,
  Sparkles,
  Check,
  Trash2,
  Calendar,
  Tag,
  Loader2,
  X,
  ShoppingBag,
  AlertCircle,
  FileText,
} from 'lucide-react';

/**
 * 导入管理页面 - 手动输入内容，AI 辅助分类
 * 说明：由于无法直接访问小红书内容，需要用户手动粘贴文字
 */
export default function ImportPage() {
  const { importedItems, addImportedItem, markAsIntegrated, removeImportedItem, getCurrentWeekInfo } = useAppStore();
  const { week } = getCurrentWeekInfo();
  
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<{
    title: string;
    stage: string | null;
    targetWeek: number | null;
    summary: string;
    suggestedCategory: string;
    tips: string[];
    products: { name: string; reason: string }[];
  } | null>(null);
  const [error, setError] = useState('');

  // AI 分析内容并分类
  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    setError('');
    setParseResult(null);

    try {
      // 调用 AI 分析用户输入的内容
      const response = await fetch('https://cerebras-proxy.brain.loocaa.com:1443/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK',
        },
        body: JSON.stringify({
          model: 'qwen-3-235b-a22b-instruct-2507',
          messages: [
            {
              role: 'system',
              content: `你是一个孕期内容分析助手。用户会粘贴从小红书等平台复制的孕期相关文字内容。
请分析内容，提取关键信息并分类。

返回严格的 JSON 格式（不要添加任何其他文字）：
{
  "title": "内容标题（简洁，15字以内）",
  "stage": "early/middle/late/hospital 或 null",
  "targetWeek": 具体孕周数（0-39）或 null,
  "summary": "内容摘要（50字以内）",
  "suggestedCategory": "待产包/孕期营养/产检/生活护理/运动/胎教/其他",
  "tips": ["提取的建议或经验，最多3条"],
  "products": [{ "name": "产品名", "reason": "推荐理由" }]
}

注意：
1. 只基于用户提供的内容提取信息，不要编造
2. 如果内容太少无法判断，相应字段填 null 或空数组
3. products 只提取明确提到的产品`
            },
            {
              role: 'user',
              content: `请分析以下内容：\n\n${content}`
            }
          ],
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '';
      
      // 解析 JSON
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                        aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1] || jsonMatch[0];
      }
      
      const result = JSON.parse(jsonStr);
      setParseResult(result);
    } catch (err) {
      setError('分析失败，请检查内容后重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 确认保存
  const handleConfirmSave = () => {
    if (!parseResult) return;

    const newItem = new ImportedItem({
      sourceUrl: '',
      sourceTitle: parseResult.title || '未命名内容',
      targetWeek: parseResult.targetWeek,
      targetStage: parseResult.stage as 'early' | 'middle' | 'late' | 'hospital' | null,
      contentType: 'tip',
      content: parseResult.summary || content.slice(0, 100),
      tags: [parseResult.suggestedCategory].filter(Boolean),
      isIntegrated: false,
    });

    addImportedItem(newItem);
    setContent('');
    setParseResult(null);
  };

  // 删除导入内容
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条内容吗？')) {
      removeImportedItem(id);
    }
  };

  const integratedCount = importedItems.filter((i) => i.isIntegrated).length;
  const pendingCount = importedItems.length - integratedCount;

  const getStageLabel = (stage: string | null) => {
    switch (stage) {
      case 'early': return '孕早期';
      case 'middle': return '孕中期';
      case 'late': return '孕晚期';
      case 'hospital': return '待产包';
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in min-h-[calc(100vh-4rem)]">
      {/* 顶部 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center shadow">
          <FileInput className="text-coral-500" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-warm-800">内容收集</h1>
          <p className="text-sm text-warm-500">
            共 {importedItems.length} 条 · 已整合 {integratedCount} · 待处理 <span className="text-coral-500 font-medium">{pendingCount}</span>
          </p>
        </div>
      </div>

      {/* 重要说明 */}
      <div className="p-4 bg-sunny-50 rounded-2xl border border-sunny-200 mb-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-sunny-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-warm-700">
            <p className="font-semibold mb-1">使用说明</p>
            <p className="text-warm-600">
              请从小红书等平台<strong>复制文字内容</strong>粘贴到下方，AI 会分析并帮你分类。
              由于技术限制，无法直接获取链接内容或识别图片，请手动复制有用的文字信息。
            </p>
          </div>
        </div>
      </div>

      {/* 内容输入区 */}
      <div className="card-soft p-5 border border-coral-100 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-coral-400" size={18} />
          <span className="font-semibold text-warm-800">粘贴内容</span>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="从小红书复制文字内容粘贴到这里...&#10;&#10;例如：孕中期必备好物清单，孕妇枕真的太好用了，托腹带建议..."
          rows={5}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all duration-200 resize-none"
        />
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-warm-500">
            {content.length > 0 ? `已输入 ${content.length} 字` : '支持粘贴多段内容'}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={!content.trim() || isLoading}
            className="px-6 py-2.5 gradient-coral text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                分析中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                AI 分析分类
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        )}

        {/* 分析结果预览 */}
        {parseResult && (
          <div className="mt-4 p-4 bg-mint-50 rounded-2xl border border-mint-200 animate-fade-in-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-mint-500" />
                <span className="text-sm font-bold text-mint-600">AI 分析结果</span>
              </div>
              <button
                onClick={() => setParseResult(null)}
                className="p-1 hover:bg-mint-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} className="text-warm-500" />
              </button>
            </div>

            <h4 className="font-bold text-warm-800 text-lg mb-2">{parseResult.title || '未识别标题'}</h4>
            <p className="text-sm text-warm-600 mb-3">{parseResult.summary || '无摘要'}</p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {parseResult.targetWeek !== null && (
                <span className="text-xs bg-coral-100 text-coral-500 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Calendar size={10} />
                  孕{parseResult.targetWeek}周
                </span>
              )}
              {parseResult.stage && (
                <span className="text-xs bg-sunny-100 text-sunny-600 px-2 py-1 rounded-full font-medium">
                  {getStageLabel(parseResult.stage)}
                </span>
              )}
              {parseResult.suggestedCategory && (
                <span className="text-xs bg-lavender-100 text-lavender-500 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Tag size={10} />
                  {parseResult.suggestedCategory}
                </span>
              )}
            </div>

            {/* 提取的产品 */}
            {parseResult.products && parseResult.products.length > 0 && (
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
            {parseResult.tips && parseResult.tips.length > 0 && (
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
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 gradient-coral text-white rounded-xl font-medium cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                保存到收集
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 已收集列表 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-warm-800">已收集内容</h2>
        {importedItems.length > 0 && (
          <span className="text-sm text-warm-500">{importedItems.length} 条</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {importedItems.length > 0 ? (
          importedItems.map((item) => (
            <div
              key={item.id}
              className={`card-soft p-4 border transition-all duration-200 ${
                item.isIntegrated ? 'border-mint-200 bg-mint-50/30' : 'border-cream-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 状态图标 */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.isIntegrated ? 'bg-mint-100' : 'bg-coral-50'
                }`}>
                  {item.isIntegrated ? (
                    <Check className="text-mint-500" size={18} />
                  ) : (
                    <FileText className="text-coral-400" size={18} />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-800 mb-1 truncate">{item.sourceTitle}</h3>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.targetWeek !== null && (
                      <span className="text-xs bg-coral-50 text-coral-500 px-1.5 py-0.5 rounded">
                        孕{item.targetWeek}周
                      </span>
                    )}
                    {item.targetStage && (
                      <span className="text-xs bg-sunny-50 text-sunny-600 px-1.5 py-0.5 rounded">
                        {getStageLabel(item.targetStage)}
                      </span>
                    )}
                    {item.tags?.[0] && (
                      <span className="text-xs bg-cream-100 text-warm-500 px-1.5 py-0.5 rounded">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>

                  {/* 摘要 */}
                  {item.content && (
                    <p className="text-xs text-warm-500 line-clamp-2 mb-2">{item.content}</p>
                  )}

                  {/* 操作 */}
                  <div className="flex items-center gap-3">
                    {!item.isIntegrated && (
                      <button
                        onClick={() => markAsIntegrated(item.id)}
                        className="text-xs text-mint-600 hover:text-mint-700 font-medium cursor-pointer"
                      >
                        标记已整合
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-warm-400 hover:text-red-500 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      删除
                    </button>
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
            <h3 className="font-display text-xl text-warm-700 mb-2">暂无收集内容</h3>
            <p className="text-sm text-warm-500">从小红书复制有用的文字内容，AI 帮你分类整理</p>
          </div>
        )}
      </div>
    </div>
  );
}
