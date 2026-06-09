import type { JSX } from 'react'
import type { SourceInfo } from '@shared/types'
import { RESOLUTION_LABELS, RESOLUTIONS } from '@shared/filter'

export interface SearchControlsProps {
  sources: SourceInfo[]
  selectedSourceIds: string[]
  onToggleSource: (id: string) => void
  query: string
  onQueryChange: (value: string) => void
  resolution: string
  onResolutionChange: (value: string) => void
  season: string
  onSeasonChange: (value: string) => void
  episodes: string
  onEpisodesChange: (value: string) => void
  loading: boolean
  onSearch: () => void
  supportsResolution: boolean
  supportsSeason: boolean
  supportsEpisode: boolean
  episodeHint: string | null
}

export function SearchControls(props: SearchControlsProps): JSX.Element {
  const {
    sources,
    selectedSourceIds,
    onToggleSource,
    query,
    onQueryChange,
    resolution,
    onResolutionChange,
    season,
    onSeasonChange,
    episodes,
    onEpisodesChange,
    loading,
    onSearch,
    supportsResolution,
    supportsSeason,
    supportsEpisode,
    episodeHint
  } = props

  return (
    <section className="controls">
      <div className="field sources">
        <label className="field-label">搜索源</label>
        <div className="source-chips">
          {sources.map((s) => {
            const active = selectedSourceIds.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                className={`chip ${active ? 'chip-active' : ''}`}
                onClick={() => onToggleSource(s.id)}
                title={s.displayName}
              >
                {s.displayName}
              </button>
            )
          })}
        </div>
      </div>

      <form
        className="search-row"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <input
          className="search-input"
          type="text"
          placeholder="输入影视名称，例如：The Last of Us"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoFocus
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? '搜索中…' : '搜索'}
        </button>
      </form>

      <div className="filters">
        <div className="field">
          <label className="field-label">清晰度</label>
          <select
            className="select"
            value={resolution}
            onChange={(e) => onResolutionChange(e.target.value)}
            disabled={!supportsResolution}
          >
            <option value="">全部</option>
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {RESOLUTION_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">季（Season）</label>
          <input
            className="select"
            type="number"
            min={1}
            placeholder="如 1"
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            disabled={!supportsSeason}
          />
        </div>

        <div className="field">
          <label className="field-label">集（多集逗号分隔）</label>
          <input
            className="select"
            type="text"
            placeholder="如 1,2,3"
            value={episodes}
            onChange={(e) => onEpisodesChange(e.target.value)}
            disabled={!supportsEpisode}
          />
        </div>
      </div>

      {episodeHint && <p className="hint hint-warn">{episodeHint}</p>}
    </section>
  )
}
