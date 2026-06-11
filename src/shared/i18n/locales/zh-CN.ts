const messages = {
  app: {
    title: '磁力搜索器',
    subtitle: '多源磁力 / 种子搜索 · 清晰度 / 季 / 集筛选 · 一键复制磁力链接'
  },
  search: {
    sourceLabel: '搜索源',
    placeholder: '输入影视名称，例如：The Last of Us',
    button: '搜索',
    searching: '搜索中…',
    resolutionLabel: '清晰度',
    resolutionAll: '全部',
    seasonLabel: '季（Season）',
    seasonPlaceholder: '如 1',
    episodesLabel: '集（多集逗号分隔）',
    episodesPlaceholder: '如 1,2,3',
    episodeNeedSeason: '按集筛选前必须先指定季数（Season）'
  },
  resolution: {
    '2160p': '2160p (4K)',
    '1080p': '1080p (Full HD)',
    '720p': '720p (HD)'
  },
  poll: {
    label: '定时轮询',
    start: '开始轮询',
    stop: '停止轮询',
    intervalLabel: '间隔（秒）',
    running: '轮询中',
    lastAt: '最近 {time}'
  },
  result: {
    colName: '名称',
    colResolution: '清晰度',
    colSize: '体积',
    colSeeders: '做种',
    unknown: '未知',
    copy: '复制磁力',
    copyTooltip: '复制磁力链接',
    unavailable: '不可用',
    unavailableTooltip: '该资源缺少有效 info_hash，无法复制',
    summary: '共 {count} 条结果（按做种数排序）'
  },
  state: {
    searching: '正在搜索…',
    noResults: '未找到相关结果',
    empty: '输入影视名称开始搜索'
  },
  toast: {
    enterKeyword: '请输入搜索关键词',
    selectSource: '请至少选择一个搜索源',
    copied: '磁力链接已复制到剪贴板',
    copyFailed: '复制失败',
    pollStopped: '已停止轮询',
    pollStarted: '已开始轮询（每 {seconds} 秒）',
    pollCantStart: '无法开始轮询',
    pollNewFound: '轮询发现 {count} 条新资源'
  },
  settings: {
    title: '设置',
    languageLabel: '语言',
    themeLabel: '主题',
    close: '关闭'
  },
  theme: {
    light: '亮色',
    dark: '暗色',
    system: '跟随系统'
  },
  menu: {
    settings: '设置…'
  },
  sources: {
    x1337NotImplemented: '1337X 源尚未实现，仅作为可扩展接口占位'
  }
}

export default messages
