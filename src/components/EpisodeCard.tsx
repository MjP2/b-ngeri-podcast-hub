import { useState, useRef, useEffect } from "react";
import { Episode } from "@/lib/episodes";
import { Clock, Calendar, ChevronDown } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.searchParams.has("v")) {
      videoId = u.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

const EpisodeCard = ({ episode, index }: EpisodeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const embedUrl = episode.youtubeUrl ? getYoutubeEmbedUrl(episode.youtubeUrl) : null;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, episode]);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="group block w-full rounded-xl border border-border bg-card p-5 text-left transition-colors duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {episode.title}
            </h3>
            {episode.poem && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Runo
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {episode.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {episode.duration}
            </span>
          </div>
          {expanded && (
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {episode.description}
                </p>
                {episode.poem && (
                  <p className="text-sm italic leading-relaxed text-muted-foreground/80 whitespace-pre-line">
                    {episode.poem}
                  </p>
                )}
              </div>
              {embedUrl && (
                <div
                  className="relative shrink-0 overflow-hidden rounded-lg w-full md:w-64 lg:w-80 aspect-video"
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    src={embedUrl}
                    title={episode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 self-center text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </div>
    </button>
  );
};

export default EpisodeCard;
