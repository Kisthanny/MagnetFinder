import type { BrowserWindow } from 'electron'
import type { PollingConfig, PollingUpdate } from '@shared/types'
import {
  filterByEpisodes,
  filterByResolution,
  filterBySeason,
  resultKey,
  sortBySeeders
} from '@shared/filter'
import { runSearch } from './search'

const DEFAULT_INTERVAL_MS = 60_000

/**
 * 主进程定时轮询管理器。
 * 定时器置于主进程，不受渲染进程页面状态影响。
 */
class PollingManager {
  private timer: ReturnType<typeof setInterval> | null = null
  private seen = new Set<string>()

  isRunning(): boolean {
    return this.timer !== null
  }

  start(config: PollingConfig, win: BrowserWindow): void {
    this.stop()
    this.seen = new Set()
    const interval = config.intervalMs && config.intervalMs > 0 ? config.intervalMs : DEFAULT_INTERVAL_MS
    let firstRun = true

    const tick = async (): Promise<void> => {
      const { results } = await runSearch(config.sourceIds, config.query)

      let matched = results
      matched = filterBySeason(matched, config.season)
      matched = filterByEpisodes(matched, config.episodes)
      matched = filterByResolution(matched, config.resolution)
      matched = sortBySeeders(matched)

      const fresh = matched.filter((r) => {
        const key = resultKey(r)
        if (this.seen.has(key)) return false
        this.seen.add(key)
        return true
      })

      // 首次轮询建立基线，不视为"新增"，避免初次即全量提示
      const update: PollingUpdate = {
        timestamp: new Date().toISOString(),
        firstRun,
        newResults: firstRun ? [] : fresh,
        totalMatched: matched.length
      }
      firstRun = false

      if (!win.isDestroyed()) {
        win.webContents.send('polling:update', update)
      }
    }

    void tick()
    this.timer = setInterval(() => void tick(), interval)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export const pollingManager = new PollingManager()
