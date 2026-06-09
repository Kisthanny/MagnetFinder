import type { JSX } from 'react'
import type { NormalizedResult } from '@shared/types'
import { isValidInfoHash } from '@shared/filter'
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
  return (
    <div className="result-list">
      <table>
        <thead>
          <tr>
            <th className="col-name">名称</th>
            <th className="col-res">清晰度</th>
            <th className="col-size">体积</th>
            <th className="col-seeders">做种</th>
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
                    <span className="res-unknown">未知</span>
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
                    title={canCopy ? '复制磁力链接' : '该资源缺少有效 info_hash，无法复制'}
                    onClick={() => onCopy(r)}
                  >
                    {copyingId === r.id ? '…' : canCopy ? '复制磁力' : '不可用'}
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
