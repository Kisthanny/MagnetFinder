import type {
  MagnetResponse,
  NormalizedResult,
  SearchResponse,
  SourceError
} from '@shared/types'
import { getAdapter } from './sources/registry'

/**
 * 对一个或多个源并行执行搜索并合并归一化结果。
 * 单个源失败只记录到 errors，不阻断其它源的结果返回（聚合查询）。
 */
export async function runSearch(sourceIds: string[], query: string): Promise<SearchResponse> {
  const results: NormalizedResult[] = []
  const errors: SourceError[] = []

  await Promise.all(
    sourceIds.map(async (id) => {
      const adapter = getAdapter(id)
      if (!adapter) {
        errors.push({ source: id, message: '未知的搜索源' })
        return
      }
      try {
        const sourceResults = await adapter.search(query)
        results.push(...sourceResults)
      } catch (error) {
        errors.push({
          source: adapter.displayName,
          message: error instanceof Error ? error.message : String(error)
        })
      }
    })
  )

  return { results, errors }
}

/** 由归一化结果生成磁力链接（必要时回退二次获取 info_hash） */
export async function buildMagnetFor(result: NormalizedResult): Promise<MagnetResponse> {
  const adapter = getAdapter(result.source)
  if (!adapter) {
    return { available: false, error: '未知的搜索源，无法生成磁力链接' }
  }
  try {
    const magnet = await adapter.buildMagnet(result)
    if (!magnet) {
      return { available: false, error: '该资源缺少有效 info_hash，无法生成磁力链接' }
    }
    return { available: true, magnet }
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}
