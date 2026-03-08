export interface Episode {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string;
  appleUrl: string;
}

export const episodes: Episode[] = [
  {
    id: 1,
    title: "Miksi koulukiusaamista ei saada loppumaan?",
    date: "10.10.2025",
    duration: "1h 14min",
    description: "Paljon Onnea Bängeri! Tässä jaksossa juhlistamme Bängerin ensimmäistä vuotta muistelemalla kulunutta matkaa. Pohdimme kestävää koulukiusaamista ja jaamme hauskoja hetkiä ja syvällisiä ajatuksia viime vuodelta.",
    appleUrl: "https://podcasts.apple.com/us/podcast/miksi-koulukiusaamista-ei-saada-loppumaan/id1774063928?i=1000730990609",
  },
  {
    id: 2,
    title: "Kuka on oikeasti maailman rikkain ihminen?",
    date: "02.10.2025",
    duration: "56 min",
    description: "Jaksossa keskustellaan uudesta kirjasta, mikä käsittelee Woltin historiaa. Pohditaan myös rikkauden määritelmää ja tarjotaan vaihtoehto maailman rikkaimmalle ihmiselle.",
    appleUrl: "https://podcasts.apple.com/us/podcast/kuka-on-oikeasti-maailman-rikkain-ihminen/id1774063928?i=1000729719846",
  },
  {
    id: 3,
    title: "USA:n sensuuri, Palestiina ja Gaza, yksinäisyys ja tekoäly",
    date: "25.09.2025",
    duration: "1h 1min",
    description: "Jaksossa pohditaan Palestiinan ja Gazan konfliktia, Yhdysvaltain sensuuria, sekä ratkaisua yksinäisyyteen tekoälyavusteisesti. Jaksossa nähdään myös ensimmäistä kertaa Leijona-corneri.",
    appleUrl: "https://podcasts.apple.com/us/podcast/usa-n-sensuuri-palestiina-ja-gaza-yksin%C3%A4isyys-ja-teko%C3%A4ly/id1774063928?i=1000728409532",
  },
  {
    id: 4,
    title: "Miten Wolt sai alkunsa? Pt. 2",
    date: "18.09.2025",
    duration: "1h 48min",
    description: "Jaksossa keskustellaan ruuankuljetuspalvelu Woltin alkuajoista, sekä tekijöistä, mitkä johtivat Woltin menestystarinaan. Mitä vaikutuksia koronavirus-pandemialla oli Woltin liiketoiminnalle?",
    appleUrl: "https://podcasts.apple.com/us/podcast/miten-wolt-sai-alkunsa-pt-2/id1774063928?i=1000727358893",
  },
  {
    id: 5,
    title: "Miten Wolt sai alkunsa?",
    date: "12.09.2025",
    duration: "1h 11min",
    description: "Jaksossa keskustellaan ruuankuljetuspalvelu Woltin alkuajoista. Mikä on salaisuus lahjakkaiden tekijöiden omistautumisen takana? Kuka oli ensimmäinen sijoittaja Woltissa?",
    appleUrl: "https://podcasts.apple.com/us/podcast/miten-wolt-sai-alkunsa/id1774063928?i=1000726515954",
  },
  {
    id: 6,
    title: "Näin teet varmaa passiivista tuloa!",
    date: "04.09.2025",
    duration: "45 min",
    description: "Jaksossa keskustellaan sijoittamisesta, hallituksen toiminnasta, sekä puolustusvoimien hakaristin käytöstä. Miten tehdään varmaa passiivista tuloa?",
    appleUrl: "https://podcasts.apple.com/us/podcast/n%C3%A4in-teet-varmaa-passiivista-tuloa/id1774063928?i=1000724997297",
  },
  {
    id: 7,
    title: "Elias Aalto opiaattikoukussa!",
    date: "28.08.2025",
    duration: "57 min",
    description: "Jaksossa keskustellaan huumeista ja rahasta! Elias paljastaa olleensa aiemmin huumekoukussa polvileikkauksen jälkeen. Kannattaako huumeet laillistaa?",
    appleUrl: "https://podcasts.apple.com/us/podcast/elias-aalto-opiaattikoukussa/id1774063928?i=1000723891288",
  },
  {
    id: 8,
    title: "ULTIMAATTINEN asuntomessujen trollaus",
    date: "21.08.2025",
    duration: "1h 3min",
    description: "Jaksossa paneudutaan maailmanpolitiikkaan, sekä luonnon oudoimpiin ja salaperäisimpiin otuksiin, eli ankeriaisiin. Myös Helsingin joukkoliikenteen hintojen nousu herätti keskustelua.",
    appleUrl: "https://podcasts.apple.com/us/podcast/ultimaattinen-asuntomessujen-trollaus/id1774063928?i=1000722962321",
  },
];

export const LINKS = {
  youtube: "https://www.youtube.com/@B%C3%A4ngeriPodcast",
  spotify: "https://open.spotify.com/show/4PFhBdFZsXAH1hBb4tVYjl",
  apple: "https://podcasts.apple.com/us/podcast/b%C3%A4ngeri/id1774063928",
  pocketcasts: "https://pca.st/podcast/bangeri",
  instagram: "https://www.instagram.com/bangeripodcast",
  tiktok: "https://www.tiktok.com/@bangeri.podcast",
};
