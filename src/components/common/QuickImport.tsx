'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Check, Edit3 } from 'lucide-react';
import { useAppStore } from '@/bloc/app.bloc';
import { extractXhsContent } from '@/lib/xhs-extractor';
import { analyzeXhsContent } from '@/lib/ai';
import { XhsNote } from '@/types';

/**
 * 快速导入组件 - 温馨母婴风格
 * 粘贴小红书链接，自动提取并分析内容
 */
export default function QuickImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'link' | 'manual'>('link');
  const [url, setUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const addXhsNote = useAppStore((state) => state.addXhsNote);
  const xhsCookie = useAppStore((state) => state.settings.xhsCookie);

  /**
   * 处理链接导入
   */
  const handleLinkImport = async () => {
    if (!url.trim()) {
      setErrorMessage('请输入小红书链接');
      setStatus('error');
      return;
    }

    if (!xhsCookie) {
      setErrorMessage('未配置小红书 Cookie\n\n请先在「设置」页面配置 Cookie，或使用「手动输入」模式');
      setStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('extracting');
      setErrorMessage('');

      const extractResult = await extractXhsContent(url, xhsCookie);
      
      if (!extractResult.success || !extractResult.data) {
        setErrorMessage(extractResult.error || '提取失败');
        setStatus('error');
        setIsLoading(false);
        return;
      }

      const { title, content, images, author, authorAvatar, likes, tags } = extractResult.data;

      setStatus('analyzing');
      const aiAnalysis = await analyzeXhsContent(title, content, tags);

      const note = new XhsNote({
        sourceUrl: url,
        title,
        content,
        images,
        author,
        authorAvatar,
        likes,
        tags,
        aiAnalysis,
        importedAt: new Date(),
      });

      addXhsNote(note);
      setStatus('success');
      
      setTimeout(() => handleClose(), 2000);

    } catch (error: any) {
      console.error('导入失败:', error);
      setErrorMessage(error.message || '未知错误');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理手动输入
   */
  const handleManualImport = async () => {
    if (!manualTitle.trim() || !manualContent.trim()) {
      setErrorMessage('请填写标题和内容');
      setStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('analyzing');
      setErrorMessage('');

      const aiAnalysis = await analyzeXhsContent(manualTitle, manualContent, []);

      const note = new XhsNote({
        sourceUrl: '',
        title: manualTitle,
        content: manualContent,
        images: [],
        author: '手动添加',
        authorAvatar: '',
        likes: 0,
        tags: [],
        aiAnalysis,
        importedAt: new Date(),
      });

      addXhsNote(note);
      setStatus('success');
      
      setTimeout(() => handleClose(), 2000);

    } catch (error: any) {
      console.error('导入失败:', error);
      setErrorMessage(error.message || '未知错误');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 关闭弹窗
   */
  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      setUrl('');
      setManualTitle('');
      setManualContent('');
      setStatus('idle');
      setErrorMessage('');
      setMode('link');
    }
  };

  const handleImport = mode === 'link' ? handleLinkImport : handleManualImport;

  return (
    <>
      {/* 悬浮按钮 - 温馨风格 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-peach-400 text-white shadow-card hover:shadow-soft transition-all duration-300 flex items-center justify-center z-50 hover:scale-105 active:scale-95"
        aria-label="快速导入"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>

      {/* 导入弹窗 - 温馨风格 */}
      {isOpen && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-card max-w-lg w-full overflow-hidden animate-fade-in-scale">
            {/* 头部 */}
            <div className="p-6 bg-gradient-to-r from-pink-50 to-peach-50 border-b border-neutral-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-text-primary">导入笔记</h2>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-text-soft hover:text-text-primary transition-colors p-1 hover:bg-white/50 rounded-lg disabled:opacity-50"
                >
                  <X size={22} />
                </button>
              </div>

              {/* 模式切换 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('link')}
                  disabled={isLoading}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                    mode === 'link'
                      ? 'bg-gradient-to-r from-pink-400 to-peach-400 text-white shadow-gentle'
                      : 'bg-white text-text-primary border border-neutral-soft hover:border-pink-300'
                  }`}
                >
                  🔗 链接导入
                </button>
                <button
                  onClick={() => setMode('manual')}
                  disabled={isLoading}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'manual'
                      ? 'bg-gradient-to-r from-pink-400 to-peach-400 text-white shadow-gentle'
                      : 'bg-white text-text-primary border border-neutral-soft hover:border-pink-300'
                  }`}
                >
                  <Edit3 size={16} />
                  手动输入
                </button>
              </div>
            </div>

            {/* 内容区 */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* 状态显示 */}
              {status !== 'idle' && (
                <div className={`p-4 rounded-xl mb-5 ${
                  status === 'success' ? 'bg-mint-50 border border-mint-200' :
                  status === 'error' ? 'bg-pink-50 border border-pink-200' :
                  'bg-sky-50 border border-sky-200'
                }`}>
                  {status === 'extracting' && (
                    <div className="flex items-center gap-3 text-sky-600">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-sm font-medium">正在提取内容...</span>
                    </div>
                  )}
                  {status === 'analyzing' && (
                    <div className="flex items-center gap-3 text-sky-600">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-sm font-medium">AI 智能分析中...</span>
                    </div>
                  )}
                  {status === 'success' && (
                    <div className="flex items-center gap-3 text-mint-500">
                      <Check size={18} />
                      <span className="text-sm font-medium">导入成功！已整理到知识库</span>
                    </div>
                  )}
                  {status === 'error' && errorMessage && (
                    <div className="text-pink-600">
                      <p className="text-sm font-semibold mb-1">导入失败</p>
                      <p className="text-xs whitespace-pre-line leading-relaxed">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 链接导入模式 */}
              {mode === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    小红书链接
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="粘贴小红书分享链接..."
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-neutral-soft rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all bg-white text-text-primary placeholder-text-soft disabled:bg-cream-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isLoading) handleImport();
                    }}
                  />
                  <p className="mt-2 text-xs text-text-soft leading-relaxed">
                    支持格式: http://xhslink.com/xxxxx 或<br/>
                    https://www.xiaohongshu.com/explore/xxxxx
                  </p>
                </div>
              )}

              {/* 手动输入模式 */}
              {mode === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      标题 <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="笔记标题..."
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-neutral-soft rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all bg-white text-text-primary placeholder-text-soft disabled:bg-cream-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      内容 <span className="text-pink-500">*</span>
                    </label>
                    <textarea
                      value={manualContent}
                      onChange={(e) => setManualContent(e.target.value)}
                      placeholder="复制小红书笔记内容到这里..."
                      disabled={isLoading}
                      rows={6}
                      className="w-full px-4 py-3 border border-neutral-soft rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all resize-none bg-white text-text-primary placeholder-text-soft disabled:bg-cream-100"
                    />
                    <p className="mt-2 text-xs text-text-soft">
                      如果链接导入失败，可以手动复制笔记内容
                    </p>
                  </div>
                </div>
              )}

              {/* 使用提示 */}
              <div className="mt-5 p-3 bg-sky-50 rounded-xl text-xs text-sky-700 border border-sky-100">
                <p className="font-semibold mb-2 flex items-center gap-1.5">
                  💡 使用提示
                </p>
                <ul className="space-y-1.5 ml-4">
                  {mode === 'link' ? (
                    <>
                      <li className="list-disc">打开小红书，找到想要收藏的笔记</li>
                      <li className="list-disc">点击分享按钮，复制链接</li>
                      <li className="list-disc">粘贴到这里，AI 会自动分析并整理</li>
                      <li className="list-disc">提取失败时可切换到「手动输入」模式</li>
                    </>
                  ) : (
                    <>
                      <li className="list-disc">复制小红书笔记的标题和正文</li>
                      <li className="list-disc">粘贴到上面的输入框中</li>
                      <li className="list-disc">AI 会自动分析内容并提取知识点</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="p-6 pt-0">
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-cream-100 text-text-primary rounded-xl hover:bg-cream-200 transition-all font-medium disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading || (mode === 'link' ? !url.trim() : !manualTitle.trim() || !manualContent.trim())}
                  className="flex-1 py-3.5 bg-gradient-to-r from-pink-400 to-peach-400 text-white rounded-xl hover:shadow-soft transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      处理中...
                    </>
                  ) : (
                    '开始导入'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
