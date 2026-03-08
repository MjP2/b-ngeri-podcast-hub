import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
  Download,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  PodcastContent,
  loadContent,
  saveContent,
  exportContentJson,
  importContentJson,
  generateEpisodeId,
} from "@/lib/cms";
import { Episode } from "@/lib/episodes";
import { Link } from "react-router-dom";

export default function Admin() {
  const [content, setContent] = useState<PodcastContent>(() => loadContent());
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "episodes" | "links" | "footer">("hero");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveContent(content);
  }, [content]);

  const updateHero = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateLinks = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, links: { ...prev.links, [field]: value } }));
  };

  const updateFooter = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, footer: { ...prev.footer, [field]: value } }));
  };

  const addEpisode = () => {
    const newEp: Episode = {
      id: generateEpisodeId(content.episodes),
      title: "",
      date: "",
      duration: "",
      description: "",
      appleUrl: "",
    };
    setContent((prev) => ({ ...prev, episodes: [newEp, ...prev.episodes] }));
    setExpandedEpisode(newEp.id);
    toast.success("Uusi jakso lisätty");
  };

  const updateEpisode = (id: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      episodes: prev.episodes.map((ep) =>
        ep.id === id ? { ...ep, [field]: value } : ep
      ),
    }));
  };

  const removeEpisode = (id: number) => {
    setContent((prev) => ({
      ...prev,
      episodes: prev.episodes.filter((ep) => ep.id !== id),
    }));
    toast.info("Jakso poistettu");
  };

  const moveEpisode = (id: number, dir: -1 | 1) => {
    setContent((prev) => {
      const eps = [...prev.episodes];
      const idx = eps.findIndex((e) => e.id === id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === eps.length - 1))
        return prev;
      [eps[idx], eps[idx + dir]] = [eps[idx + dir], eps[idx]];
      return { ...prev, episodes: eps };
    });
  };

  const handleExport = () => {
    const json = exportContentJson(content);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bangeri-content.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sisältö exportattu");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importContentJson(reader.result as string);
        setContent(imported);
        toast.success("Sisältö importattu");
      } catch (err: any) {
        toast.error(`Import epäonnistui: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const tabs = [
    { key: "hero" as const, label: "Hero" },
    { key: "episodes" as const, label: `Jaksot (${content.episodes.length})` },
    { key: "links" as const, label: "Linkit" },
    { key: "footer" as const, label: "Footer" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <h1 className="font-display text-3xl font-bold text-gradient">
              Hallinta
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download size={14} /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => importRef.current?.click()}>
              <Upload size={14} /> Import
            </Button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero editor */}
        {activeTab === "hero" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Hero-osio</h2>
            <FieldInput label="Otsikko" value={content.hero.title} onChange={(v) => updateHero("title", v)} />
            <FieldInput label="Alaotsikko" value={content.hero.subtitle} onChange={(v) => updateHero("subtitle", v)} />
            <FieldTextarea label="Kuvaus" value={content.hero.description} onChange={(v) => updateHero("description", v)} />
          </div>
        )}

        {/* Episodes editor */}
        {activeTab === "episodes" && (
          <div className="space-y-3">
            <Button onClick={addEpisode} className="gap-2 w-full">
              <Plus size={16} /> Lisää jakso
            </Button>
            {content.episodes.map((ep) => (
              <div key={ep.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedEpisode(expandedEpisode === ep.id ? null : ep.id)}
                >
                  <span className="font-display text-sm font-bold text-primary min-w-[2rem]">
                    #{content.episodes.indexOf(ep) + 1}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {ep.title || "(nimetön)"}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">{ep.date}</span>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveEpisode(ep.id, -1)}>
                      <ChevronUp size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveEpisode(ep.id, 1)}>
                      <ChevronDown size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeEpisode(ep.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                {expandedEpisode === ep.id && (
                  <div className="border-t border-border px-4 py-4 space-y-3">
                    <FieldInput label="Otsikko" value={ep.title} onChange={(v) => updateEpisode(ep.id, "title", v)} />
                    <div className="grid grid-cols-2 gap-3">
                      <FieldInput label="Päivämäärä" value={ep.date} onChange={(v) => updateEpisode(ep.id, "date", v)} placeholder="01.01.2025" />
                      <FieldInput label="Kesto" value={ep.duration} onChange={(v) => updateEpisode(ep.id, "duration", v)} placeholder="1h 30min" />
                    </div>
                    <FieldTextarea label="Kuvaus" value={ep.description} onChange={(v) => updateEpisode(ep.id, "description", v)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Links editor */}
        {activeTab === "links" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Alustalinkit</h2>
            <FieldInput label="YouTube" value={content.links.youtube} onChange={(v) => updateLinks("youtube", v)} />
            <FieldInput label="Spotify" value={content.links.spotify} onChange={(v) => updateLinks("spotify", v)} />
            <FieldInput label="Apple Podcasts" value={content.links.apple} onChange={(v) => updateLinks("apple", v)} />
            <FieldInput label="Pocket Casts" value={content.links.pocketcasts} onChange={(v) => updateLinks("pocketcasts", v)} />
            <FieldInput label="Instagram" value={content.links.instagram} onChange={(v) => updateLinks("instagram", v)} />
            <FieldInput label="TikTok" value={content.links.tiktok} onChange={(v) => updateLinks("tiktok", v)} />
          </div>
        )}

        {/* Footer editor */}
        {activeTab === "footer" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Footer</h2>
            <FieldInput label="Copyright" value={content.footer.copyright} onChange={(v) => updateFooter("copyright", v)} />
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="min-h-[80px]"
      />
    </div>
  );
}
