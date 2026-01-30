/**
 * 小红书内容提取器
 * 使用 Python Flask API + xhs 库提取内容
 */

export interface XhsExtractResult {
  success: boolean;
  data?: {
    title: string;
    content: string;
    images: string[];
    author: string;
    authorAvatar: string;
    likes: number;
    tags: string[];
  };
  error?: string;
}

/**
 * Python API 配置
 */
const PYTHON_API_URL = process.env.NEXT_PUBLIC_XHS_API_URL || 'http://localhost:5005';

/**
 * 从小红书链接提取内容（调用 Python API）
 */
export async function extractXhsContent(shareUrl: string, cookie?: string): Promise<XhsExtractResult> {
  try {
    console.log('正在调用 Python API 提取小红书内容:', shareUrl);
    
    // 调用 Python Flask API
    const response = await fetch(`${PYTHON_API_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: shareUrl,
        cookie: cookie || '', // 可选的 cookie
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result = await response.json();
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || '提取失败',
      };
    }

    return result;

  } catch (error: any) {
    console.error('调用 Python API 失败:', error);
    
    // 检查是否是网络连接错误
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      return {
        success: false,
        error: 'Python API 服务未启动\n\n请在终端运行:\n  cd services\n  python xhs_api.py',
      };
    }
    
    return {
      success: false,
      error: `提取失败: ${error.message}`,
    };
  }
}

/**
 * 简化版：直接粘贴内容（用户手动复制小红书内容）
 * 作为备选方案
 */
export interface ManualInput {
  title: string;
  content: string;
  images?: string[];
  sourceUrl?: string;
}

export function createNoteFromManualInput(input: ManualInput): XhsExtractResult {
  if (!input.title && !input.content) {
    return {
      success: false,
      error: '标题和内容不能都为空',
    };
  }
  
  return {
    success: true,
    data: {
      title: input.title || '手动添加',
      content: input.content || '',
      images: input.images || [],
      author: '手动添加',
      authorAvatar: '',
      likes: 0,
      tags: [],
    },
  };
}
