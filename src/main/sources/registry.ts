import type { SourceInfo } from '@shared/types'
import type { SourceAdapter } from './types'
import { pirateBayAdapter } from './piratebay'
import { x1337Adapter } from './x1337'

const adapters = new Map<string, SourceAdapter>()

export function register(adapter: SourceAdapter): void {
  adapters.set(adapter.id, adapter)
}

export function getAdapter(id: string): SourceAdapter | undefined {
  return adapters.get(id)
}

export function listAdapters(): SourceAdapter[] {
  return [...adapters.values()]
}

export function listSourceInfo(): SourceInfo[] {
  return listAdapters().map((a) => ({
    id: a.id,
    displayName: a.displayName,
    capabilities: a.capabilities
  }))
}

// 内置源注册：新增源仅需在此 register 即可被 UI 枚举
register(pirateBayAdapter)
register(x1337Adapter)
