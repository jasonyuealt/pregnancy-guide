/**
 * MCP 工具调用辅助函数
 * 封装对 Cursor MCP 工具的调用
 */

export async function CallMcpTool(
  server: string,
  toolName: string,
  arguments_: Record<string, any>
): Promise<any> {
  // 注意：这个函数在实际运行时会被 Cursor 的 MCP 系统接管
  // 这里提供类型定义和基本结构
  
  // 在浏览器环境中，需要通过 API 路由来调用 MCP 工具
  if (typeof window !== 'undefined') {
    const response = await fetch('/api/mcp/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server,
        toolName,
        arguments: arguments_,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }
  
  // 服务端环境 - 这里需要实际实现
  throw new Error('MCP calls are not supported in this environment');
}
