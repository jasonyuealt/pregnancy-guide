'use client';

import { Baby, Calendar, Heart } from 'lucide-react';

/**
 * 孕周进度卡片属性
 */
interface WeekProgressProps {
  week: number;
  day: number;
  totalDays: number;
  daysUntilDue: number;
  stage: string;
}

/**
 * 孕周进度大卡片
 * 温馨母婴风格，展示当前孕期进度
 */
export default function WeekProgress({
  week,
  day,
  totalDays,
  daysUntilDue,
  stage,
}: WeekProgressProps) {
  // 计算进度百分比
  const progress = Math.round((totalDays / 280) * 100);
  
  // 阶段颜色
  const stageColors = {
    '孕早期': 'from-pink-400 to-peach-400',
    '孕中期': 'from-peach-400 to-warm-400',
    '孕晚期': 'from-warm-400 to-pink-400',
  };
  
  const gradientClass = stageColors[stage as keyof typeof stageColors] || 'from-pink-400 to-peach-400';

  return (
    <div className="card-soft p-6 md:p-8 overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-peach-300 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {/* 顶部信息 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Baby className="text-pink-500" size={24} />
              <span className="text-sm font-medium text-text-secondary">当前孕周</span>
            </div>
            
            {/* 孕周大数字 */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl md:text-6xl font-bold text-text-primary font-number">
                {week}
              </span>
              <span className="text-3xl md:text-4xl text-pink-500 font-number">+{day}</span>
              <span className="text-lg text-text-secondary ml-1">周</span>
            </div>
            
            <p className="text-sm text-text-secondary mt-2">
              已孕 {totalDays} 天 · {stage}
            </p>
          </div>
          
          {/* 倒计时 */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-50 to-peach-50 border border-pink-100">
              <Calendar className="text-pink-500" size={16} />
              <div>
                <p className="text-xs text-text-secondary">距离预产期</p>
                <p className="text-xl font-bold text-pink-600 font-number">{daysUntilDue}</p>
                <p className="text-xs text-text-secondary">天</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">孕期进度</span>
            <span className="font-semibold text-text-primary font-number">{progress}%</span>
          </div>
          
          <div className="h-3 bg-cream-200 rounded-full overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${progress}%` }}
            >
              {/* 光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
          
          {/* 阶段标记 */}
          <div className="flex justify-between text-xs text-text-secondary pt-1">
            <span className={week <= 12 ? 'text-pink-500 font-medium' : ''}>孕早期</span>
            <span className={week >= 13 && week <= 28 ? 'text-peach-500 font-medium' : ''}>孕中期</span>
            <span className={week >= 29 ? 'text-warm-500 font-medium' : ''}>孕晚期</span>
          </div>
        </div>
        
        {/* 温馨提示 */}
        <div className="mt-6 flex items-center gap-2 text-sm text-text-secondary">
          <Heart className="text-pink-400" size={16} />
          <p>每一天都在期待与你相遇～</p>
        </div>
      </div>
    </div>
  );
}
