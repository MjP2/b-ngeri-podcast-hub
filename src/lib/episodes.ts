export interface Episode {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string;
  appleUrl: string;
  poem?: string;
  youtubeUrl?: string;
}

export const episodes: Episode[] = [];

export const LINKS = {
  youtube: "https://www.youtube.com/@B%C3%A4ngeriPodcast",
  spotify: "https://open.spotify.com/show/4PFhBdFZsXAH1hBb4tVYjl",
  apple: "https://podcasts.apple.com/us/podcast/b%C3%A4ngeri/id1774063928",
  pocketcasts: "https://pca.st/podcast/bangeri",
  instagram: "https://www.instagram.com/bangeripodcast",
  tiktok: "https://www.tiktok.com/@bangeri.podcast",
};
