export interface LineupArtistEntry {
  order: string;
  name: string;
  slug: string;
  genre: string;
  highlight?: string;
}

export const LINEUP_ARTISTS: readonly LineupArtistEntry[] = [
  {
    order: '01',
    name: 'The Crown Vics',
    slug: 'the-crown-vics',
    genre: 'Rock n roll dance band',
    highlight: 'Kicking off the afternoon on Franklin Street',
  },
  {
    order: '02',
    name: 'OPEN X',
    slug: 'open-x',
    genre: 'Power pop rock',
    highlight: 'High energy rock and live sound setup',
  },
  {
    order: '03',
    name: 'Grass Rug',
    slug: 'grass-rug',
    genre: 'Indie jam rock',
    highlight: 'Improvisational jam rock grooves',
  },
  {
    order: '04',
    name: 'Acadia Rising',
    slug: 'acadia-rising',
    genre: 'World Rhythms and Global Fusion',
    highlight: 'Atmospheric world rhythm fusion',
  },
  {
    order: '05',
    name: 'Michael Anderson',
    slug: 'michael-anderson',
    genre: 'Solo piano',
    highlight: 'Acoustic piano compositions',
  },
  {
    order: '06',
    name: 'DCoop',
    slug: 'dcoop',
    genre: 'Hip-hop, reggae, rock, punk, tribal, country, EDM and R&B',
    highlight: 'Lyricism and community energy',
  },
  {
    order: '07',
    name: 'LyonsDen',
    slug: 'lyonsden',
    genre: 'Native, Electro, Reggae and Hip-hop',
    highlight: 'Electronic fusion and live rhythms',
  },
  {
    order: '08',
    name: 'Tom Fellenz',
    slug: 'tom-fellenz',
    genre: 'Solo Instrumental Acoustic Guitar',
    highlight: 'Closes out the Outdoor Festival on the parklet stage',
  },
];
