import type { Messages } from '../messages'

const messages: Messages = {
  app: {
    title: 'Magnet Finder',
    subtitle:
      'Multi-source magnet / torrent search · filter by resolution / season / episode · one-click magnet copy'
  },
  search: {
    sourceLabel: 'Sources',
    placeholder: 'Enter a title, e.g. The Last of Us',
    button: 'Search',
    searching: 'Searching…',
    resolutionLabel: 'Resolution',
    resolutionAll: 'All',
    seasonLabel: 'Season',
    seasonPlaceholder: 'e.g. 1',
    episodesLabel: 'Episodes (comma-separated)',
    episodesPlaceholder: 'e.g. 1,2,3',
    episodeNeedSeason: 'Specify a season before filtering by episode'
  },
  resolution: {
    '2160p': '2160p (4K)',
    '1080p': '1080p (Full HD)',
    '720p': '720p (HD)'
  },
  poll: {
    label: 'Polling',
    start: 'Start polling',
    stop: 'Stop polling',
    intervalLabel: 'Interval (sec)',
    running: 'Polling',
    lastAt: 'last {time}'
  },
  result: {
    colName: 'Name',
    colResolution: 'Resolution',
    colSize: 'Size',
    colSeeders: 'Seeders',
    unknown: 'Unknown',
    copy: 'Copy magnet',
    copyTooltip: 'Copy magnet link',
    unavailable: 'Unavailable',
    unavailableTooltip: 'This item lacks a valid info_hash and cannot be copied',
    summary: '{count} results (sorted by seeders)'
  },
  state: {
    searching: 'Searching…',
    noResults: 'No results found',
    empty: 'Enter a title to start searching'
  },
  toast: {
    enterKeyword: 'Please enter a search keyword',
    selectSource: 'Please select at least one source',
    copied: 'Magnet link copied to clipboard',
    copyFailed: 'Copy failed',
    pollStopped: 'Polling stopped',
    pollStarted: 'Polling started (every {seconds}s)',
    pollCantStart: 'Cannot start polling',
    pollNewFound: 'Polling found {count} new item(s)'
  },
  settings: {
    title: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    close: 'Close'
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'Follow system'
  },
  menu: {
    settings: 'Settings…'
  },
  sources: {
    x1337NotImplemented: '1337X source is not implemented yet; it only serves as an extensible placeholder'
  }
}

export default messages
