import { isValidInfoHash } from '@shared/filter'

export const TRACKERS = [
  'udp://tracker.opentrackr.org:1337',
  'udp://open.stealth.si:80/announce',
  'udp://tracker.torrent.eu.org:451/announce',
  'udp://tracker.bittor.pw:1337/announce',
  'udp://public.popcorn-tracker.org:6969/announce',
  'udp://tracker.dler.org:6969/announce',
  'udp://exodus.desync.com:6969',
  'udp://open.demonii.com:1337/announce'
]

/**
 * 生成标准磁力链接：magnet:?xt=urn:btih:<hash>&dn=<编码名称>&tr=<编码tracker>...
 */
export function generateMagnet(infoHash: string, displayName: string, trackers = TRACKERS): string {
  const base = `magnet:?xt=urn:btih:${infoHash}`
  const nameParam = `&dn=${encodeURIComponent(displayName)}`
  const trackerParams = trackers.map((t) => `&tr=${encodeURIComponent(t)}`).join('')
  return base + nameParam + trackerParams
}

export { isValidInfoHash }
