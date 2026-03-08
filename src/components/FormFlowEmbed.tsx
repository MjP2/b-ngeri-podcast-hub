import { useEffect, useRef, useState } from "react";
import { MessageSquare, ChevronDown } from "lucide-react";

interface FormFlowEmbedProps {
  formId: string;
}

const FormFlowEmbed = ({ formId }: FormFlowEmbedProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (open && !scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.src = "https://myformflow.io/embed/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [open]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-secondary/50"
      >
        <span className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <MessageSquare className="h-4 w-4 text-primary" />
          Lähetä palautetta
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "600px" : "0", opacity: open ? 1 : 0 }}
      >
        <div ref={containerRef} className="px-5 pb-5">
          <div id="formflow-embed" data-form-id={formId} />
        </div>
      </div>
    </div>
  );
};

export default FormFlowEmbed;
