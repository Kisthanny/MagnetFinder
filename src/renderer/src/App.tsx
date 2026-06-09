import { type JSX, useCallback, useEffect, useMemo, useState } from 'react'
import type { NormalizedResult, PollingUpdate, SourceInfo } from '@shared/types'
import {
  filterByEpisodes,
  filterByResolution,
  filterBySeason,
  resultKey,
  sortBySeeders
} from '@shared/filter'
import { SearchControls } from './components/SearchControls'
import { ResultList } from './components/ResultList'
import { formatTime } from './format'

type Toast = { kind: 'success' | 'error' | 'info'; text: string } | null

function parseEpisodes(value: string): number[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n > 0)
}

export default function App(): JSX.Element {
  const [sources, setSources] = useState<SourceInfo[]>([])
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [resolution, setResolution] = useState('')
  const [season, setSeason] = useState('')
  const [episodes, setEpisodes] = useState('')

  const [rawResults, setRawResults] = useState<NormalizedResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [copyingId, setCopyingId] = useState<string | null>(null)

  const [polling, setPolling] = useState(false)
  const [intervalSec, setIntervalSec] = useState('60')
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set())
  const [lastPollAt, setLastPollAt] = useState<string | null>(null)

  useEffect(() => {
    void window.api.getSources().then((list) => {
      setSources(list)
      const defaults = list.filter((s) => s.id === 'piratebay').map((s) => s.id)
      setSelectedSourceIds(defaults.length ? defaults : list.slice(0, 1).map((s) => s.id))
    })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const selectedSources = useMemo(
    () => sources.filter((s) => selectedSourceIds.includes(s.id)),
    [sources, selectedSourceIds]
  )

  const caps = useMemo(() => {
    if (selectedSources.length === 0) {
      return { resolution: false, season: false, episode: false }
    }
    return {
      resolution: selectedSources.some((s) => s.capabilities.resolution),
      season: selectedSources.some((s) => s.capabilities.season),
      episode: selectedSources.some((s) => s.capabilities.episode)
    }
  }, [selectedSources])

  const seasonNum = season.trim() ? Number(season) : null
  const episodeList = parseEpisodes(episodes)
  const episodeHint =
    episodeList.length > 0 && seasonNum == null ? '按集筛选前必须先指定季数（Season）' : null

  const filteredResults = useMemo(() => {
    let list = rawResults
    list = filterBySeason(list, seasonNum)
    if (seasonNum != null) {
      list = filterByEpisodes(list, episodeList)
    }
    list = filterByResolution(list, resolution || null)
    return sortBySeeders(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawResults, seasonNum, episodes, resolution])

  const toggleSource = useCallback((id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const doSearch = useCallback(async () => {
    if (!query.trim()) {
      setToast({ kind: 'error', text: '请输入搜索关键词' })
      return
    }
    if (selectedSourceIds.length === 0) {
      setToast({ kind: 'error', text: '请至少选择一个搜索源' })
      return
    }
    setLoading(true)
    setErrorText(null)
    setNewKeys(new Set())
    try {
      const res = await window.api.search({ query: query.trim(), sourceIds: selectedSourceIds })
      setRawResults(res.results)
      setSearched(true)
      if (res.errors.length > 0) {
        setErrorText(res.errors.map((e) => `[${e.source}] ${e.message}`).join('；'))
      }
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [query, selectedSourceIds])

  const doCopy = useCallback(async (result: NormalizedResult) => {
    setCopyingId(result.id)
    try {
      const res = await window.api.copyMagnet(result)
      if (res.ok) {
        setToast({ kind: 'success', text: '磁力链接已复制到剪贴板' })
      } else {
        setToast({ kind: 'error', text: res.error ?? '复制失败' })
      }
    } catch (e) {
      setToast({ kind: 'error', text: e instanceof Error ? e.message : String(e) })
    } finally {
      setCopyingId(null)
    }
  }, [])

  const canPoll = seasonNum != null && episodeList.length > 0

  const togglePolling = useCallback(async () => {
    if (polling) {
      await window.api.stopPolling()
      setPolling(false)
      setToast({ kind: 'info', text: '已停止轮询' })
      return
    }
    if (!canPoll) {
      setToast({ kind: 'error', text: '轮询需要指定季数与集数' })
      return
    }
    const intervalMs = Math.max(5, Number(intervalSec) || 60) * 1000
    const res = await window.api.startPolling({
      query: query.trim(),
      sourceIds: selectedSourceIds,
      season: seasonNum,
      episodes: episodeList,
      resolution: resolution || null,
      intervalMs
    })
    if (res.ok) {
      setPolling(true)
      setToast({ kind: 'info', text: `已开始轮询（每 ${intervalMs / 1000} 秒）` })
    } else {
      setToast({ kind: 'error', text: res.error ?? '无法开始轮询' })
    }
  }, [polling, canPoll, intervalSec, query, selectedSourceIds, seasonNum, episodeList, resolution])

  useEffect(() => {
    const unsubscribe = window.api.onPollingUpdate((update: PollingUpdate) => {
      setLastPollAt(update.timestamp)
      if (update.firstRun) {
        return
      }
      if (update.newResults.length > 0) {
        setRawResults((prev) => {
          const existing = new Set(prev.map((r) => resultKey(r)))
          const additions = update.newResults.filter((r) => !existing.has(resultKey(r)))
          return [...additions, ...prev]
        })
        setNewKeys((prev) => {
          const next = new Set(prev)
          update.newResults.forEach((r) => next.add(resultKey(r)))
          return next
        })
        setToast({
          kind: 'success',
          text: `轮询发现 ${update.newResults.length} 条新资源`
        })
      }
    })
    return unsubscribe
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>磁力搜索器</h1>
        <p className="subtitle">多源磁力 / 种子搜索 · 清晰度 / 季 / 集筛选 · 一键复制磁力链接</p>
      </header>

      <SearchControls
        sources={sources}
        selectedSourceIds={selectedSourceIds}
        onToggleSource={toggleSource}
        query={query}
        onQueryChange={setQuery}
        resolution={resolution}
        onResolutionChange={setResolution}
        season={season}
        onSeasonChange={setSeason}
        episodes={episodes}
        onEpisodesChange={setEpisodes}
        loading={loading}
        onSearch={doSearch}
        supportsResolution={caps.resolution}
        supportsSeason={caps.season}
        supportsEpisode={caps.episode}
        episodeHint={episodeHint}
      />

      <section className="polling-bar">
        <label className="poll-toggle">
          <span>定时轮询（单集）</span>
          <button
            type="button"
            className={`btn-poll ${polling ? 'btn-poll-on' : ''}`}
            onClick={togglePolling}
            disabled={!polling && !canPoll}
            title={canPoll ? '' : '需指定季数与集数后才能轮询'}
          >
            {polling ? '停止轮询' : '开始轮询'}
          </button>
        </label>
        <label className="poll-interval">
          间隔（秒）
          <input
            type="number"
            min={5}
            value={intervalSec}
            onChange={(e) => setIntervalSec(e.target.value)}
            disabled={polling}
          />
        </label>
        {polling && (
          <span className="poll-status">
            <span className="dot-live" /> 轮询中
            {lastPollAt ? ` · 最近 ${formatTime(lastPollAt)}` : ''}
          </span>
        )}
      </section>

      <section className="results">
        {errorText && <p className="hint hint-error">{errorText}</p>}

        {loading && <div className="state-msg">正在搜索…</div>}

        {!loading && searched && filteredResults.length === 0 && (
          <div className="state-msg">未找到相关结果</div>
        )}

        {!loading && !searched && (
          <div className="state-msg state-empty">输入影视名称开始搜索</div>
        )}

        {filteredResults.length > 0 && (
          <>
            <div className="result-summary">
              共 {filteredResults.length} 条结果（按做种数排序）
            </div>
            <ResultList
              results={filteredResults}
              newKeys={newKeys}
              copyingId={copyingId}
              onCopy={doCopy}
              keyOf={resultKey}
            />
          </>
        )}
      </section>

      {toast && <div className={`toast toast-${toast.kind}`}>{toast.text}</div>}
    </div>
  )
}
