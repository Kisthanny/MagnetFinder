import { BrowserWindow, clipboard, ipcMain } from 'electron'
import type {
  CopyResponse,
  MagnetResponse,
  NormalizedResult,
  PollingConfig,
  SearchRequest,
  SearchResponse,
  SourceInfo
} from '@shared/types'
import { listSourceInfo } from './sources/registry'
import { buildMagnetFor, runSearch } from './search'
import { pollingManager } from './polling'

/**
 * 注册渲染进程与主进程之间的所有 IPC 通道。
 * 所有第三方源请求、磁力生成、剪贴板与轮询均在主进程执行。
 */
export function registerIpc(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle('sources:list', (): SourceInfo[] => listSourceInfo())

  ipcMain.handle('search', async (_e, req: SearchRequest): Promise<SearchResponse> => {
    if (!req?.query?.trim()) {
      return { results: [], errors: [{ source: '*', message: '搜索关键词不能为空' }] }
    }
    if (!req.sourceIds || req.sourceIds.length === 0) {
      return { results: [], errors: [{ source: '*', message: '请至少选择一个搜索源' }] }
    }
    return runSearch(req.sourceIds, req.query.trim())
  })

  ipcMain.handle('magnet:build', (_e, result: NormalizedResult): Promise<MagnetResponse> => {
    return buildMagnetFor(result)
  })

  ipcMain.handle('magnet:copy', async (_e, result: NormalizedResult): Promise<CopyResponse> => {
    const built = await buildMagnetFor(result)
    if (!built.available || !built.magnet) {
      return { ok: false, error: built.error ?? '无法生成磁力链接' }
    }
    clipboard.writeText(built.magnet)
    return { ok: true, magnet: built.magnet }
  })

  ipcMain.handle('polling:start', (_e, config: PollingConfig): { ok: boolean; error?: string } => {
    const win = getWindow()
    if (!win) {
      return { ok: false, error: '窗口不可用' }
    }
    pollingManager.start(config, win)
    return { ok: true }
  })

  ipcMain.handle('polling:stop', (): { ok: boolean } => {
    pollingManager.stop()
    return { ok: true }
  })
}
