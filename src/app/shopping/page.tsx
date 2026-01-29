'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import {
  ShoppingBag,
  Plus,
  Check,
  Trash2,
  Filter,
  Package,
  Baby,
  Sparkles,
} from 'lucide-react';

/**
 * 购物清单页面 - 分阶段管理
 */
export default function ShoppingPage() {
  const { shoppingList, toggleShoppingItem, removeShoppingItem } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // 阶段分类
  const stages = [
    { id: 'all', name: '全部', icon: ShoppingBag },
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
    <div className="animate-fade-in min-h-[calc(100vh-4rem)]">
      {/* 顶部统计 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-sunny flex items-center justify-center shadow">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl text-warm-800">购物清单</h1>
            <p className="text-sm text-warm-500">
              共 {totalCount} 项 · 已购 {checkedCount} · 待购 <span className="text-sunny-500 font-medium">{pendingCount}</span>
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 gradient-coral text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2">
          <Plus size={18} />
          添加物品
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* 阶段筛选 */}
        <div className="flex gap-2 p-1 bg-cream-100 rounded-xl">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                stageFilter === stage.id
                  ? 'bg-white text-coral-500 shadow-sm'
                  : 'text-warm-600 hover:text-warm-800'
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 p-1 bg-cream-100 rounded-xl ml-auto">
          {[
            { id: 'all', name: '全部' },
            { id: 'pending', name: '待购' },
            { id: 'completed', name: '已购' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === f.id
                  ? 'bg-white text-mint-500 shadow-sm'
                  : 'text-warm-600 hover:text-warm-800'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 购物列表 - 按阶段分组 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {groupedByStage.map((group) => (
          <div key={group.id} className="card-soft p-5 border border-cream-200">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                group.id === 'hospital' ? 'bg-lavender-100' : 'bg-coral-100'
              }`}>
                <group.icon className={group.id === 'hospital' ? 'text-lavender-500' : 'text-coral-500'} size={16} />
              </div>
              <span className="font-display text-lg text-warm-800">{group.name}</span>
              <span className="text-xs text-warm-500 bg-cream-200 px-2 py-0.5 rounded-full ml-auto">
                {group.items.filter((i) => i.checked).length}/{group.items.length}
              </span>
            </div>

            {group.items.length > 0 ? (
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      item.checked
                        ? 'bg-mint-50 border border-mint-100'
                        : 'bg-cream-50 hover:bg-cream-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        item.checked
                          ? 'bg-mint-400 border-mint-400'
                          : 'border-cream-300 hover:border-mint-400'
                      }`}
                    >
                      {item.checked && <Check className="text-white" size={14} />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? 'text-warm-500 line-through' : 'text-warm-700'}`}>
                      {item.name}
                    </span>
                    {item.source === 'xiaohongshu' && (
                      <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">小红书</span>
                    )}
                    {item.source === 'ai' && (
                      <span className="text-xs text-lavender-500 bg-lavender-50 px-2 py-0.5 rounded-full">AI</span>
                    )}
                    <button
                      onClick={() => removeShoppingItem(item.id)}
                      className="p-1.5 text-warm-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-warm-400 text-center py-6">暂无物品</p>
            )}

            <button className="mt-3 w-full py-2 border-2 border-dashed border-cream-300 rounded-xl text-sm text-warm-500 font-medium hover:border-coral-300 hover:text-coral-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
              <Plus size={14} />
              添加到{group.name}
            </button>
          </div>
        ))}
      </div>

      {/* AI 推荐 */}
      <div className="mt-5 p-5 card-soft border border-lavender-100 bg-gradient-to-r from-lavender-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow">
            <Sparkles className="text-lavender-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-warm-800">AI 智能推荐</p>
            <p className="text-sm text-warm-500">根据当前孕周，AI 为你推荐需要购买的物品</p>
          </div>
          <button className="px-5 py-2.5 gradient-coral text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer">
            生成推荐
          </button>
        </div>
      </div>
    </div>
  );
}
