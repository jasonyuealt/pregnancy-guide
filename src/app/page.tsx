'use client';

import { useAppStore } from '@/bloc/app.bloc';
import WeekProgress from '@/components/feed/WeekProgress';
import CategorySection from '@/components/feed/CategorySection';
import { BookOpen, Settings, ChevronRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 首页 - Feed 流
 * 展示当前孕周的个性化内容聚合
 */
export default function HomePage() {
  const {
    settings,
    xhsNotes,
    weekKnowledgeCache,
    getCurrentWeekInfo,
    aggregateWeekKnowledge,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误 - 只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  const weekInfo = mounted ? getCurrentWeekInfo() : { week: 0, day: 0, totalDays: 0, stage: '', daysUntilDue: 0 };
  const { week, day, totalDays, stage, daysUntilDue } = weekInfo;

  // 获取当前孕周的知识
  const currentWeekKnowledge = mounted ? weekKnowledgeCache[week] : null;

  // 当笔记数据变化时，重新聚合知识
  useEffect(() => {
    if (mounted && xhsNotes.length > 0 && week > 0) {
      aggregateWeekKnowledge(week);
    }
  }, [mounted, xhsNotes.length, week]);

  const hasSettings = !!settings.dueDate || !!settings.lmpDate;

  // 显示加载状态
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* 未设置预产期提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="block p-4 bg-gradient-to-r from-warm-100 to-peach-100 rounded-2xl border border-warm-200 hover:shadow-gentle transition-all"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-warm-500" size={20} />
            <span className="text-sm text-text-primary font-medium flex-1">
              设置末次月经或预产期，开始记录你的孕期时光
            </span>
            <ChevronRight className="text-text-secondary" size={18} />
          </div>
        </Link>
      )}

      {/* 孕周进度大卡片 */}
      <WeekProgress
        week={week}
        day={day}
        totalDays={totalDays}
        daysUntilDue={daysUntilDue}
        stage={stage}
      />

      {/* 主内容区 - Feed 流 */}
      {xhsNotes.length > 0 && currentWeekKnowledge ? (
        <div className="space-y-6">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-text-primary mb-1">本周精选内容</h2>
              <p className="text-sm text-text-secondary">
                从 {currentWeekKnowledge.totalNotes} 篇笔记中整理
              </p>
            </div>
            <Link
              href="/content"
              className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 transition-colors font-medium"
            >
              查看全部
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* 类别内容区块 */}
          <CategorySection
            week={week}
            categories={{
              nutrition: currentWeekKnowledge.nutritionSummary,
              checkup: currentWeekKnowledge.checkupSummary,
              exercise: currentWeekKnowledge.exerciseSummary,
              product: currentWeekKnowledge.productSummary,
              symptom: currentWeekKnowledge.symptomSummary,
              experience: currentWeekKnowledge.experienceSummary,
            }}
            highlightPoints={currentWeekKnowledge.highlightPoints}
          />

          {/* 快速导航 */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link
              href="/content"
              className="card-gentle card-hover border border-pink-100 p-5 flex flex-col items-center justify-center gap-2 text-center"
            >
              <BookOpen className="text-pink-500" size={24} />
              <span className="font-medium text-text-primary">我的内容</span>
              <span className="text-xs text-text-secondary">{xhsNotes.length} 篇笔记</span>
            </Link>
            
            <Link
              href="/shopping"
              className="card-gentle card-hover border border-peach-100 p-5 flex flex-col items-center justify-center gap-2 text-center"
            >
              <Sparkles className="text-peach-500" size={24} />
              <span className="font-medium text-text-primary">购物清单</span>
              <span className="text-xs text-text-secondary">待购物品</span>
            </Link>
          </div>
        </div>
      ) : (
        // 空状态 - 引导用户开始添加内容
        <div className="card-soft p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-peach-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-pink-400" />
          </div>
          
          <h3 className="font-display text-2xl text-text-primary mb-3">
            开始你的孕期记录
          </h3>
          
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            刷小红书时看到有用的孕期内容？
            <br />
            点击右下角 ➕ 按钮，AI 会自动分析并整理到对应孕周
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Heart className="text-pink-400" size={16} />
              <span>智能分类</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Sparkles className="text-peach-400" size={16} />
              <span>自动整理</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <BookOpen className="text-mint-400" size={16} />
              <span>越用越懂你</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
