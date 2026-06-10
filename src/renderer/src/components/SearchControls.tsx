import type { JSX } from 'react'
import type { SourceInfo } from '@shared/types'
import { RESOLUTIONS } from '@shared/filter'
import { useT } from '../i18n/I18nProvider'

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
  const { t } = useT()

  return (
    <section className="controls">
      <div className="field sources">
        <label className="field-label">{t('search.sourceLabel')}</label>
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
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoFocus
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? t('search.searching') : t('search.button')}
        </button>
      </form>

      <div className="filters">
        <div className="field">
          <label className="field-label">{t('search.resolutionLabel')}</label>
          <select
            className="select"
            value={resolution}
            onChange={(e) => onResolutionChange(e.target.value)}
            disabled={!supportsResolution}
          >
            <option value="">{t('search.resolutionAll')}</option>
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {t(`resolution.${r}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">{t('search.seasonLabel')}</label>
          <input
            className="select"
            type="number"
            min={1}
            placeholder={t('search.seasonPlaceholder')}
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            disabled={!supportsSeason}
          />
        </div>

        <div className="field">
          <label className="field-label">{t('search.episodesLabel')}</label>
          <input
            className="select"
            type="text"
            placeholder={t('search.episodesPlaceholder')}
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
