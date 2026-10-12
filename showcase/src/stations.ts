export interface Station {
  id: string;
  label: string;
  cam: [number, number, number];
  look: [number, number, number];
  sky: [string, string]; // top, horizon
}

/**
 * One entry per <section data-step>. The camera glides between these and the sky blends with it.
 * Subjects sit in the lower two thirds of the frame so the headline can own the top.
 */
export const STATIONS: Station[] = [
  { id: 'field', label: 'Field', cam: [0, 2.0, 7.5], look: [0, 3.5, -8], sky: ['#040605', '#f0a45d'] },
  { id: 'grain', label: 'Grain', cam: [0, 1.7, -46], look: [0, 3.1, -60], sky: ['#f5f5f7', '#ffffff'] },
  { id: 'sorter', label: 'Sorter', cam: [0.6, 3.9, -108], look: [0.3, 2.0, -120], sky: ['#030706', '#0c2a22'] },
  { id: 'bag', label: 'Bag', cam: [0, 1.6, -165], look: [0, 3.5, -180], sky: ['#020403', '#0b3d31'] },
  { id: 'container', label: 'Container', cam: [2.2, 3.5, -225], look: [0.2, 4.0, -240], sky: ['#f5f5f7', '#e4e6e8'] },
  { id: 'port', label: 'Port', cam: [3, 3.8, -278], look: [0.4, 3.1, -300], sky: ['#07040f', '#f08a4b'] },
];

export const STATION_Z = [0, -60, -120, -180, -240, -300];
