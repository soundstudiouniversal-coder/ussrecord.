
export interface Artist {
  id: string;
  name: string;
  link: string;
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  link: string;
}

export const artists: Artist[] = [
  { id: '1', name: 'CYBERPUNK', link: 'https://spotify.com' },
  { id: '2', name: 'GHOST IN THE MACHINE', link: 'https://youtube.com' },
  { id: '3', name: 'NEON SHADOW', link: 'https://soundcloud.com' },
];

export const releases: Release[] = [
  { id: '1', title: 'Digital Dreams', artist: 'CYBERPUNK', link: 'https://spotify.com' },
  { id: '2', title: 'System Shock', artist: 'GHOST IN THE MACHINE', link: 'https://youtube.com' },
  { id: '3', title: 'Midnight Signal', artist: 'NEON SHADOW', link: 'https://soundcloud.com' },
];
