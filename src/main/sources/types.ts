import type { NormalizedResult, SourceCapabilities } from '@shared/types'

export interface SearchOptions {
  signal?: AbortSignal
}

/**
 * 统一的搜索源适配器接口。
 * 新增源只需实现该接口并注册到 registry，无需改动 UI 或核心逻辑。
 */
export interface SourceAdapter {
  /** 源唯一标识 */
  id: string
  /** 源展示名称 */
  displayName: string
  /** 能力声明：是否支持清晰度 / 季 / 集筛选 */
  capabilities: SourceCapabilities
  /** 按名称搜索并返回归一化结果 */
  search(query: string, options?: SearchOptions): Promise<NormalizedResult[]>
  /** 由归一化结果生成磁力链接；无有效 infoHash 时返回 null */
  buildMagnet(result: NormalizedResult): Promise<string | null>
}
