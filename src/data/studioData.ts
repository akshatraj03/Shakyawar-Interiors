export interface PlatformRating {
  platform: string;
  rating: string;
  volume: string;
}

export interface StudioInfo {
  name: string;
  tagline: string;
  principalArchitect: string;
  establishedNote: string;
  locationShort: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  secondaryPhones: string[];
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  hours: string;
  sundayNote: string;
  instagramSearchUrl: string;
  mapsDirectionsUrl: string;
  platformRatings: PlatformRating[];
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  location: string;
  scope: string;
  image: string;
  imageAlt: string;
  aspect: 'landscape' | 'portrait' | 'wide';
  description: string;
  architecturalNotes: string[];
  roomZoneId: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  whyItMatters: string;
  deliverables: string[];
  featuredProjectId: string;
}

export interface ProcessStage {
  step: string;
  title: string;
  summary: string;
  detail: string;
}

export const STUDIO_INFO: StudioInfo = {
  name: 'SHAKYAWAR DESIGN STUDIO',
  tagline: 'Architecture · Interior · Landscape',
  principalArchitect: 'Rajesh K. C. Shakyawar',
  establishedNote: 'Since 1989 (Directory & Studio Mark)',
  locationShort: 'Indore, Madhya Pradesh',
  address: '77, Bicholi Hapsi Main Road, Revenue Nagar, near IDA 140, Indore, Madhya Pradesh – 452016',
  phoneDisplay: '+91 73899 34877',
  phoneHref: 'tel:+917389934877',
  secondaryPhones: ['0731 259 0377', '+91 98930 90025'],
  whatsappNumber: '917389934877',
  whatsappUrl:
    'https://wa.me/917389934877?text=Hello%20Shakyawar%20Design%20Studio%2C%20I%20would%20like%20to%20discuss%20an%20architectural%20or%20interior%20design%20project.',
  email: 'rajesh1969@gmail.com',
  hours: 'Monday – Saturday · 9:00 AM – 8:00 PM',
  sundayNote: 'Sunday · Closed / By Prior Appointment',
  instagramSearchUrl: 'https://www.instagram.com/explore/tags/shakyawardesignstudio/',
  mapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Shakyawar+Design+Studio+77+Bicholi+Hapsi+Main+Road+Indore+452016',
  platformRatings: [
    { platform: 'Google Business', rating: '5.0', volume: '67 client reviews' },
    { platform: 'Justdial', rating: '5.0', volume: '73 verified ratings' },
    { platform: 'Magicpin', rating: '5.0', volume: '64 ratings · 317 photos' },
  ],
};

export const STUDIO_MEDIA = {
  officeInterior: '/assets/aistudio/shaky_bcde5a06.webp',
  officeInteriorAlt:
    'Shakyawar Design Studio office interior in Indore featuring a sculpted layered ceiling, recessed warm cove lighting, and architectural workstations.',
  brandCard: '/assets/aistudio/shaky3_adeab0e2.webp',
  brandCardAlt:
    'Shakyawar Design Studio stationery and monogram presentation on timber studio desk.',
  officialEmblem: '/assets/aistudio/logoshakyawar_b14912d7.jpeg',
  officialEmblemAlt:
    'Shakyawar Design Studio SD monogram emblem established since 1989.',
  rawShell2K: '/assets/aistudio/shaky5.webp_964f2329_2K_9310e4c2.jpg',
  rawShellAlt: 'Unfinished residential room shell prior to interior architectural intervention.',
};

