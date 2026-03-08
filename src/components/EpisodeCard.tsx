import { Episode } from "@/lib/episodes";
import { Play, Clock, Calendar } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

const EpisodeCard = ({ episode, index }: EpisodeCardProps) => {
  return (
    <a
      href={episode.appleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {episode.title}
          </h3>
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
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {episode.description}
          </p>
        </div>
        <div className="shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-5 w-5 text-primary" fill="currentColor" />
        </div>
      </div>
    </a>
  );
};

export default EpisodeCard;
