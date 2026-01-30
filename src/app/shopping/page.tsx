'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import {
  ShoppingBag,
  Plus,
  Check,
  Trash2,
  Package,
  Baby,
  Sparkles,
} from 'lucide-react';

/**
 * 购物清单页面 - 温馨母婴风格
 */
export default function ShoppingPage() {
  const { shoppingList, toggleShoppingItem, removeShoppingItem } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // 阶段分类
  const stages = [
    { id: 'all', name: '全部阶段', icon: ShoppingBag },
    { id: 'early', name: '孕早期', icon: Baby },
    { id: 'middle', name: '孕中期', icon: Baby },
    { id: 'late', name: '孕晚期', icon: Baby },
    { id: 'hospital', name: '待产包', icon: Package },
  ];

  // 过滤数据
  const filteredList = shoppingList.filter((item) => {
    if (filter === 'pending' && item.checked) return false;
    if (filter === 'completed' && !item.checked) return false;
    if (stageFilter !== 'all' && item.stage !== stageFilter) return false;
    return true;
  });

  // 统计
  const totalCount = shoppingList.length;
  const checkedCount = shoppingList.filter((i) => i.checked).length;
  const pendingCount = totalCount - checkedCount;

  // 按阶段分组
  const groupedByStage = stages.slice(1).map((stage) => ({
    ...stage,
    items: filteredList.filter((item) => item.stage === stage.id),
  })).filter((group) => stageFilter === 'all' || group.id === stageFilter);

  return (
    <div className="animate-fade-in space-y-6">
      {/* 标题卡片 */}
      <div className="card-soft p-6 border border-peach-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-peach-400 to-pink-400 flex items-center justify-center shadow-gentle">
              <ShoppingBag className="text-white" size={26} />
            </div>
            <div>
              <h1 className="font-display text-2xl text-text-primary mb-1">购物清单</h1>
              <p className="text-sm text-text-secondary">
                共 {totalCount} 项 · 已购 {checkedCount} · 待购 <span className="text-pink-500 font-semibold">{pendingCount}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-peach-500 font-number">{pendingCount}</div>
            <div className="text-xs text-text-soft">待购</div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-3">
        {/* 阶段筛选 */}
        <div className="flex gap-2 flex-wrap">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                stageFilter === stage.id
                  ? 'bg-gradient-to-r from-pink-400 to-peach-400 text-white shadow-gentle'
                  : 'bg-white border border-neutral-soft text-text-primary hover:border-pink-300'
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 ml-auto">
          {[
            { id: 'all', name: '全部' },
            { id: 'pending', name: '待购' },
            { id: 'completed', name: '已购' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-mint-400 text-white'
                  : 'bg-white border border-neutral-soft text-text-primary hover:border-mint-300'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 购物列表 - 按阶段分组 */}
      {groupedByStage.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {groupedByStage.map((group) => (
            <div key={group.id} className="card-gentle border border-neutral-soft">
              <div className="p-5 border-b border-neutral-soft bg-gradient-to-r from-cream-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-peach-100 flex items-center justify-center">
                    <group.icon className="text-pink-500" size={20} />
                  </div>
                  <span className="font-semibold text-text-primary flex-1">{group.name}</span>
                  <span className="text-xs text-text-soft bg-cream-100 px-2.5 py-1 rounded-full">
                    {group.items.filter((i) => i.checked).length}/{group.items.length}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {group.items.length > 0 ? (
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                          item.checked
                            ? 'bg-mint-50 border border-mint-200'
                            : 'bg-cream-50 hover:bg-cream-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleShoppingItem(item.id)}
                          className="mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className={`font-medium block mb-1 ${
                            item.checked ? 'text-text-soft line-through' : 'text-text-primary'
                          }`}>
                            {item.name}
                          </span>
                          {item.reason && (
                            <p className="text-xs text-text-secondary">{item.reason}</p>
                          )}
                          {item.recommendedBrands && item.recommendedBrands.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.recommendedBrands.map((brand, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-peach-50 text-peach-600 text-xs rounded">
                                  {brand}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeShoppingItem(item.id)}
                          className="text-text-soft hover:text-pink-500 hover:bg-pink-50 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-soft text-center py-8">暂无物品</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-soft p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-text-soft mx-auto mb-4 opacity-50" />
          <p className="text-text-secondary">购物清单为空</p>
        </div>
      )}

      {/* AI 推荐提示 */}
      <div className="card-gentle border border-sky-100 p-5 bg-gradient-to-r from-sky-50 to-mint-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-gentle">
            <Sparkles className="text-sky-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary mb-1">智能推荐功能</p>
            <p className="text-sm text-text-secondary">
              AI 会从你收藏的笔记中自动提取推荐物品添加到清单
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
