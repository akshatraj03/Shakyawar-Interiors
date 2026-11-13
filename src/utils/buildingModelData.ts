export interface ArchitecturalZone {
  id: string;
  code: string;
  label: string;
  category: string;
  floorLevel: string;
  description: string;
  projectId: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  highlightCenter: [number, number, number];
  highlightSize: [number, number, number];
}

export const OVERVIEW_CAMERA_POSE = {
  position: [15.5, 9.8, 16.5] as [number, number, number],
  target: [0, 3.2, 0] as [number, number, number],
};

export const ARCHITECTURAL_ZONES: ArchitecturalZone[] = [
  {
    id: 'bedroom-suite',
    code: '01',
    label: 'Master Bedroom Suite',
    category: 'Residential Interior Design',
    floorLevel: 'Level 02 · East Wing',
    description: 'Warm fluted walnut joinery, vein-cut stone headboard wall, and layered architectural lighting.',
    projectId: 'walnut-stone-suite',
    cameraPosition: [7.6, 6.2, 7.8],
    cameraTarget: [2.2, 4.4, 0.5],
    highlightCenter: [2.3, 4.4, 0.4],
    highlightSize: [4.6, 2.5, 4.2],
  },
  {
    id: 'facade-architecture',
    code: '02',
    label: 'Sculpted Balcony & Louvers',
    category: 'Residential Architecture',
    floorLevel: 'Level 02 · Front Elevation',
    description: 'Signature sweeping concrete balcony curve paired with vertical timber sun-breakers and hanging greenery.',
    projectId: 'curved-balcony-residence',
    cameraPosition: [4.8, 7.6, 11.4],
    cameraTarget: [-1.4, 5.2, 2.2],
    highlightCenter: [-1.4, 5.0, 2.4],
    highlightSize: [4.8, 2.8, 2.4],
  },
  {
    id: 'gallery-hall',
    code: '03',
    label: 'Arched Gallery & Lounge',
    category: 'Large-Space Design',
    floorLevel: 'Level 01 · Central Atrium',
    description: 'High-ceiling steel-framed arched glazing opening onto honed marble floors and tactile brick display walls.',
    projectId: 'brick-arch-gallery',
    cameraPosition: [-7.2, 4.2, 9.6],
    cameraTarget: [-1.6, 1.8, 0.4],
    highlightCenter: [-1.6, 1.75, 0.2],
    highlightSize: [5.4, 3.1, 4.8],
  },
  {
    id: 'living-terrace',
    code: '04',
    label: 'Stone Portico & Entry',
    category: 'Home Renovations & Elevation',
    floorLevel: 'Level 01 · Arrival Porch',
    description: 'Split-face stone piers, timber soffits, and bespoke metalwork framing the arrival threshold.',
    projectId: 'brick-tower-villa',
    cameraPosition: [9.2, 3.6, 10.2],
    cameraTarget: [2.6, 1.7, 2.2],
    highlightCenter: [2.6, 1.7, 1.8],
    highlightSize: [4.4, 3.0, 3.4],
  },
  {
    id: 'courtyard-landscape',
    code: '05',
    label: 'Courtyard & Water Plaza',
    category: 'Architectural & Landscape Design',
    floorLevel: 'Ground Plane · Forecourt',
    description: 'Sculpted stone courtyard plinth, tiered water basin, and manicured perimeter planting.',
    projectId: 'fountain-courtyard-estate',
    cameraPosition: [10.4, 5.4, 13.8],
    cameraTarget: [-0.8, 0.8, 5.2],
    highlightCenter: [-0.8, 0.7, 5.4],
    highlightSize: [5.6, 1.4, 4.0],
  },
];

export function findZoneById(zoneId: string | null): ArchitecturalZone | undefined {
  if (!zoneId) return undefined;
  return ARCHITECTURAL_ZONES.find((z) => z.id === zoneId);
}

export function dampScalar(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * Math.max(0, dt)));
}
