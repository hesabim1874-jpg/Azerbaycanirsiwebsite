export type Language = 'az' | 'en';

export interface Region {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  description: string;
  placeholderImg: string;
}

export interface Artist {
  name: string;
  period: string;
  famousWorks: string[];
}

export interface RegionData {
  history: string;
  dialectFeatures: string;
  music: string;
  crafts: string;
  artists: Artist[];
}