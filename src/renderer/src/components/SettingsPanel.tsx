import type { JSX } from 'react'
import { SUPPORTED_LANGUAGES, type Language } from '@shared/i18n'
import { useT } from '../i18n/I18nProvider'

export interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps): JSX.Element | null {
  const { lang, t, setLanguage } = useT()

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
