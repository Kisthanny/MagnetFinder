import { DEFAULT_LANGUAGE, getMessages, type Language, type Messages } from '@shared/i18n'

/**
 * 主进程当前语言的权威状态。
 * 菜单、窗口标题以及主进程侧面向用户的文案（如适配器错误）都据此本地化。
 */
let currentLanguage: Language = DEFAULT_LANGUAGE

export function getCurrentLanguage(): Language {
  return currentLanguage
}

export function setCurrentLanguage(lang: Language): void {
  currentLanguage = lang
}

export function getCurrentMessages(): Messages {
  return getMessages(currentLanguage)
}
