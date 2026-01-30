'use client';

import ContentCard from './ContentCard';
import { useRouter } from 'next/navigation';

/**
 * 类别区块属性
 */
interface CategorySectionProps {
  week: number;
  categories: {
    nutrition: { content: string[]; sourceNotes: string[] };
    checkup: { items: any[]; sourceNotes: string[] };
    exercise: { content: string[]; sourceNotes: string[] };
    product: { items: any[]; sourceNotes: string[] };
    symptom: { content: string[]; sourceNotes: string[] };
    experience: { content: string[]; sourceNotes: string[] };
  };
  highlightPoints?: string[];
}

/**
 * 类别区块组件
 * 展示一个孕周下各个类别的内容
 */
export default function CategorySection({
  week,
  categories,
  highlightPoints = [],
}: CategorySectionProps) {
  const router = useRouter();
  
  // 查看某个类别的来源笔记
  const handleViewSources = (category: string) => {
    router.push(`/content?category=${category}&week=${week}`);
  };

  return (
    <div className="space-y-4">
      {/* 重点提醒 */}
      {highlightPoints.length > 0 && (
        <div className="card-gentle border border-warm-200 bg-gradient-to-r from-warm-50 to-peach-50 p-5 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary mb-3">本周重点提醒</h4>
              <ul className="space-y-2">
                {highlightPoints.map((point, index) => (
                  <li key={index} className="text-sm text-text-primary flex items-start gap-2">
                    <span className="text-warm-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* 各类别内容卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 营养建议 */}
        {categories.nutrition.content.length > 0 && (
          <ContentCard
            title="营养建议"
            emoji="🥗"
            items={categories.nutrition.content}
            sourceCount={categories.nutrition.sourceNotes.length}
            category="nutrition"
            onViewSources={() => handleViewSources('nutrition')}
          />
        )}
        
        {/* 产检项目 */}
        {categories.checkup.items.length > 0 && (
          <div className="card-gentle border border-sky-100 animate-fade-in-up">
            <div className="h-1 bg-gradient-to-r from-sky-50 to-mint-50"></div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💊</span>
                  <h3 className="font-semibold text-lg text-text-primary">产检项目</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <span>{categories.checkup.sourceNotes.length} 篇笔记</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {categories.checkup.items.map((checkup, index) => (
                  <div key={index} className="border-l-2 border-sky-300 pl-4">
                    <h4 className="font-medium text-text-primary mb-2">{checkup.name}</h4>
                    {checkup.timing && (
                      <p className="text-sm text-text-secondary mb-2">⏰ {checkup.timing}</p>
                    )}
                    {checkup.process && checkup.process.length > 0 && (
                      <ul className="space-y-1 text-sm text-text-primary">
                        {checkup.process.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-400">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleViewSources('checkup')}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-50 to-mint-50 hover:from-sky-100 hover:to-mint-100 text-text-primary text-sm font-medium transition-all"
              >
                查看来源笔记
              </button>
            </div>
          </div>
        )}
        
        {/* 运动建议 */}
        {categories.exercise.content.length > 0 && (
          <ContentCard
            title="运动建议"
            emoji="🏃"
            items={categories.exercise.content}
            sourceCount={categories.exercise.sourceNotes.length}
            category="exercise"
            onViewSources={() => handleViewSources('exercise')}
          />
        )}
        
        {/* 推荐物品 */}
        {categories.product.items.length > 0 && (
          <ContentCard
            title="推荐物品"
            emoji="🛍️"
            items={categories.product.items.map((p: any) => `${p.name}${p.reason ? ` - ${p.reason}` : ''}`)}
            sourceCount={categories.product.sourceNotes.length}
            category="product"
            onViewSources={() => handleViewSources('product')}
          />
        )}
        
        {/* 症状说明 */}
        {categories.symptom.content.length > 0 && (
          <ContentCard
            title="症状说明"
            emoji="⚠️"
            items={categories.symptom.content}
            sourceCount={categories.symptom.sourceNotes.length}
            category="symptom"
            onViewSources={() => handleViewSources('symptom')}
          />
        )}
        
        {/* 经验分享 */}
        {categories.experience.content.length > 0 && (
          <ContentCard
            title="经验分享"
            emoji="💭"
            items={categories.experience.content}
            sourceCount={categories.experience.sourceNotes.length}
            category="experience"
            onViewSources={() => handleViewSources('experience')}
          />
        )}
      </div>
    </div>
  );
}
