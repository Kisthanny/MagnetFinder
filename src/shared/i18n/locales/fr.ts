import type { Messages } from '../messages'

const messages: Messages = {
  app: {
    title: 'Magnet Finder',
    subtitle:
      'Recherche magnet / torrent multi-sources · filtres résolution / saison / épisode · copie en un clic'
  },
  search: {
    sourceLabel: 'Sources',
    placeholder: 'Saisissez un titre, ex. The Last of Us',
    button: 'Rechercher',
    searching: 'Recherche…',
    resolutionLabel: 'Résolution',
    resolutionAll: 'Toutes',
    seasonLabel: 'Saison',
    seasonPlaceholder: 'ex. 1',
    episodesLabel: 'Épisodes (séparés par des virgules)',
    episodesPlaceholder: 'ex. 1,2,3',
    episodeNeedSeason: 'Indiquez une saison avant de filtrer par épisode'
  },
  resolution: {
    '2160p': '2160p (4K)',
    '1080p': '1080p (Full HD)',
    '720p': '720p (HD)'
  },
  poll: {
    label: 'Sondage',
    start: 'Démarrer le sondage',
    stop: 'Arrêter le sondage',
    intervalLabel: 'Intervalle (s)',
    running: 'Sondage en cours',
    lastAt: 'dernier {time}'
  },
  result: {
    colName: 'Nom',
    colResolution: 'Résolution',
    colSize: 'Taille',
    colSeeders: 'Seeders',
    unknown: 'Inconnu',
    copy: 'Copier le magnet',
    copyTooltip: 'Copier le lien magnet',
    unavailable: 'Indisponible',
    unavailableTooltip: 'Cet élément n’a pas d’info_hash valide et ne peut pas être copié',
    summary: '{count} résultats (triés par seeders)'
  },
  state: {
    searching: 'Recherche…',
    noResults: 'Aucun résultat trouvé',
    empty: 'Saisissez un titre pour lancer la recherche'
  },
  toast: {
    enterKeyword: 'Veuillez saisir un mot-clé',
    selectSource: 'Veuillez sélectionner au moins une source',
    copied: 'Lien magnet copié dans le presse-papiers',
    copyFailed: 'Échec de la copie',
    pollStopped: 'Sondage arrêté',
    pollStarted: 'Sondage démarré (toutes les {seconds}s)',
    pollCantStart: 'Impossible de démarrer le sondage',
    pollNewFound: 'Le sondage a trouvé {count} nouvel(s) élément(s)'
  },
  settings: {
    title: 'Paramètres',
    languageLabel: 'Langue',
    themeLabel: 'Thème',
    close: 'Fermer'
  },
  theme: {
    light: 'Clair',
    dark: 'Sombre',
    system: 'Suivre le système'
  },
  menu: {
    settings: 'Paramètres…'
  },
  sources: {
    x1337NotImplemented:
      'La source 1337X n’est pas encore implémentée ; il s’agit d’un espace réservé extensible'
  }
}

export default messages
