import { useEffect, useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";

interface FormFlowEmbedProps {
  formId: string;
}

const FormFlowEmbed = ({ formId }: FormFlowEmbedProps) => {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formReady, setFormReady] = useState(false);

  const handleOpen = () => {
    setFormReady(false);
    setFormKey((k) => k + 1);
    setOpen(true);
  };

  // Load/reload the FormFlow script each time the form container remounts
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      document.querySelectorAll('script[src*="myformflow.io"]').forEach((s) => s.remove());

      const script = document.createElement("script");
      script.src = "https://myformflow.io/embed/widget.js";
      script.async = true;

      script.onload = () => {
        // Wait for widget to render, then fade in
        setTimeout(() => setFormReady(true), 500);
      };

      document.body.appendChild(script);
    }, 50);

    return () => clearTimeout(timer);
  }, [open, formKey]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="group flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-4 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover-scale"
      >
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold text-foreground">
          Lähetä palautetta
        </span>
      </button>

      {/* Backdrop + Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      >
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Modal */}
        <div
          className={`relative z-10 w-full max-w-xl mx-4 sm:mx-auto rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <MessageSquare className="h-4 w-4 text-primary" />
              Lähetä palautetta
            </span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form content with fade-in */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div
              className={`transition-all duration-300 ${formReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}
            >
              <div key={formKey} id="formflow-embed" data-form-id={formId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormFlowEmbed;
