'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { generateWeekContent, convertToWeekItems, parseXiaohongshuContent } from '@/lib/ai';
import { WeekItem, ItemType, SOURCE_LABELS } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  Plus,
  Check,
  Trash2,
  Edit3,
  X,
  Loader2,
  FileText,
  ShoppingBag,
  AlertCircle,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

/**
 * 首页 - 任务清单形式
 */
export default function HomePage() {
  const {
    settings,
    getCurrentWeekInfo,
    getWeekData,
    addItem,
    addItems,
    updateItem,
    deleteItem,
    toggleItem,
    setWeekData,
  } = useAppStore();

  const { week: actualWeek, day, stage, daysUntilDue } = getCurrentWeekInfo();
  const [currentWeek, setCurrentWeek] = useState(actualWeek);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<ItemType>('todo');
  const [editingItem, setEditingItem] = useState<WeekItem | null>(null);

  const weekData = getWeekData(currentWeek);
  const isCurrentWeek = currentWeek === actualWeek;
  const hasSettings = !!settings.dueDate || !!settings.lmpDate;

  // 按类型分组内容
  const groupedItems = useMemo(() => {
    const groups: Record<ItemType, WeekItem[]> = {
      todo: [],
      shopping: [],
      tip: [],
      forWife: [],
    };
    weekData.items.forEach((item) => {
      if (groups[item.type]) {
        groups[item.type].push(item);
      }
    });
    return groups;
  }, [weekData.items]);

  // AI 生成内容
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await generateWeekContent(currentWeek);
      const items = convertToWeekItems(content, currentWeek);
      addItems(currentWeek, items);
    } catch (error) {
      console.error('生成失败:', error);
      alert('AI 生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 周切换
  const goToPrevWeek = () => setCurrentWeek((w) => Math.max(0, w - 1));
  const goToNextWeek = () => setCurrentWeek((w) => Math.min(39, w + 1));
  const goToCurrentWeek = () => setCurrentWeek(actualWeek);

  // 内容区块配置
  const sections: { type: ItemType; icon: typeof Check; title: string; color: string }[] = [
    { type: 'todo', icon: Check, title: '待办事项', color: 'mint' },
    { type: 'shopping', icon: ShoppingBag, title: '购物清单', color: 'coral' },
    { type: 'tip', icon: AlertCircle, title: '注意事项', color: 'sunny' },
    { type: 'forWife', icon: Heart, title: '为老婆做', color: 'lavender' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* 未设置提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-sunny-100 to-coral-100 rounded-2xl border border-sunny-200 hover:shadow-md transition-all"
        >
          <Settings className="text-sunny-500" size={20} />
          <span className="text-warm-700 font-medium">设置预产期以计算孕周</span>
          <ChevronRight className="text-warm-400 ml-auto" size={18} />
        </Link>
      )}

      {/* 顶部：周切换 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevWeek}
          disabled={currentWeek <= 0}
          className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-30"
        >
          <ChevronLeft className="text-warm-600" size={20} />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-display text-3xl text-warm-800">孕{currentWeek}</span>
            {isCurrentWeek && (
              <span className="text-lg text-coral-400 font-bold">+{day}</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-coral-100 text-coral-500 rounded-full text-xs font-medium">
              {stage}
            </span>
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="text-coral-500 hover:underline cursor-pointer text-xs"
              >
                回到本周
              </button>
            )}
            {isCurrentWeek && hasSettings && (
              <span className="text-warm-500">距预产期 {daysUntilDue} 天</span>
            )}
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          disabled={currentWeek >= 39}
          className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-30"
        >
          <ChevronRight className="text-warm-600" size={20} />
        </button>
      </div>

      {/* 内容区块 */}
      {sections.map(({ type, icon: Icon, title, color }) => (
        <div key={type} className="mb-5">
          {/* 区块标题 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`text-${color}-500`} size={18} />
              <span className="font-semibold text-warm-800">{title}</span>
              <span className="text-xs text-warm-400">
                {groupedItems[type].filter((i) => i.completed).length}/{groupedItems[type].length}
              </span>
            </div>
            <button
              onClick={() => {
                setAddType(type);
                setShowAddModal(true);
              }}
              className="p-1 hover:bg-cream-100 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="text-warm-400" size={16} />
            </button>
          </div>

          {/* 内容列表 */}
          <div className="space-y-2">
            {groupedItems[type].length > 0 ? (
              groupedItems[type].map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  week={currentWeek}
                  onToggle={() => toggleItem(currentWeek, item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => {
                    if (confirm('确定删除？')) {
                      deleteItem(currentWeek, item.id);
                    }
                  }}
                  showCheckbox={type === 'todo' || type === 'shopping' || type === 'forWife'}
                />
              ))
            ) : (
              <div className="text-center py-4 text-warm-400 text-sm">
                暂无内容
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 底部操作 */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setShowImportModal(true)}
          className="flex-1 py-3 bg-white border border-cream-200 text-warm-700 rounded-2xl font-medium hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <FileText size={18} />
          导入小红书
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1 py-3 gradient-coral text-white rounded-2xl font-medium hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              生成中...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              AI 生成内容
            </>
          )}
        </button>
      </div>

      {/* 添加弹窗 */}
      {showAddModal && (
        <AddModal
          type={addType}
          week={currentWeek}
          onClose={() => setShowAddModal(false)}
          onAdd={(content, note) => {
            addItem(currentWeek, {
              type: addType,
              content,
              note,
              source: 'user',
              completed: false,
              week: currentWeek,
            });
            setShowAddModal(false);
          }}
        />
      )}

      {/* 编辑弹窗 */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(content, note) => {
            updateItem(currentWeek, editingItem.id, { content, note });
            setEditingItem(null);
          }}
        />
      )}

      {/* 导入弹窗 */}
      {showImportModal && (
        <ImportModal
          currentWeek={currentWeek}
          onClose={() => setShowImportModal(false)}
          onImport={(items, targetWeek) => {
            items.forEach((item) => {
              addItem(targetWeek, {
                type: item.type,
                content: item.content,
                note: item.note,
                source: 'xiaohongshu',
                completed: false,
                week: targetWeek,
              });
            });
            setShowImportModal(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * 内容行组件
 */
function ItemRow({
  item,
  week,
  onToggle,
  onEdit,
  onDelete,
  showCheckbox,
}: {
  item: WeekItem;
  week: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showCheckbox: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all ${
        item.completed ? 'border-mint-200 bg-mint-50/50' : 'border-cream-200'
      }`}
    >
      {/* 勾选框 */}
      {showCheckbox && (
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
            item.completed
              ? 'bg-mint-400 border-mint-400'
              : 'border-warm-300 hover:border-mint-400'
          }`}
        >
          {item.completed && <Check className="text-white" size={12} />}
        </button>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            item.completed ? 'text-warm-400 line-through' : 'text-warm-700'
          }`}
        >
          {item.content}
        </p>
        {item.note && (
          <p className="text-xs text-warm-400 mt-0.5">{item.note}</p>
        )}
      </div>

      {/* 来源标签 */}
      <span
        className={`text-xs px-1.5 py-0.5 rounded ${
          item.source === 'ai'
            ? 'bg-lavender-100 text-lavender-500'
            : item.source === 'xiaohongshu'
            ? 'bg-red-50 text-red-400'
            : 'bg-cream-100 text-warm-500'
        }`}
      >
        {SOURCE_LABELS[item.source]}
      </span>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-1 hover:bg-cream-100 rounded transition-colors cursor-pointer"
        >
          <Edit3 className="text-warm-400" size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
        >
          <Trash2 className="text-warm-400 hover:text-red-400" size={14} />
        </button>
      </div>
    </div>
  );
}

/**
 * 添加弹窗
 */
function AddModal({
  type,
  week,
  onClose,
  onAdd,
}: {
  type: ItemType;
  week: number;
  onClose: () => void;
  onAdd: (content: string, note?: string) => void;
}) {
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');

  const typeLabels: Record<ItemType, string> = {
    todo: '待办事项',
    shopping: '购物物品',
    tip: '注意事项',
    forWife: '为老婆做的事',
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md animate-fade-in-scale">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-warm-800">添加{typeLabels[type]}</h3>
          <button onClick={onClose} className="p-1 hover:bg-cream-100 rounded-lg cursor-pointer">
            <X className="text-warm-400" size={20} />
          </button>
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`输入${typeLabels[type]}...`}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all mb-3"
          autoFocus
        />

        {type === 'shopping' && (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="购买理由（可选）"
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all mb-3"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-cream-100 text-warm-600 rounded-xl font-medium cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => content.trim() && onAdd(content.trim(), note.trim() || undefined)}
            disabled={!content.trim()}
            className="flex-1 py-2.5 gradient-coral text-white rounded-xl font-medium cursor-pointer disabled:opacity-50"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 编辑弹窗
 */
function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: WeekItem;
  onClose: () => void;
  onSave: (content: string, note?: string) => void;
}) {
  const [content, setContent] = useState(item.content);
  const [note, setNote] = useState(item.note || '');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md animate-fade-in-scale">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-warm-800">编辑内容</h3>
          <button onClick={onClose} className="p-1 hover:bg-cream-100 rounded-lg cursor-pointer">
            <X className="text-warm-400" size={20} />
          </button>
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all mb-3"
          autoFocus
        />

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="备注（可选）"
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-cream-100 text-warm-600 rounded-xl font-medium cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => content.trim() && onSave(content.trim(), note.trim() || undefined)}
            disabled={!content.trim()}
            className="flex-1 py-2.5 gradient-coral text-white rounded-xl font-medium cursor-pointer disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 导入弹窗
 */
function ImportModal({
  currentWeek,
  onClose,
  onImport,
}: {
  currentWeek: number;
  onClose: () => void;
  onImport: (items: { type: ItemType; content: string; note?: string }[], targetWeek: number) => void;
}) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    suggestedWeek: number | null;
    items: { type: ItemType; content: string; note?: string }[];
  } | null>(null);
  const [targetWeek, setTargetWeek] = useState(currentWeek);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const parsed = await parseXiaohongshuContent(text, currentWeek);
      setResult(parsed);
      if (parsed.suggestedWeek !== null) {
        setTargetWeek(parsed.suggestedWeek);
      }
    } catch (error) {
      console.error('解析失败:', error);
      alert('解析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in-scale">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-warm-800">导入小红书内容</h3>
          <button onClick={onClose} className="p-1 hover:bg-cream-100 rounded-lg cursor-pointer">
            <X className="text-warm-400" size={20} />
          </button>
        </div>

        <p className="text-sm text-warm-500 mb-3">
          粘贴从小红书复制的文字内容，AI 会分析并提取有用信息
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="粘贴内容..."
          rows={4}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-700 placeholder:text-warm-400 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all resize-none mb-3"
        />

        {!result ? (
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="w-full py-3 gradient-coral text-white rounded-xl font-medium cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                分析中...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI 分析
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-mint-50 rounded-xl border border-mint-200">
              <p className="text-sm text-warm-700 font-medium mb-2">{result.summary}</p>
              {result.items.length > 0 ? (
                <div className="space-y-1">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-warm-600">
                      <span className="text-xs bg-white px-1.5 py-0.5 rounded text-warm-500">
                        {item.type === 'todo' ? '待办' : item.type === 'shopping' ? '购物' : item.type === 'tip' ? '注意' : '为老婆'}
                      </span>
                      {item.content}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-warm-500">未提取到有效内容</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-warm-600">添加到：</span>
              <select
                value={targetWeek}
                onChange={(e) => setTargetWeek(Number(e.target.value))}
                className="px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-lg text-warm-700 text-sm"
              >
                {Array.from({ length: 40 }, (_, i) => (
                  <option key={i} value={i}>
                    孕{i}周 {i === currentWeek ? '(当前)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-2.5 bg-cream-100 text-warm-600 rounded-xl font-medium cursor-pointer"
              >
                重新分析
              </button>
              <button
                onClick={() => result.items.length > 0 && onImport(result.items, targetWeek)}
                disabled={result.items.length === 0}
                className="flex-1 py-2.5 gradient-coral text-white rounded-xl font-medium cursor-pointer disabled:opacity-50"
              >
                确认导入
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
