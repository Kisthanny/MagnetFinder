import { app, Menu, type MenuItemConstructorOptions } from 'electron'
import type { Messages } from '@shared/i18n'

/**
 * 根据当前语言构建并设置应用菜单。
 * 自定义「设置」项的文案随语言本地化；点击时触发 onOpenSettings。
 */
export function applyApplicationMenu(messages: Messages, onOpenSettings: () => void): void {
  const isMac = process.platform === 'darwin'

  const settingsItem: MenuItemConstructorOptions = {
    label: messages.menu.settings,
    accelerator: 'CmdOrCtrl+,',
    click: () => onOpenSettings()
  }

  const template: MenuItemConstructorOptions[] = []

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        settingsItem,
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  } else {
    template.push({
      label: app.name,
      submenu: [settingsItem, { type: 'separator' }, { role: 'quit' }]
    })
  }

  // 标准编辑菜单（复制 / 粘贴等由 Electron 提供并随系统语言本地化）
  template.push({ role: 'editMenu' })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
