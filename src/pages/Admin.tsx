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
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import {
  PodcastContent,
  Sponsor,
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
  const [activeTab, setActiveTab] = useState<"hero" | "episodes" | "links" | "footer" | "sponsors" | "settings">("hero");
  const importRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");

  // Fetch episodes.json and merge with CMS content on mount
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    Promise.allSettled([
      fetch(`${base}content.json`).then(r => r.ok ? r.json() : null),
      fetch(`${base}episodes.json`).then(r => r.ok ? r.json() : null),
    ]).then(([contentResult, episodesResult]) => {
      const cmsEpisodes: Episode[] =
        contentResult.status === "fulfilled" && contentResult.value?.episodes
          ? contentResult.value.episodes
          : [];

      const fetchedEpisodes: Episode[] =
        episodesResult.status === "fulfilled" && episodesResult.value
          ? episodesResult.value
          : [];

      // Merge: fetched as base, overlay CMS data (poems etc.)
      const cmsMap = new Map(cmsEpisodes.map((e: Episode) => [e.id, e]));
      const mergedById = new Map<number, Episode>();

      for (const ep of fetchedEpisodes) {
        const cmsEp = cmsMap.get(ep.id);
        mergedById.set(ep.id, cmsEp ? { ...ep, ...cmsEp } : ep);
        cmsMap.delete(ep.id);
      }
      for (const [, ep] of cmsMap) {
        mergedById.set(ep.id, ep);
      }

      const merged = Array.from(mergedById.values());
      if (merged.length > 0) {
        setContent(prev => ({ ...prev, episodes: merged }));
      }

      if (contentResult.status === "fulfilled" && contentResult.value) {
        setContent(prev => ({
          ...prev,
          hero: { ...prev.hero, ...contentResult.value.hero },
          links: { ...prev.links, ...contentResult.value.links },
          footer: { ...prev.footer, ...contentResult.value.footer },
          sponsors: contentResult.value.sponsors || prev.sponsors,
        }));
      }
      setLoaded(true);
    });
  }, []);

  // GitHub settings stored in localStorage
  const [ghOwner, setGhOwner] = useState(() => localStorage.getItem("gh_owner") || "");
  const [ghRepo, setGhRepo] = useState(() => localStorage.getItem("gh_repo") || "");
  const [ghToken, setGhToken] = useState(() => localStorage.getItem("gh_token") || "");

  useEffect(() => {
    localStorage.setItem("gh_owner", ghOwner);
    localStorage.setItem("gh_repo", ghRepo);
    localStorage.setItem("gh_token", ghToken);
  }, [ghOwner, ghRepo, ghToken]);

  const handlePublish = async () => {
    if (!ghOwner || !ghRepo || !ghToken) {
      toast.error("Täytä GitHub-asetukset ensin (Asetukset-välilehti)");
      setActiveTab("settings");
      return;
    }
    setIsPublishing(true);
    try {
      // 1. Build content.json from current admin state
      const contentJson = JSON.stringify(content, null, 2);

      // 2. Get current file SHA (if exists) for update
      const ghHeaders = {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.v3+json",
      };
      let sha: string | undefined;
      try {
        const existing = await fetch(
          `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/public/content.json`,
          { headers: ghHeaders }
        );
        if (existing.ok) {
          const data = await existing.json();
          sha = data.sha;
        }
      } catch {}

      // 3. Commit content.json to GitHub
      const commitRes = await fetch(
        `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/public/content.json`,
        {
          method: "PUT",
          headers: { ...ghHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: commitMessage.trim() || "chore: update content from admin",
            content: btoa(unescape(encodeURIComponent(contentJson))),
            ...(sha ? { sha } : {}),
          }),
        }
      );
      if (!commitRes.ok) {
        const err = await commitRes.json().catch(() => ({}));
        throw new Error(err.message || commitRes.statusText);
      }

      // 4. Trigger fetch-episodes workflow (merges iTunes + overrides)
      const dispatchRes = await fetch(
        `https://api.github.com/repos/${ghOwner}/${ghRepo}/actions/workflows/fetch-episodes.yml/dispatches`,
        {
          method: "POST",
          headers: ghHeaders,
          body: JSON.stringify({ ref: "main" }),
        }
      );
      if (dispatchRes.status === 204) {
        toast.success("Julkaistu! Sivusto päivittyy muutamassa minuutissa.");
      } else {
        toast.success("Sisältö tallennettu GitHubiin. Workflow-triggeröinti ei onnistunut – sivusto päivittyy silti seuraavassa automaattihaussa.");
      }
    } catch (e: any) {
      toast.error(`Julkaisu epäonnistui: ${e.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

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

  const addSponsor = () => {
    const newSponsor: Sponsor = {
      id: content.sponsors.length > 0 ? Math.max(...content.sponsors.map((s) => s.id)) + 1 : 1,
      imageUrl: "",
      linkUrl: "",
    };
    setContent((prev) => ({ ...prev, sponsors: [...prev.sponsors, newSponsor] }));
    toast.success("Sponsori lisätty");
  };

  const updateSponsor = (id: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      sponsors: prev.sponsors.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const removeSponsor = (id: number) => {
    setContent((prev) => ({ ...prev, sponsors: prev.sponsors.filter((s) => s.id !== id) }));
    toast.info("Sponsori poistettu");
  };

  const tabs = [
    { key: "hero" as const, label: "Hero" },
    { key: "episodes" as const, label: `Jaksot (${content.episodes.length})` },
    { key: "links" as const, label: "Linkit" },
    { key: "sponsors" as const, label: `Sponsorit (${content.sponsors.length})` },
    { key: "footer" as const, label: "Footer" },
    { key: "settings" as const, label: "⚙️" },
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
          <div className="flex items-center gap-2 flex-1 min-w-0">
              <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Vapaaehtoinen viesti (commit message)..."
                className="text-sm h-9"
              />
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => { handlePublish(); setCommitMessage(""); }}
              disabled={isPublishing}
            >
              <Rocket size={14} /> {isPublishing ? "Julkaistaan..." : "Julkaise"}
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
            <FieldInput label="Hero-kuvan URL" value={content.hero.imageUrl || ""} onChange={(v) => updateHero("imageUrl", v)} placeholder="https://..." />
            {content.hero.imageUrl && (
              <div className="rounded-lg bg-secondary/50 p-3 flex items-center justify-center">
                <img src={content.hero.imageUrl} alt="Hero-esikatselu" className="max-h-32 object-contain rounded" />
              </div>
            )}
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
                    <FieldTextarea label="Runo" value={ep.poem || ""} onChange={(v) => updateEpisode(ep.id, "poem", v)} />
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

        {/* Sponsors editor */}
        {activeTab === "sponsors" && (
          <div className="space-y-3">
            <Button onClick={addSponsor} className="gap-2 w-full">
              <Plus size={16} /> Lisää sponsori
            </Button>
            {content.sponsors.map((sponsor, i) => (
              <div key={sponsor.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-primary">Sponsori #{i + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeSponsor(sponsor.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <FieldInput label="Logo URL (kuva)" value={sponsor.imageUrl} onChange={(v) => updateSponsor(sponsor.id, "imageUrl", v)} placeholder="https://..." />
                <FieldInput label="Linkki URL" value={sponsor.linkUrl} onChange={(v) => updateSponsor(sponsor.id, "linkUrl", v)} placeholder="https://..." />
                {sponsor.imageUrl && (
                  <div className="rounded-lg bg-secondary/50 p-3 flex items-center justify-center">
                    <img src={sponsor.imageUrl} alt={`Sponsori ${i + 1}`} className="max-h-12 object-contain" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer editor */}
        {activeTab === "footer" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Footer</h2>
            <FieldInput label="Copyright" value={content.footer.copyright} onChange={(v) => updateFooter("copyright", v)} />
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">GitHub-asetukset</h2>
            <p className="text-sm text-muted-foreground">
              Syötä GitHub-tiedot, jotta Julkaise-nappi voi käynnistää sivuston päivityksen.
              Tarvitset Personal Access Tokenin (PAT) jolla on <code>repo</code>-oikeus.
            </p>
            <FieldInput label="Omistaja (owner)" value={ghOwner} onChange={setGhOwner} placeholder="esim. käyttäjänimi" />
            <FieldInput label="Repo" value={ghRepo} onChange={setGhRepo} placeholder="esim. bangeri-podcast" />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">GitHub Token (PAT)</Label>
              <Input
                type="password"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                placeholder="ghp_..."
              />
            </div>
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
