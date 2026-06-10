import type { Messages } from '../messages'

const messages: Messages = {
  app: {
    title: 'マグネット検索',
    subtitle:
      '複数ソースのマグネット / トレント検索 · 画質 / シーズン / エピソードで絞り込み · ワンクリックでコピー'
  },
  search: {
    sourceLabel: 'ソース',
    placeholder: 'タイトルを入力（例：The Last of Us）',
    button: '検索',
    searching: '検索中…',
    resolutionLabel: '画質',
    resolutionAll: 'すべて',
    seasonLabel: 'シーズン',
    seasonPlaceholder: '例：1',
    episodesLabel: 'エピソード（カンマ区切り）',
    episodesPlaceholder: '例：1,2,3',
    episodeNeedSeason: 'エピソードで絞り込む前にシーズンを指定してください'
  },
  resolution: {
    '2160p': '2160p (4K)',
    '1080p': '1080p (Full HD)',
    '720p': '720p (HD)'
  },
  poll: {
    label: 'ポーリング',
    start: 'ポーリング開始',
    stop: 'ポーリング停止',
    intervalLabel: '間隔（秒）',
    running: 'ポーリング中',
    lastAt: '最終 {time}'
  },
  result: {
    colName: '名前',
    colResolution: '画質',
    colSize: 'サイズ',
    colSeeders: 'シード数',
    unknown: '不明',
    copy: 'マグネットをコピー',
    copyTooltip: 'マグネットリンクをコピー',
    unavailable: '利用不可',
    unavailableTooltip: '有効な info_hash がないためコピーできません',
    summary: '{count} 件の結果（シード数順）'
  },
  state: {
    searching: '検索中…',
    noResults: '結果が見つかりません',
    empty: 'タイトルを入力して検索を開始'
  },
  toast: {
    enterKeyword: '検索キーワードを入力してください',
    selectSource: 'ソースを少なくとも1つ選択してください',
    copied: 'マグネットリンクをクリップボードにコピーしました',
    copyFailed: 'コピーに失敗しました',
    pollStopped: 'ポーリングを停止しました',
    pollStarted: 'ポーリングを開始しました（{seconds}秒ごと）',
    pollCantStart: 'ポーリングを開始できません',
    pollNewFound: 'ポーリングで新着 {count} 件を発見'
  },
  settings: {
    title: '設定',
    languageLabel: '言語',
    close: '閉じる'
  },
  menu: {
    settings: '設定…'
  },
  sources: {
    x1337NotImplemented: '1337X ソースは未実装です。拡張用のプレースホルダーです'
  }
}

export default messages
