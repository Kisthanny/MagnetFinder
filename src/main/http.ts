import { devLog } from './logger'

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

// dev 模式下（electron-vite 注入 ELECTRON_RENDERER_URL）记录主进程 HTTP 请求，
// 弥补渲染进程 DevTools「Network」无法观察主进程网络请求的问题。
// 终端只打印简洁摘要，完整请求头 / 响应头 / 响应体写入 logs/dev.log，避免刷屏卡顿。
const isDev = Boolean(process.env['ELECTRON_RENDERER_URL'])

function formatHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .map(([key, value]) => `    ${key}: ${value}`)
    .join('\n')
}

/**
 * 主进程统一的 HTTP 请求封装：注入请求头、超时控制。
 * 运行在 Node 环境，不受浏览器同源策略 / CORS 限制。
 */
export async function fetchJson<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 15000, headers } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const startedAt = Date.now()
  const requestHeaders = { ...HEADERS, ...headers }
  if (isDev) {
    console.log(`[http] → GET ${url}`)
    devLog([`→ GET ${url}`, '  request headers:', formatHeaders(requestHeaders)].join('\n'))
  }
  try {
    const response = await fetch(url, {
      headers: requestHeaders,
      signal: controller.signal
    })
    const elapsed = Date.now() - startedAt
    const raw = await response.text()
    if (isDev) {
      console.log(`[http] ← ${response.status} ${url} (${elapsed}ms)`)
      devLog(
        [
          `← ${response.status} ${response.statusText} ${url} (${elapsed}ms)`,
          '  response headers:',
          formatHeaders(Object.fromEntries(response.headers.entries())),
          `  response body (${raw.length} chars):`,
          raw
        ].join('\n')
      )
    }
    if (!response.ok) {
      throw new Error(`请求失败：HTTP ${response.status}`)
    }
    return JSON.parse(raw) as T
  } catch (error) {
    if (isDev) {
      const reason = error instanceof Error ? error.message : String(error)
      console.log(`[http] ✗ ${url} (${Date.now() - startedAt}ms): ${reason}`)
      devLog(`✗ ${url} (${Date.now() - startedAt}ms): ${reason}`)
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`请求超时（${timeoutMs}ms）`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
