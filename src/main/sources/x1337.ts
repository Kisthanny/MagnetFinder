import { getCurrentMessages } from '../language'
import type { SourceAdapter } from './types'

/**
 * 1337X 占位适配器（示例）。
 *
 * 1337x 没有官方 JSON API，接入需要抓取并解析 HTML 列表页 / 详情页。
 * 此处仅实现接口骨架以演示 registry 的可扩展性：后续将
 *   1. 在 search() 中请求 https://1337x.to/search/<query>/1/ 并解析结果行；
 *   2. 在详情页解析 magnet 链接 / info_hash 后填充归一化结果；
 *   3. 在 buildMagnet() 中复用已解析的 magnet 或由 info_hash 生成。
 *
 * displayName 使用中性品牌名（不翻译）；面向用户的提示文案接入 i18n，
 * 在主进程当前语言下解析。
 */
export const x1337Adapter: SourceAdapter = {
  id: '1337x',
  displayName: '1337X',
  capabilities: { resolution: true, season: true, episode: true },

  async search() {
    throw new Error(getCurrentMessages().sources.x1337NotImplemented)
  },

  async buildMagnet() {
    return null
  }
}
