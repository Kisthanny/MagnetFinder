import type { JSX } from 'react'
import { SUPPORTED_LANGUAGES, type Language } from '@shared/i18n'
import { THEMES, type Theme } from '@shared/theme'
import { useT } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'

export interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps): JSX.Element | null {
  const { lang, t, setLanguage } = useT()
  const { theme, setTheme } = useTheme()

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t('settings.title')}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t('settings.close')}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label" htmlFor="language-select">
            {t('settings.languageLabel')}
          </label>
          <select
            id="language-select"
            className="select"
            value={lang}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {SUPPORTED_LANGUAGES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.nativeName}
              </option>
            ))}
          </select>
          <label className="field-label" htmlFor="theme-select">
            {t('settings.themeLabel')}
          </label>
          <select
            id="theme-select"
            className="select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            {THEMES.map((value) => (
              <option key={value} value={value}>
                {t(`theme.${value}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            {t('settings.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
