'use client';

import { ChevronRight, FileText } from 'lucide-react';
import { useState } from 'react';

/**
 * 内容卡片属性
 */
interface ContentCardProps {
  title: string;
  icon: string;
  emoji?: string;
  items: string[];
  sourceCount: number;
  category?: string;
  onViewSources?: () => void;
}

/**
 * Feed 流内容卡片
 * 展示整合后的知识点，温馨母婴风格
 */
export default function ContentCard({
  title,
  icon,
  emoji,
  items,
  sourceCount,
  category,
  onViewSources,
}: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 根据类别选择渐变色
  const categoryGradients: Record<string, string> = {
    nutrition: 'from-pink-50 to-peach-50',
    checkup: 'from-sky-50 to-mint-50',
    exercise: 'from-peach-50 to-warm-50',
    product: 'from-mint-50 to-sky-50',
    symptom: 'from-warm-50 to-peach-50',
    experience: 'from-pink-50 to-sky-50',
  };
  
  const borderColors: Record<string, string> = {
    nutrition: 'border-pink-100',
    checkup: 'border-sky-100',
    exercise: 'border-peach-100',
    product: 'border-mint-100',
    symptom: 'border-warm-200',
    experience: 'border-pink-100',
  };
  
  const gradientClass = category ? categoryGradients[category] || 'from-pink-50 to-peach-50' : 'from-pink-50 to-peach-50';
  const borderClass = category ? borderColors[category] || 'border-pink-100' : 'border-pink-100';
  
  // 显示的条目数量
  const displayItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;
  
  if (items.length === 0) return null;

  return (
    <div className={`card-gentle border ${borderClass} overflow-hidden animate-fade-in-up`}>
      {/* 顶部装饰条 */}
      <div className={`h-1 bg-gradient-to-r ${gradientClass}`}></div>
      
      <div className="p-5">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji || icon}</span>
            <h3 className="font-semibold text-lg text-text-primary">{title}</h3>
          </div>
          
          {sourceCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <FileText size={14} />
              <span>{sourceCount} 篇笔记</span>
            </div>
          )}
        </div>
        
        {/* 内容列表 */}
        <div className="space-y-3">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-text-primary leading-relaxed"
            >
              <span className="text-pink-400 mt-1 flex-shrink-0">•</span>
              <p className="flex-1">{item}</p>
            </div>
          ))}
        </div>
        
        {/* 展开/收起按钮 */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-sm text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1 font-medium"
          >
            {isExpanded ? '收起' : `还有 ${items.length - 3} 条`}
            <ChevronRight
              size={14}
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        )}
        
        {/* 查看来源按钮 */}
        {onViewSources && sourceCount > 0 && (
          <button
            onClick={onViewSources}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-peach-50 hover:from-pink-100 hover:to-peach-100 text-text-primary text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            查看来源笔记
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
