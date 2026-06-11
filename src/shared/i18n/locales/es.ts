import type { Messages } from '../messages'

const messages: Messages = {
  app: {
    title: 'Buscador de Magnet',
    subtitle:
      'Búsqueda de magnet / torrent multifuente · filtros por resolución / temporada / episodio · copia con un clic'
  },
  search: {
    sourceLabel: 'Fuentes',
    placeholder: 'Escribe un título, p. ej. The Last of Us',
    button: 'Buscar',
    searching: 'Buscando…',
    resolutionLabel: 'Resolución',
    resolutionAll: 'Todas',
    seasonLabel: 'Temporada',
    seasonPlaceholder: 'p. ej. 1',
    episodesLabel: 'Episodios (separados por comas)',
    episodesPlaceholder: 'p. ej. 1,2,3',
    episodeNeedSeason: 'Indica una temporada antes de filtrar por episodio'
  },
  resolution: {
    '2160p': '2160p (4K)',
    '1080p': '1080p (Full HD)',
    '720p': '720p (HD)'
  },
  poll: {
    label: 'Sondeo',
    start: 'Iniciar sondeo',
    stop: 'Detener sondeo',
    intervalLabel: 'Intervalo (s)',
    running: 'Sondeando',
    lastAt: 'último {time}'
  },
  result: {
    colName: 'Nombre',
    colResolution: 'Resolución',
    colSize: 'Tamaño',
    colSeeders: 'Semillas',
    unknown: 'Desconocida',
    copy: 'Copiar magnet',
    copyTooltip: 'Copiar enlace magnet',
    unavailable: 'No disponible',
    unavailableTooltip: 'Este elemento no tiene un info_hash válido y no se puede copiar',
    summary: '{count} resultados (ordenados por semillas)'
  },
  state: {
    searching: 'Buscando…',
    noResults: 'No se encontraron resultados',
    empty: 'Escribe un título para empezar a buscar'
  },
  toast: {
    enterKeyword: 'Introduce una palabra clave',
    selectSource: 'Selecciona al menos una fuente',
    copied: 'Enlace magnet copiado al portapapeles',
    copyFailed: 'Error al copiar',
    pollStopped: 'Sondeo detenido',
    pollStarted: 'Sondeo iniciado (cada {seconds}s)',
    pollCantStart: 'No se puede iniciar el sondeo',
    pollNewFound: 'El sondeo encontró {count} elemento(s) nuevo(s)'
  },
  settings: {
    title: 'Ajustes',
    languageLabel: 'Idioma',
    themeLabel: 'Tema',
    close: 'Cerrar'
  },
  theme: {
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Seguir el sistema'
  },
  menu: {
    settings: 'Ajustes…'
  },
  sources: {
    x1337NotImplemented: 'La fuente 1337X aún no está implementada; solo es un marcador de posición ampliable'
  }
}

export default messages
