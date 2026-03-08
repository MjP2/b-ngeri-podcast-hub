import heroImage from "@/assets/bangeri-hero.jpg";
import { episodes } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";
import PlatformLinks from "@/components/PlatformLinks";

const Index = () => {
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
          Podcast
        </span>
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Bängeri
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Ajankohtaispodcast, jonka keskustelijoina toimivat{" "}
          <span className="text-foreground font-medium">Elias Aalto</span> ja{" "}
          <span className="text-foreground font-medium">Matias Pietilä</span>.
          IT-alan ammattilaisia ja yrittäjiä — tuttuja mm. Leijonan Luolasta,
          Woltista ja Amazing Racesta.
        </p>
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kuuntele missä tahansa
          </p>
          <PlatformLinks />
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
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© Aalto Digital Oy</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/bangeripodcast" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">Instagram</a>
            <a href="https://www.tiktok.com/@bangeri.podcast" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">TikTok</a>
            <a href="https://www.youtube.com/@B%C3%A4ngeriPodcast" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
