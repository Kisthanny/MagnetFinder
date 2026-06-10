import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

/**
 * dev 模式下的轻量日志系统：
 * - 仅在 dev（electron-vite 注入 ELECTRON_RENDERER_URL）启用，打包后完全不写文件。
 * - 日志写入工作区 logs/dev.log，便于在编辑器里直接查看 / 搜索。
 * - 内存中维护环形缓冲，超过 MAX_LINES 时丢弃最早的行，文件不会无限增长。
 * - 写盘做防抖（debounce），避免高频请求时频繁 IO 造成卡顿。
 */

const isDev = Boolean(process.env['ELECTRON_RENDERER_URL'])
const MAX_LINES = 2000
const FLUSH_DELAY_MS = 300
const LOG_FILE = join(process.cwd(), 'logs', 'dev.log')

const buffer: string[] = []
let flushTimer: NodeJS.Timeout | null = null
let initialized = false

function scheduleFlush(): void {
  if (flushTimer) {
    return
  }
  flushTimer = setTimeout(() => {
    flushTimer = null
    flush()
  }, FLUSH_DELAY_MS)
}

function flush(): void {
  try {
    if (!initialized) {
      mkdirSync(dirname(LOG_FILE), { recursive: true })
      initialized = true
    }
    writeFileSync(LOG_FILE, buffer.join('\n') + '\n', 'utf8')
  } catch {
    // 日志写入失败不应影响主流程，静默忽略
  }
}

/** 写入一条 dev 日志（可多行）。非 dev 环境下为空操作。 */
export function devLog(message: string): void {
  if (!isDev) {
    return
  }
  const stamped = `[${new Date().toISOString()}] ${message}`
  for (const line of stamped.split('\n')) {
    buffer.push(line)
  }
  while (buffer.length > MAX_LINES) {
    buffer.shift()
  }
  scheduleFlush()
}

/** dev 日志文件的绝对路径（用于提示用户在哪查看）。 */
export const DEV_LOG_FILE = LOG_FILE