export const SELECTED_PROJECTS: ProjectItem[] = [
  {
    id: 'curved-balcony-residence',
    index: '01',
    title: 'Sculpted Curve Residence',
    category: 'Architecture & Planning',
    location: 'Indore, Madhya Pradesh',
    scope: 'Multi-Storey Urban Elevation',
    image: '/assets/aistudio/shaky2_89384d71.webp',
    imageAlt:
      'Three-storey contemporary residence featuring a sweeping curved concrete balcony frame, vertical timber louvers, and cascading balcony planters.',
    aspect: 'portrait',
    description:
      'A multi-level urban residence defined by an enveloping curved plaster frame, vertical timber screening, and deep shaded balconies calibrated for natural light and privacy.',
    architecturalNotes: [
      'Curved monolithic upper balcony framing recessed glass balustrades',
      'Full-height vertical timber louvers softening western sun exposure',
      'Integrated planter pockets and warm timber soffit overhangs',
    ],
    roomZoneId: 'facade-architecture',
  },
  {
    id: 'walnut-stone-suite',
    index: '02',
    title: 'Walnut & Vein-Cut Stone Suite',
    category: 'Residential Interior Design',
    location: 'Indore, Madhya Pradesh',
    scope: 'Bedroom Interior & Joinery',
    image: '/assets/aistudio/shaky5_8486133f.webp',
    imageAlt:
      'Completed luxury master bedroom featuring fluted walnut wardrobes, bookmatched natural stone headboard backdrop, warm oak flooring, and layered track lighting.',
    aspect: 'landscape',
    description:
      'Transformed from a bare apartment shell into a calm architectural suite anchored by fluted walnut panelling, vein-cut stone cladding, and warm indirect cove illumination.',
    architecturalNotes: [
      'Bookmatched natural stone headboard panel framed in solid walnut',
      'Custom fluted timber wardrobe elevation and warm oak plank flooring',
      'Layered lighting combining ceiling coves, directional tracks, and woven pendant',
    ],
    roomZoneId: 'bedroom-suite',
  },
  {
    id: 'brick-arch-gallery',
    index: '03',
    title: 'Arched Brick & Steel Gallery',
    category: 'Commercial & Office Interiors',
    location: 'Indore, Madhya Pradesh',
    scope: 'Showroom & Gallery Interior',
    image: '/assets/aistudio/shaky6_d5c7357b.webp',
    imageAlt:
      'Architectural gallery interior featuring tall black steel-framed arched glass doors, central exposed brick bay display alcove, and honed marble floor.',
    aspect: 'landscape',
    description:
      'A tactile display gallery uniting arched black steel fenestration, an exposed brick architectural bay, and expansive honed stone flooring under crisp track lighting.',
    architecturalNotes: [
      'Full-height arched steel-framed glass doors welcoming natural daylight',
      'Central red-brick faceted showcase bay with classical crown cornice',
      'Continuous honed marble slab flooring calibrated for large-space flow',
    ],
    roomZoneId: 'gallery-hall',
  },
  {
    id: 'fountain-courtyard-estate',
    index: '04',
    title: 'Colonnade & Courtyard Estate',
    category: 'Landscape Planning & Courtyards',
    location: 'Indore, Madhya Pradesh',
    scope: 'Estate Architecture & Forecourt',
    image: '/assets/aistudio/shaky4_fd29bd5b.webp',
    imageAlt:
      'Grand classical-contemporary residence exterior with double-height portico columns, balustraded terraces, and sculpted stone fountain forecourt.',
    aspect: 'wide',
    description:
      'An expansive private estate composed around a symmetrical columned portico, curved upper balustrades, and an arrival forecourt centered on a tiered stone water fountain.',
    architecturalNotes: [
      'Double-height entrance portico with paired columns and deep cornice brackets',
      'Stone-paved arrival court anchored by a sculpted water feature',
      'Wrap-around balustraded verandas overlooking landscaped borders',
    ],
    roomZoneId: 'courtyard-landscape',
  },
  {
    id: 'brick-tower-villa',
    index: '05',
    title: 'Stone & Timber Portico Villa',
    category: 'Home Renovations & Space Planning',
    location: 'Indore, Madhya Pradesh',
    scope: 'Villa Elevation & Gatehouse',
    image: '/assets/aistudio/unnamed__6__1bf5fbb9.webp',
    imageAlt:
      'Multi-level villa elevation combining natural split-face stone piers, arched brick tower balcony, timber ceiling soffits, and bespoke laser-cut entry gate.',
    aspect: 'landscape',
    description:
      'Layered residential architecture pairing textured natural stone masonry with warm brick volumes, recessed timber soffits, and a custom patterned entry gate.',
    architecturalNotes: [
      'Split-face dark stone piers grounding the double-storey entrance porch',
      'Arched brick upper loggia creating vertical rhythm across terraces',
      'Timber-lined balcony ceilings with continuous glass railings',
    ],
    roomZoneId: 'living-terrace',
  },
  {
    id: 'institutional-campus',
    index: '06',
    title: 'Symmetrical Campus Pavilion',
    category: 'Architecture & Planning',
    location: 'Madhya Pradesh',
    scope: 'Institutional Facade & Grounds',
    image: '/assets/aistudio/shaky1_9b82fb2a.webp',
    imageAlt:
      'Multi-storey institutional campus facade with vertical window colonnades, pedimented central entrance portico, and landscaped green lawn.',
    aspect: 'landscape',
    description:
      'Large-scale institutional architecture organized around a central pedimented portico, rhythmic vertical fenestration bays, and an open landscaped forecourt.',
    architecturalNotes: [
      'Pedimented central porch establishing clear civic scale and arrival',
      'Vertical multi-storey window bays providing balanced daylighting',
      'Sweeping curved lawn edge and perimeter pathway planning',
    ],
    roomZoneId: 'large-space-wing',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'architecture-planning',
    index: '01',
    title: 'Architecture & Architectural Planning',
    subtitle: 'Ground-Up Residences · Structural Planning · Facade Elevations',
    description:
      'Comprehensive architectural planning from site orientation and structural coordination to multi-level massing, sun-shading louvers, and elevation detailing.',
    whyItMatters:
      'Sound structural proportion and passive climate response create spaces that stay comfortable, dignified, and timeless for decades.',
    deliverables: [
      'Site zoning, spatial massing & structural engineering coordination',
      'Climate-responsive elevation design & fenestration schedules',
      'Working architectural drawings & site review alignment',
    ],
    featuredProjectId: 'curved-balcony-residence',
  },
  {
    id: 'residential-interiors',
    index: '02',
    title: 'Residential Interior Design',
    subtitle: 'Living Suites · Bedrooms · Interior Decoration',
    description:
      'Thoughtfully planned residential interiors that balance calm aesthetics, ergonomics, and daily utility—transforming raw shells into warm, tailored homes.',
    whyItMatters:
      'Every millimetre of storage, circulation, and lighting temperature shapes how serene and functional a home feels each day.',
    deliverables: [
      'Room-by-room furniture layout & spatial circulation planning',
      'Ceiling architecture, layered lighting & electrical coordination',
      'Material curation across timber, stone, textiles & finishes',
    ],
    featuredProjectId: 'walnut-stone-suite',
  },
  {
    id: 'commercial-office',
    index: '03',
    title: 'Commercial & Office Interiors',
    subtitle: 'Studios · Showrooms · Institutional Wings',
    description:
      'Cohesive, legible commercial and studio environments built to guide visitor flow, frame work or merchandise, and endure heavy daily use.',
    whyItMatters:
      'Well-organized commercial spaces project quiet credibility to clients while supporting focus and comfort for teams.',
    deliverables: [
      'Reception, gallery & workstation spatial zoning',
      'Acoustic, lighting & high-durability surface specification',
      'Custom display alcoves, glazing frames & focal ceilings',
    ],
    featuredProjectId: 'brick-arch-gallery',
  },
  {
    id: 'renovations-space-planning',
    index: '04',
    title: 'Home Renovations & Space Planning',
    subtitle: 'Spatial Reimagining · Layout Upgrades · Facade Renewal',
    description:
      'Reworking existing residences and floorplates through strategic spatial re-planning, daylight openings, and updated material assemblies.',
    whyItMatters:
      'Unlocking wasted corners and improving natural light often transforms an existing building far more deeply than surface paint alone.',
    deliverables: [
      'Existing structure study & functional layout reconfiguration',
      'Interior surface overhaul & modern service integration',
      'Exterior elevation refresh & entry threshold redesign',
    ],
    featuredProjectId: 'brick-tower-villa',
  },
  {
    id: 'landscape-planning',
    index: '05',
    title: 'Landscape Planning & Courtyards',
    subtitle: 'Arrival Forecourts · Water Features · Garden Edges',
    description:
      'Extending architectural geometry outdoors through stone-paved arrival courts, stepped terraces, boundary screens, and integrated greenery.',
    whyItMatters:
      'Architecture feels grounded when indoor thresholds open naturally onto shaded courts, water basins, and living foliage.',
    deliverables: [
      'Arrival forecourt, pathway & boundary wall composition',
      'Water feature, pergola & outdoor seating integration',
      'Balcony planter pockets & softscape framing',
    ],
    featuredProjectId: 'fountain-courtyard-estate',
  },
  {
    id: 'joinery-visualisation',
    index: '06',
    title: 'Custom Joinery & 3D Visualisation',
    subtitle: 'Bespoke Millwork · Furniture Detailing · 3D Previews',
    description:
      'Custom wardrobes, fluted panelling, vanity units, and pre-execution 3D architectural visualisations so proportions and finishes are verified early.',
    whyItMatters:
      'Seeing accurate 3D lighting and resolving joinery elevations upfront prevents costly guesswork once fabrication begins.',
    deliverables: [
      'Photorealistic 3D interior & exterior design visualisations',
      'Custom wardrobe, headboard, console & cabinetry drawings',
      'Hardware, veneer & stone edge-profile detailing',
    ],
    featuredProjectId: 'institutional-campus',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: '01',
    title: 'Understanding the Space',
    summary: 'Listening, measuring, and reading the site.',
    detail:
      'Every commission begins with an in-depth dialogue around how you live or work, paired with careful study of natural light, proportions, and structural possibilities.',
  },
  {
    step: '02',
    title: 'Concept Development',
    summary: 'Spatial zoning, massing, and material mood.',
    detail:
      'We translate requirements into clear spatial layouts, architectural concepts, and curated palettes of wood, stone, plaster, and daylight.',
  },
  {
    step: '03',
    title: 'Design Development',
    summary: 'Refining every elevation, joint, and lighting line.',
    detail:
      'Drawings, 3D visualisations, joinery elevations, and electrical-ceiling plans are resolved down to exact tolerances before site work commences.',
  },
  {
    step: '04',
    title: 'Execution and Completion',
    summary: 'Guided realization from shell to finished environment.',
    detail:
      'Through structured studio reviews and coordination on site, approved architectural details and interior finishes come together as planned.',
  },
];
