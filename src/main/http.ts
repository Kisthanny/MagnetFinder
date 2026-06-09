const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  Origin: 'https://thepiratebay.org',
  Referer: 'https://thepiratebay.org/'
}

export interface FetchOptions {
  timeoutMs?: number
  headers?: Record<string, string>
}

/**
 * 主进程统一的 HTTP 请求封装：注入请求头、超时控制。
 * 运行在 Node 环境，不受浏览器同源策略 / CORS 限制。
 */
export async function fetchJson<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 15000, headers } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { ...HEADERS, ...headers },
      signal: controller.signal
    })
    if (!response.ok) {
      throw new Error(`请求失败：HTTP ${response.status}`)
    }
    return (await response.json()) as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`请求超时（${timeoutMs}ms）`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
