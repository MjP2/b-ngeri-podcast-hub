import { useState, useEffect, useRef } from "react";
import { Episode } from "@/lib/episodes";
import { Clock, Calendar, ChevronDown } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

const EpisodeCard = ({ episode, index }: EpisodeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={() => setExpanded(!expanded)}
      className="group block w-full rounded-xl border border-border bg-card p-5 text-left transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.5s ease-out ${index * 0.05}s, transform 0.5s ease-out ${index * 0.05}s`,
      }}
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
            <div className="mt-3 space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {episode.description}
              </p>
              {episode.poem && (
                <p className="text-sm italic leading-relaxed text-muted-foreground/80 whitespace-pre-line">
                  {episode.poem}
                </p>
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
