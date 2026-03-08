import { useState, useEffect } from "react";
import heroImage from "@/assets/bangeri-hero.jpg";
import { loadContent } from "@/lib/cms";
import { Episode } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";
import PlatformLinks from "@/components/PlatformLinks";

const Index = () => {
  const content = loadContent();
  const { hero, links, footer, sponsors } = content;
  const [episodes, setEpisodes] = useState<Episode[]>(content.episodes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}episodes.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Episode[]) => {
        setEpisodes(data);
        setLoading(false);
      })
      .catch(() => {
        // Fall back to CMS/hardcoded episodes
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Full-width Hero Image */}
      <div className="relative w-full">
        <img
          src={heroImage}
          alt="Bängeri Podcast"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Info section */}
      <section className="container mx-auto -mt-16 relative z-10 px-4 pb-12">
        <span className="mb-2 inline-block rounded-full bg-primary/15 px-3 py-1 font-display text-xs font-semibold uppercase tracking-widest text-primary">
          {hero.subtitle}
        </span>
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {hero.description}
        </p>
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kuuntele missä tahansa
          </p>
          <PlatformLinks links={links} />
        </div>
      </section>

      {/* Episodes */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="mb-8 font-display text-2xl font-bold text-foreground md:text-3xl">
          Jaksot <span className="text-gradient">({episodes.length})</span>
        </h2>
        <div className="grid gap-3">
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        {sponsors && sponsors.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sponsorit
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                >
                  <img
                    src={sponsor.imageUrl}
                    alt="Sponsori"
                    className="h-8 max-w-[120px] object-contain md:h-10 md:max-w-[150px]"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex items-center gap-4">
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">Instagram</a>
            )}
            {links.tiktok && (
              <a href={links.tiktok} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">TikTok</a>
            )}
            {links.youtube && (
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">YouTube</a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
