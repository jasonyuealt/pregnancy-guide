'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { Search, Filter, Heart, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { XhsNote } from '@/types';

/**
 * 我的内容页面
 * 合并 collection 和 knowledge 功能
 * 统一的内容浏览和管理界面
 */
export default function ContentPage() {
  const xhsNotes = useAppStore((state) => state.xhsNotes);
  const updateXhsNote = useAppStore((state) => state.updateXhsNote);
  const removeXhsNote = useAppStore((state) => state.removeXhsNote);
  const toggleNoteFavorite = useAppStore((state) => state.toggleNoteFavorite);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'week'>('time');

  // 分类统计
  const categoryCounts = xhsNotes.reduce((acc, note) => {
    const category = note.aiAnalysis?.category || 'experience';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 孕周统计
  const weekCounts = xhsNotes.reduce((acc, note) => {
    note.aiAnalysis?.weeks.forEach((week) => {
      acc[week] = (acc[week] || 0) + 1;
    });
    return acc;
  }, {} as Record<number, number>);

  // 筛选和排序笔记
  const filteredNotes = xhsNotes
    .filter((note) => {
      // 分类筛选
      if (selectedCategory !== 'all' && note.aiAnalysis?.category !== selectedCategory) {
        return false;
      }

      // 孕周筛选
      if (selectedWeek !== 'all') {
        const week = parseInt(selectedWeek);
        if (!note.aiAnalysis?.weeks.includes(week)) {
          return false;
        }
      }

      // 搜索筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.author.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          note.aiAnalysis?.keyPoints.some((point) => point.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime();
      } else {
        // 按最小孕周排序
        const aMinWeek = Math.min(...(a.aiAnalysis?.weeks || [999]));
        const bMinWeek = Math.min(...(b.aiAnalysis?.weeks || [999]));
        return aMinWeek - bMinWeek;
      }
    });

  // 处理删除
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这篇笔记吗？')) {
      removeXhsNote(id);
    }
  };

  const categories = [
    { key: 'all', label: '全部', icon: '📚', count: xhsNotes.length },
    { key: 'nutrition', label: '营养', icon: '🥗', count: categoryCounts.nutrition || 0 },
    { key: 'checkup', label: '产检', icon: '💊', count: categoryCounts.checkup || 0 },
    { key: 'exercise', label: '运动', icon: '🏃', count: categoryCounts.exercise || 0 },
    { key: 'product', label: '物品', icon: '🛍️', count: categoryCounts.product || 0 },
    { key: 'symptom', label: '症状', icon: '⚠️', count: categoryCounts.symptom || 0 },
    { key: 'experience', label: '经验', icon: '💭', count: categoryCounts.experience || 0 },
  ];

  // 获取有笔记的孕周列表
  const availableWeeks = Object.keys(weekCounts)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-2">我的内容</h1>
        <p className="text-text-secondary">
          共 {xhsNotes.length} 篇笔记，涵盖 {availableWeeks.length} 个孕周
        </p>
      </div>

      {/* 搜索和排序 */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索标题、内容、作者、标签..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-soft bg-white text-text-primary placeholder-text-secondary focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
            />
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'time' | 'week')}
          className="px-4 py-3 rounded-2xl border border-neutral-soft bg-white text-text-primary cursor-pointer outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
        >
          <option value="time">按时间排序</option>
          <option value="week">按孕周排序</option>
        </select>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.key
                ? 'bg-gradient-to-r from-pink-500 to-peach-500 text-white shadow-soft'
                : 'bg-white border border-neutral-soft text-text-primary hover:border-pink-300'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {cat.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                selectedCategory === cat.key ? 'bg-white/20' : 'bg-pink-50 text-pink-600'
              }`}>
                {cat.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 孕周筛选 */}
      {availableWeeks.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-sm text-text-secondary whitespace-nowrap flex items-center gap-2">
            <Calendar size={16} />
            孕周:
          </span>
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedWeek === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-white border border-neutral-soft text-text-primary hover:border-pink-300'
            }`}
          >
            全部
          </button>
          {availableWeeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week.toString())}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedWeek === week.toString()
                  ? 'bg-pink-500 text-white'
                  : 'bg-white border border-neutral-soft text-text-primary hover:border-pink-300'
              }`}
            >
              第{week}周
              <span className="ml-1 text-xs opacity-75">({weekCounts[week]})</span>
            </button>
          ))}
        </div>
      )}

      {/* 笔记网格 */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleFavorite={() => toggleNoteFavorite(note.id)}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
        </div>
      ) : (
        <div className="card-soft p-12 text-center">
          <p className="text-text-secondary">没有找到匹配的笔记</p>
        </div>
      )}
    </div>
  );
}

/**
 * 笔记卡片组件
 */
function NoteCard({
  note,
  onToggleFavorite,
  onDelete,
}: {
  note: XhsNote;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const categoryIcons: Record<string, string> = {
    nutrition: '🥗',
    checkup: '💊',
    exercise: '🏃',
    product: '🛍️',
    symptom: '⚠️',
    experience: '💭',
  };

  const categoryNames: Record<string, string> = {
    nutrition: '营养',
    checkup: '产检',
    exercise: '运动',
    product: '物品',
    symptom: '症状',
    experience: '经验',
  };

  const category = note.aiAnalysis?.category || 'experience';

  return (
    <div className="card-gentle card-hover border border-neutral-soft overflow-hidden group animate-fade-in-up">
      {/* 封面图 */}
      {note.images.length > 0 && (
        <div className="relative h-48 bg-cream-100 overflow-hidden">
          <img
            src={note.images[0]}
            alt={note.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* 分类标签 */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1.5 shadow-gentle">
            <span>{categoryIcons[category]}</span>
            <span className="text-text-primary">{categoryNames[category]}</span>
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="p-5">
        {/* 标题 */}
        <h3 className="font-semibold text-text-primary mb-3 line-clamp-2 leading-snug">
          {note.title}
        </h3>

        {/* 作者 */}
        <div className="flex items-center gap-2 mb-3">
          {note.authorAvatar && (
            <img
              src={note.authorAvatar}
              alt={note.author}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm text-text-secondary">{note.author}</span>
          <span className="text-xs text-text-soft">
            ❤️ {note.likes > 1000 ? `${(note.likes / 1000).toFixed(1)}k` : note.likes}
          </span>
        </div>

        {/* AI 分析结果 */}
        {note.aiAnalysis && (
          <div className="mb-4 space-y-3">
            {/* 适用孕周 */}
            {note.aiAnalysis.weeks.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-1.5">适用孕周</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.aiAnalysis.weeks.map((week) => (
                    <span
                      key={week}
                      className="px-2.5 py-1 bg-gradient-to-r from-pink-50 to-peach-50 text-pink-600 text-xs rounded-full font-medium border border-pink-100"
                    >
                      第{week}周
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 关键要点 */}
            {note.aiAnalysis.keyPoints.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-1.5">AI 提取的关键点</p>
                <div className="space-y-1.5">
                  {note.aiAnalysis.keyPoints.slice(0, 2).map((point, index) => (
                    <p key={index} className="text-sm text-text-primary flex items-start gap-2 leading-relaxed">
                      <span className="text-pink-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="flex-1">{point}</span>
                    </p>
                  ))}
                  {note.aiAnalysis.keyPoints.length > 2 && (
                    <p className="text-xs text-text-soft ml-4">
                      +{note.aiAnalysis.keyPoints.length - 2} 更多
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 标签 */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-cream-100 text-text-secondary text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-soft">
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              note.isFavorite
                ? 'text-pink-500 hover:text-pink-600'
                : 'text-text-soft hover:text-pink-500'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`}
            />
            <span className="text-xs">{note.isFavorite ? '已收藏' : '收藏'}</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-soft hover:text-pink-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onDelete}
              className="text-text-soft hover:text-pink-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
