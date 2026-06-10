import { join } from 'path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import {
  getMessages,
  isSupported,
  resolveSystemLanguage,
  SUPPORTED_LANGUAGES,
  type Language
} from '@shared/i18n'
import { registerIpc } from './ipc'
import { pollingManager } from './polling'
import { readSettings, writeSettings } from './settings'
import { applyApplicationMenu } from './menu'
import { getCurrentLanguage, setCurrentLanguage } from './language'

let mainWindow: BrowserWindow | null = null

function initLanguage(): void {
  const saved = readSettings().language
  setCurrentLanguage(isSupported(saved) ? saved : resolveSystemLanguage(app.getLocale()))
}

/** 应用当前语言到原生菜单与窗口标题 */
function applyLanguageToShell(): void {
  const messages = getMessages(getCurrentLanguage())
  applyApplicationMenu(messages, () => mainWindow?.webContents.send('settings:open'))
  mainWindow?.setTitle(messages.app.title)
}

function setLanguage(lang: Language): void {
  setCurrentLanguage(lang)
  writeSettings({ ...readSettings(), language: lang })
  applyLanguageToShell()
  mainWindow?.webContents.send('i18n:changed', lang)
}

function registerI18nIpc(): void {
  ipcMain.handle('i18n:get', () => ({
    language: getCurrentLanguage(),
    supported: SUPPORTED_LANGUAGES
  }))

  ipcMain.handle('i18n:set', (_e, lang: string) => {
    if (!isSupported(lang)) {
      return { ok: false }
    }
    setLanguage(lang)
    return { ok: true }
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 880,
    minHeight: 600,
    show: false,
    title: getMessages(getCurrentLanguage()).app.title,
    backgroundColor: '#0f1117',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  const devServerUrl = process.env['ELECTRON_RENDERER_URL']
  if (devServerUrl) {
    void mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  initLanguage()
  registerIpc(() => mainWindow)
  registerI18nIpc()
  createWindow()
  applyLanguageToShell()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      applyLanguageToShell()
    }
  })
})

app.on('window-all-closed', () => {
  pollingManager.stop()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
