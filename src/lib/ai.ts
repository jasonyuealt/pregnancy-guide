/**
 * AI 服务配置
 */
const AI_CONFIG = {
  baseUrl: 'https://cerebras-proxy.brain.loocaa.com:1443/v1',
  apiKey: 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK',
  model: 'qwen-3-235b-a22b-instruct-2507',
};

/**
 * AI 消息接口
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * AI 响应接口
 */
interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * 调用 AI 接口
 */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 请求失败: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * 孕周内容结构
 */
export interface WeekContentData {
  fetalSize: string;
  fetalWeight: string;
  fetalLength: string;
  fetalDevelopment: string;
  keyPoints: string[];
  checkups: { name: string; important: boolean }[];
  shopping: { name: string; reason: string }[];
  nutrition: string[];
  warnings: string[];
}

/**
 * 生成孕周内容
 */
export async function generateWeekContent(week: number): Promise<WeekContentData> {
  const systemPrompt = `你是一个专业的孕期顾问。请根据用户提供的孕周数，生成该周的完整指南。

请严格使用以下 JSON 格式返回（不要添加任何其他文字）：
{
  "fetalSize": "宝宝大小比喻（如：木瓜、柚子等）",
  "fetalWeight": "体重数字（克，纯数字）",
  "fetalLength": "身长数字（厘米，纯数字）",
  "fetalDevelopment": "胎儿发育描述（80-120字，描述本周宝宝的发育重点）",
  "keyPoints": ["本周注意事项1", "注意事项2", "注意事项3", "注意事项4"],
  "checkups": [
    { "name": "产检项目名称", "important": true或false }
  ],
  "shopping": [
    { "name": "建议购买物品", "reason": "购买理由" }
  ],
  "nutrition": ["饮食建议1", "饮食建议2", "饮食建议3"],
  "warnings": ["需要警惕的症状1", "症状2"]
}

注意：
1. 内容必须准确、专业，基于医学常识
2. keyPoints 提供 4 条最重要的本周注意事项
3. checkups 只列出本周需要做的产检，没有就返回空数组
4. shopping 推荐 2-3 个本周适合购买的物品
5. nutrition 提供 3 条饮食建议
6. warnings 列出需要警惕就医的症状`;

  const userPrompt = `请生成孕期第 ${week} 周的详细指南。`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  // 解析 JSON 响应
  try {
    // 尝试提取 JSON 部分（处理可能的 markdown 代码块）
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch {
    // 如果解析失败，返回默认数据
    console.error('AI 响应解析失败:', response);
    return {
      fetalSize: '未知',
      fetalWeight: '0',
      fetalLength: '0',
      fetalDevelopment: 'AI 生成内容解析失败，请重试。',
      keyPoints: ['请重新生成内容'],
      checkups: [],
      shopping: [],
      nutrition: [],
      warnings: [],
    };
  }
}

/**
 * 小红书解析结果
 */
export interface XiaohongshuParseResult {
  title: string;
  stage: 'early' | 'middle' | 'late' | 'hospital' | null;
  targetWeek: number | null;
  contentType: 'product' | 'tip' | 'nutrition' | 'experience';
  summary: string;
  products: { name: string; reason: string }[];
  tips: string[];
  suggestedCategory: string;
}

/**
 * 解析小红书链接/内容
 * 由于无法直接访问 URL，使用 AI 根据链接信息推断内容
 */
export async function parseXiaohongshuUrl(urlOrContent: string): Promise<XiaohongshuParseResult> {
  const systemPrompt = `你是一个孕期内容分析助手。用户会提供小红书文章的链接或内容描述。
请分析这个内容，判断它属于孕期的哪个阶段、哪种类型，并提取关键信息。

请严格使用以下 JSON 格式返回（不要添加任何其他文字）：
{
  "title": "推测的文章标题（简洁，10字以内）",
  "stage": "early/middle/late/hospital 或 null（无法确定时）",
  "targetWeek": 具体孕周数（1-40）或 null,
  "contentType": "product/tip/nutrition/experience 之一",
  "summary": "内容摘要（30字以内）",
  "products": [
    { "name": "提到的产品名", "reason": "推荐理由" }
  ],
  "tips": ["提取的注意事项或经验"],
  "suggestedCategory": "建议归类到：待产包/孕期营养/产检准备/生活护理/运动建议 等"
}

注意：
1. 如果是小红书链接，根据链接中的关键词推测内容
2. 如果是文章内容，直接提取信息
3. products 数组可以为空
4. tips 至少提供 1 条`;

  const userPrompt = `请分析以下小红书内容并提取孕期相关信息：

${urlOrContent}`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch {
    console.error('小红书解析失败:', response);
    return {
      title: '解析失败',
      stage: null,
      targetWeek: null,
      contentType: 'tip',
      summary: '无法解析该内容，请重试',
      products: [],
      tips: [],
      suggestedCategory: '其他',
    };
  }
}

/**
 * 生成 AI 购物推荐
 */
export async function generateShoppingRecommendation(
  week: number,
  stage: string
): Promise<string> {
  const systemPrompt = `你是一个孕期购物顾问。请根据当前孕周和阶段，推荐需要购买的物品。
请使用 JSON 格式返回，包含以下字段：
{
  "items": [
    { "name": "物品名称", "reason": "推荐理由", "priority": "high/medium/low" }
  ]
}
请推荐 3-5 个最重要的物品。`;

  const userPrompt = `当前孕期第 ${week} 周，处于${stage}，请推荐需要购买的物品。`;

  return chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

/**
 * AI 分析结果接口（新）
 */
export interface XhsAnalysisResult {
  weeks: number[];                    // 适用孕周 [24, 25, 26]
  category: 'nutrition' | 'checkup' | 'exercise' | 'product' | 'symptom' | 'experience';
  keyPoints: string[];                // 关键知识点
  products: string[];                 // 提取的产品列表
  warnings: string[];                 // 注意事项/警告
  relatedTags: string[];              // 相关标签
}

/**
 * 分析小红书内容并提取结构化知识点
 * 这是核心 AI 分析功能
 */
export async function analyzeXhsContent(
  title: string,
  content: string,
  tags: string[]
): Promise<XhsAnalysisResult> {
  const systemPrompt = `你是一个专业的孕期知识整理助手。用户会提供一篇小红书孕期笔记的标题和内容。
你的任务是分析这篇内容，并提取结构化的知识点。

请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "weeks": [24, 25, 26],              // 适用的孕周数组，如果无法确定具体周数，根据内容推断大致范围
  "category": "nutrition",            // 内容分类：nutrition(营养)/checkup(产检)/exercise(运动)/product(物品)/symptom(症状)/experience(经验分享)
  "keyPoints": [                      // 关键知识点，3-5条，精炼提取
    "每天补充DHA 200-300mg",
    "控制糖分摄入，为糖耐做准备",
    "增加优质蛋白质摄入"
  ],
  "products": [                       // 提及的具体产品，如果没有就返回空数组
    "DHA补充剂",
    "孕妇枕"
  ],
  "warnings": [                       // 注意事项、禁忌、警告信息
    "糖耐前一晚需禁食8小时",
    "如出现持续腹痛需立即就医"
  ],
  "relatedTags": [                    // 相关的关键词标签
    "DHA", "糖耐", "孕中期营养"
  ]
}

分析规则：
1. weeks 数组：
   - 如果内容明确提到"第X周"、"X周"，提取具体周数
   - 如果提到"孕早期"(1-12周)，返回 [4, 8, 12]
   - 如果提到"孕中期"(13-28周)，返回 [20, 24, 28]
   - 如果提到"孕晚期"(29-40周)，返回 [32, 36, 40]
   - 如果内容适用于多个周，尽量列出关键周数（不要超过5个）

2. category 分类标准：
   - nutrition: 饮食、营养补充、食谱相关
   - checkup: 产检项目、检查流程、医院相关
   - exercise: 运动、活动、体操、瑜伽
   - product: 物品推荐、用品清单、待产包
   - symptom: 症状说明、身体变化、不适处理
   - experience: 个人经验、心得体会、避坑指南

3. keyPoints 提取要点：
   - 每条要精炼、可执行
   - 包含具体数字、时间、方法
   - 去除主观感受，保留客观信息

4. products 提取规则：
   - 只提取具体的产品名称
   - 去除品牌名（如："某品牌DHA" → "DHA补充剂"）
   - 如果内容不涉及产品推荐，返回空数组

5. warnings 提取规则：
   - 提取禁忌事项、注意事项、警告信息
   - 提取需要就医的症状描述
   - 如果没有明确警告，返回空数组

6. relatedTags 标签规则：
   - 提取3-5个关键词
   - 可以是文中未出现但相关的专业术语`;

  const userPrompt = `请分析以下小红书笔记并提取知识点：

标题：${title}

内容：${content}

原始标签：${tags.join(', ')}`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    // 提取 JSON
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    
    const result = JSON.parse(jsonStr);
    
    // 验证和修正数据
    return {
      weeks: Array.isArray(result.weeks) ? result.weeks : [24],
      category: ['nutrition', 'checkup', 'exercise', 'product', 'symptom', 'experience'].includes(result.category) 
        ? result.category 
        : 'experience',
      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
      products: Array.isArray(result.products) ? result.products : [],
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
      relatedTags: Array.isArray(result.relatedTags) ? result.relatedTags : [],
    };
  } catch (error) {
    console.error('AI 分析失败:', response, error);
    // 返回默认值
    return {
      weeks: [24],
      category: 'experience',
      keyPoints: ['AI 分析失败，请手动整理'],
      products: [],
      warnings: [],
      relatedTags: tags,
    };
  }
}
