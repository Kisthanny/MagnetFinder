import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { app } from 'electron'

export interface AppSettings {
  language?: string
}

function settingsFile(): string {
  return join(app.getPath('userData'), 'settings.json')
}

export function readSettings(): AppSettings {
  try {
    return JSON.parse(readFileSync(settingsFile(), 'utf-8')) as AppSettings
  } catch {
    return {}
  }
}

export function writeSettings(settings: AppSettings): void {
  try {
    writeFileSync(settingsFile(), JSON.stringify(settings, null, 2), 'utf-8')
  } catch {
    // 持久化失败不应阻断应用运行（如目录不可写）
  }
}
