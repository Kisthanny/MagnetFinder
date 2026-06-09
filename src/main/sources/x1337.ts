import type { SourceAdapter } from './types'

/**
 * 1337X 占位适配器（示例）。
 *
 * 1337x 没有官方 JSON API，接入需要抓取并解析 HTML 列表页 / 详情页。
 * 此处仅实现接口骨架以演示 registry 的可扩展性：后续将
 *   1. 在 search() 中请求 https://1337x.to/search/<query>/1/ 并解析结果行；
 *   2. 在详情页解析 magnet 链接 / info_hash 后填充归一化结果；
 *   3. 在 buildMagnet() 中复用已解析的 magnet 或由 info_hash 生成。
 */
export const x1337Adapter: SourceAdapter = {
  id: '1337x',
  displayName: '1337X（占位 / 未实现）',
  capabilities: { resolution: true, season: true, episode: true },

  async search() {
    throw new Error('1337X 源尚未实现，仅作为可扩展接口占位')
  },

  async buildMagnet() {
    return null
  }
}
