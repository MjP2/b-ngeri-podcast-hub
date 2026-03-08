import { episodes as defaultEpisodes, LINKS as defaultLinks, Episode } from "./episodes";

export interface PodcastContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  episodes: Episode[];
  links: {
    youtube: string;
    spotify: string;
    apple: string;
    pocketcasts: string;
    instagram: string;
    tiktok: string;
  };
  footer: {
    copyright: string;
  };
}

const STORAGE_KEY = "bangeri-cms";

export function defaultContent(): PodcastContent {
  return {
    hero: {
      title: "Bängeri",
      subtitle: "Podcast",
      description:
        "Ajankohtaispodcast, jonka keskustelijoina toimivat Elias Aalto ja Matias Pietilä. IT-alan ammattilaisia ja yrittäjiä — tuttuja mm. Leijonan Luolasta, Woltista ja Amazing Racesta.",
    },
    episodes: defaultEpisodes,
    links: { ...defaultLinks },
    footer: {
      copyright: "© Aalto Digital Oy",
    },
  };
}

export function loadContent(): PodcastContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultContent();
}

export function saveContent(content: PodcastContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function exportContentJson(content: PodcastContent): string {
  return JSON.stringify(content, null, 2);
}

export function importContentJson(json: string): PodcastContent {
  const parsed = JSON.parse(json);
  if (!parsed.hero || !parsed.episodes) throw new Error("Invalid format");
  return parsed;
}

export function generateEpisodeId(episodes: Episode[]): number {
  return episodes.length > 0 ? Math.max(...episodes.map((e) => e.id)) + 1 : 1;
}
