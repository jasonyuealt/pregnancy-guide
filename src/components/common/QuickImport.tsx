'use client';

import { useState } from 'react';
import { Link2, X, Sparkles, Check } from 'lucide-react';

/**
 * 全局悬浮的快速导入组件
 * 随时粘贴小红书链接，AI 解析并建议放置位置
 */
export default function QuickImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    suggestedWeek: number;
    category: string;
    summary: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    // TODO: 调用 AI 解析
    // 模拟 AI 返回
    setTimeout(() => {
      setResult({
        title: '孕中期必买好物清单',
        suggestedWeek: 24,
        category: '购物建议',
        summary: '文章推荐了孕妇枕、托腹带、DHA等孕中期必备物品...',
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleConfirm = () => {
    // TODO: 保存到对应位置
    setResult(null);
    setUrl('');
    setIsOpen(false);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-coral shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer z-50"
        title="快速导入小红书"
      >
        <Link2 className="text-white" size={24} />
      </button>

      {/* 弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md shadow-2xl animate-fade-in-scale">
            {/* 头部 */}
            <div className="flex items-center justify-between p-5 border-b border-cream-200">
              <h3 className="font-display text-xl text-warm-800">快速导入</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setResult(null);
                  setUrl('');
                }}
                className="p-2 hover:bg-cream-100 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                <X size={20} className="text-warm-600" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-5">
              {!result ? (
                <>
                  <p className="text-sm text-warm-600 mb-4">
                    粘贴小红书文章链接，AI 会自动解析内容并建议放置位置
                  </p>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="粘贴小红书链接..."
                    className="w-full px-4 py-3 bg-cream-100 rounded-2xl text-warm-700 placeholder:text-warm-400 mb-4"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!url.trim() || isLoading}
                    className="w-full py-3 gradient-coral text-white rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AI 解析中...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        解析内容
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* AI 解析结果 */}
                  <div className="p-4 bg-mint-50 rounded-2xl border border-mint-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-mint-500" />
                      <span className="text-sm font-bold text-mint-600">AI 建议</span>
                    </div>
                    <h4 className="font-bold text-warm-800 mb-2">{result.title}</h4>
                    <p className="text-sm text-warm-600 mb-3">{result.summary}</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-coral-100 text-coral-500 px-2 py-1 rounded-full font-medium">
                        第 {result.suggestedWeek} 周
                      </span>
                      <span className="text-xs bg-sunny-100 text-sunny-600 px-2 py-1 rounded-full font-medium">
                        {result.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setResult(null)}
                      className="flex-1 py-3 bg-cream-200 text-warm-700 rounded-2xl font-semibold cursor-pointer"
                    >
                      修改位置
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 py-3 gradient-coral text-white rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={18} />
                      确认添加
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
