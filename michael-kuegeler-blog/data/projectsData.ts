import {
  APOLLO_ERWACHT_IMAGE,
  APOLLOS_TRAUM_IMAGE,
  DUS_PARIS_IMAGE,
  ERDE_2_IMAGE,
  EVENT_HORIZON_IMAGE,
  GEGENSPIEL_IMAGE,
  IMPULS_IMAGE,
  L_APPARITION_IMAGE,
  LAST_FRONTIER_IMAGE,
  MARSFELD_IMAGE,
  MOUNTAINS_OF_MADNESS_IMAGE,
  OBERFLAECHE_1_IMAGE,
  ZEITREISE_IMAGE,
  ZIVILISATION_IMAGE,
} from '@/data/assets'

interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Erde 2',
    description: 'A project about Earth 2.',
    imgSrc: ERDE_2_IMAGE,
    href: '/blog/erde-2',
  },
  {
    title: 'Apollo erwacht',
    description: 'Apollo awakes.',
    imgSrc: APOLLO_ERWACHT_IMAGE,
    href: '/blog/apollo-erwacht',
  },
  {
    title: 'Apollos Traum',
    description: 'The dream of Apollo.',
    imgSrc: APOLLOS_TRAUM_IMAGE,
    href: '/blog/apollos-traum',
  },
  {
    title: 'DusParis',
    description: 'Project in Paris.',
    imgSrc: DUS_PARIS_IMAGE,
    href: '/blog/dusparis',
  },
  {
    title: 'Event Horizon',
    description: 'The boundary around a black hole.',
    imgSrc: EVENT_HORIZON_IMAGE,
    href: '/blog/event-horizon',
  },
  {
    title: 'Gegenspiel',
    description: 'Counterplay in strategy.',
    imgSrc: GEGENSPIEL_IMAGE,
    href: '/blog/gegenspiel',
  },
  {
    title: 'Impuls',
    description: 'Impulse and action.',
    imgSrc: IMPULS_IMAGE,
    href: '/blog/impuls',
  },
  {
    title: "L'Apparition",
    description: 'The apparition emerges.',
    imgSrc: L_APPARITION_IMAGE,
    href: '/blog/lapparition',
  },
  {
    title: 'Last Frontier',
    description: 'The final frontier.',
    imgSrc: LAST_FRONTIER_IMAGE,
    href: '/blog/last-frontier',
  },
  {
    title: 'Marsfeld',
    description: 'Mars Field exploration.',
    imgSrc: MARSFELD_IMAGE,
    href: '/blog/marsfeld',
  },
  {
    title: 'Mountains of Madness',
    description: 'Mysterious mountains.',
    imgSrc: MOUNTAINS_OF_MADNESS_IMAGE,
    href: '/blog/mountains-of-madness',
  },
  {
    title: 'Oberfläche 1',
    description: 'Surface details.',
    imgSrc: OBERFLAECHE_1_IMAGE,
    href: '/blog/oberflaeche-1',
  },
  {
    title: 'Zeitreise',
    description: 'Time travel.',
    imgSrc: ZEITREISE_IMAGE,
    href: '/blog/zeitreise',
  },
  {
    title: 'Zivilisation',
    description: 'Civilization advances.',
    imgSrc: ZIVILISATION_IMAGE,
    href: '/blog/zivilisation',
  },
]

export default projectsData
