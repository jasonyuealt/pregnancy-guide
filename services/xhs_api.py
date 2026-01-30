"""
小红书内容提取 API 服务
使用 Playwright 直接从网页提取内容（无需复杂签名）
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import logging
import asyncio
from playwright.async_api import async_playwright

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 允许跨域请求


def extract_note_id(url: str) -> str:
    """从URL中提取note_id"""
    # xhslink 短链接
    match = re.search(r'xhslink\.com/(\w+)', url)
    if match:
        return match.group(1)
    
    # 标准链接
    match = re.search(r'/explore/(\w+)', url)
    if match:
        return match.group(1)
    
    match = re.search(r'/item/(\w+)', url)
    if match:
        return match.group(1)
    
    return ""


async def extract_content_with_playwright(url: str, cookie: str = "") -> dict:
    """使用 Playwright 提取小红书内容"""
    async with async_playwright() as p:
        # 启动浏览器
        browser = await p.chromium.launch(headless=True)
        
        # 创建上下文
        context_options = {}
        if cookie:
            # 解析 Cookie 字符串
            cookies = []
            for item in cookie.split(';'):
                item = item.strip()
                if '=' in item:
                    name, value = item.split('=', 1)
                    cookies.append({
                        'name': name.strip(),
                        'value': value.strip(),
                        'domain': '.xiaohongshu.com',
                        'path': '/'
                    })
            context_options['storage_state'] = {'cookies': cookies}
        
        context = await browser.new_context(**context_options)
        page = await context.new_page()
        
        try:
            # 访问页面
            logger.info(f"正在访问: {url}")
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            
            # 等待内容加载
            await page.wait_for_timeout(3000)
            
            # 提取内容
            result = await page.evaluate("""
                () => {
                    // 标题
                    const titleSelectors = [
                        '[class*="title"]',
                        'h1',
                        '[class*="note-title"]',
                        '.title'
                    ];
                    let title = '';
                    for (const selector of titleSelectors) {
                        const el = document.querySelector(selector);
                        if (el?.textContent?.trim()) {
                            title = el.textContent.trim();
                            break;
                        }
                    }
                    
                    // 正文内容
                    const contentSelectors = [
                        '[class*="content"]',
                        '[class*="note-text"]',
                        '[class*="desc"]',
                        '.content'
                    ];
                    let content = '';
                    for (const selector of contentSelectors) {
                        const el = document.querySelector(selector);
                        if (el?.textContent?.trim()) {
                            content = el.textContent.trim();
                            break;
                        }
                    }
                    
                    // 如果找不到，尝试获取所有段落
                    if (!content) {
                        const paragraphs = Array.from(document.querySelectorAll('p'))
                            .map(p => p.textContent?.trim())
                            .filter(t => t && t.length > 10);
                        content = paragraphs.join('\\n');
                    }
                    
                    // 图片
                    const images = Array.from(document.querySelectorAll('img'))
                        .map(img => img.src || img.getAttribute('data-src'))
                        .filter(src => src && (src.includes('xhscdn') || src.includes('xiaohongshu')))
                        .slice(0, 9);
                    
                    // 作者
                    const authorSelectors = [
                        '[class*="author-name"]',
                        '[class*="username"]',
                        '[class*="nickname"]'
                    ];
                    let author = '';
                    for (const selector of authorSelectors) {
                        const el = document.querySelector(selector);
                        if (el?.textContent?.trim()) {
                            author = el.textContent.trim();
                            break;
                        }
                    }
                    
                    // 作者头像
                    const avatarEl = document.querySelector('[class*="avatar"] img');
                    const authorAvatar = avatarEl?.src || '';
                    
                    // 点赞数
                    let likes = 0;
                    const likesSelectors = [
                        '[class*="like-count"]',
                        '[class*="likes"]',
                        '[class*="interaction"]'
                    ];
                    for (const selector of likesSelectors) {
                        const el = document.querySelector(selector);
                        if (el?.textContent) {
                            const match = el.textContent.match(/\\d+/);
                            if (match) {
                                likes = parseInt(match[0]);
                                break;
                            }
                        }
                    }
                    
                    // 标签
                    const tags = Array.from(document.querySelectorAll('[class*="tag"], [class*="topic"]'))
                        .map(tag => tag.textContent?.trim())
                        .filter(Boolean)
                        .slice(0, 10);
                    
                    return {
                        title: title || '未命名笔记',
                        content: content || '',
                        images: images,
                        author: author || '未知作者',
                        authorAvatar: authorAvatar,
                        likes: likes,
                        tags: tags
                    };
                }
            """)
            
            return result
            
        finally:
            await browser.close()


@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'playwright_available': True
    })


@app.route('/extract', methods=['POST'])
def extract_note():
    """提取小红书笔记内容"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        cookie = data.get('cookie', '')
        
        if not url:
            return jsonify({
                'success': False,
                'error': '缺少 URL 参数'
            }), 400
        
        logger.info(f"收到提取请求: {url}")
        
        # 构建完整URL
        note_id = extract_note_id(url)
        if note_id and not url.startswith('http'):
            url = f'https://www.xiaohongshu.com/explore/{note_id}'
        
        # 使用 Playwright 提取
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result_data = loop.run_until_complete(
                extract_content_with_playwright(url, cookie)
            )
        finally:
            loop.close()
        
        # 验证结果
        if not result_data.get('title') and not result_data.get('content'):
            return jsonify({
                'success': False,
                'error': '未能提取到有效内容\n\n可能原因：\n1. 需要登录才能查看\n2. 页面结构已变化\n3. 链接已失效\n\n建议：使用「手动输入」模式'
            }), 404
        
        logger.info(f"提取成功: {result_data['title']}")
        
        return jsonify({
            'success': True,
            'data': result_data
        })
        
    except Exception as e:
        logger.error(f"提取失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'提取失败: {str(e)}'
        }), 500


if __name__ == '__main__':
    print("=" * 50)
    print("小红书内容提取 API 服务")
    print("=" * 50)
    print("使用 Playwright 提取内容（无需复杂签名）")
    print("\n服务启动中...")
    print("访问地址: http://localhost:5005")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5005, debug=True)
