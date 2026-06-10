import type { JSX } from 'react'
import type { NormalizedResult } from '@shared/types'
import { isValidInfoHash } from '@shared/filter'
import { useT } from '../i18n/I18nProvider'
import { formatBytes } from '../format'

export interface ResultListProps {
  results: NormalizedResult[]
  newKeys: Set<string>
  copyingId: string | null
  onCopy: (result: NormalizedResult) => void
  keyOf: (result: NormalizedResult) => string
}

export function ResultList({
  results,
  newKeys,
  copyingId,
  onCopy,
  keyOf
}: ResultListProps): JSX.Element {
  const { t } = useT()
  return (
    <div className="result-list">
      <table>
        <thead>
          <tr>
            <th className="col-name">{t('result.colName')}</th>
            <th className="col-res">{t('result.colResolution')}</th>
            <th className="col-size">{t('result.colSize')}</th>
            <th className="col-seeders">{t('result.colSeeders')}</th>
            <th className="col-action"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const key = keyOf(r)
            const canCopy = isValidInfoHash(r.infoHash)
            const isNew = newKeys.has(key)
            return (
              <tr key={key} className={isNew ? 'row-new' : ''}>
                <td className="col-name">
                  {isNew && <span className="badge-new">NEW</span>}
                  <span className="name-text">{r.name}</span>
                  <span className="source-tag">{r.source}</span>
                </td>
                <td className="col-res">
                  {r.resolution ? (
                    <span className="res-tag">{r.resolution}</span>
                  ) : (
                    <span className="res-unknown">{t('result.unknown')}</span>
                  )}
                </td>
                <td className="col-size">{formatBytes(r.sizeBytes)}</td>
                <td className="col-seeders">
                  <span className="seeders">{r.seeders}</span>
                </td>
                <td className="col-action">
                  <button
                    type="button"
                    className="btn-copy"
                    disabled={!canCopy || copyingId === r.id}
                    title={canCopy ? t('result.copyTooltip') : t('result.unavailableTooltip')}
                    onClick={() => onCopy(r)}
                  >
                    {copyingId === r.id ? '…' : canCopy ? t('result.copy') : t('result.unavailable')}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
