"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

interface LeadFormProps {
  locale: Locale;
  carId?: string;
  displayTitle?: string;
  stockNumber?: string;
}

export function LeadForm({
  locale,
  carId,
  displayTitle,
  stockNumber,
}: LeadFormProps) {
  const dict = getDictionary(locale);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    website: "", // Honeypot
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const currentUrl = typeof window !== "undefined" ? window.location.href : "";

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          carId,
          displayTitle,
          stockNumber,
          carUrl: currentUrl,
          locale,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "", website: "" });
        trackEvent("lead_submit", { stockNumber, displayTitle });
      } else {
        setStatus("error");
        setErrorMessage(data.error || dict.leadForm.error);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(dict.leadForm.error);
    }
  };

  const isRtl = locale === "ar";

  return (
    <div className="bg-transparent">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide">
          {isRtl ? "طلب استفسار" : "DEMANDER UNE INFORMATION"}
        </h3>
        <p className="font-label-caps text-xs text-brand-muted mt-1">
          {isRtl ? "سيتواصل معك فريقنا في أقرب وقت ممكن." : "Notre équipe vous recontacte dans les plus brefs délais."}
        </p>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/30 p-8 text-center text-emerald-400">
          <CheckCircle className="h-8 w-8 mb-2" strokeWidth={1.5} />
          <p className="text-xs font-bold font-label-caps">{dict.leadForm.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Spam Protection Field */}
          <div className="opacity-0 absolute -z-10 h-0 w-0 overflow-hidden pointer-events-none">
            <label htmlFor="website">Leave this field blank</label>
            <input
              id="website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* Row 1: Name & Phone (2 columns on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-[10px] text-brand-subtle mb-1">
                {dict.leadForm.nameLabel} *
              </label>
              <input
                type="text"
                required
                placeholder={dict.leadForm.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 w-full rounded-md border border-white/10 bg-[#05080D] py-2 px-3.5 text-xs text-white placeholder-brand-subtle focus:border-brand-blue outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] text-brand-subtle mb-1">
                {dict.leadForm.phoneLabel} *
              </label>
              <input
                type="tel"
                required
                placeholder={dict.leadForm.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-11 w-full rounded-md border border-white/10 bg-[#05080D] py-2 px-3.5 text-xs text-white placeholder-brand-subtle focus:border-brand-blue outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Email (optional) */}
          <div>
            <label className="block font-label-caps text-[10px] text-brand-subtle mb-1">
              {dict.leadForm.emailLabel}
            </label>
            <input
              type="email"
              placeholder={dict.leadForm.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-11 w-full rounded-md border border-white/10 bg-[#05080D] py-2 px-3.5 text-xs text-white placeholder-brand-subtle focus:border-brand-blue outline-none transition-colors"
            />
          </div>

          {/* Row 3: Message (optional) */}
          <div>
            <label className="block font-label-caps text-[10px] text-brand-subtle mb-1">
              {dict.leadForm.messageLabel}
            </label>
            <textarea
              rows={3}
              placeholder={dict.leadForm.messagePlaceholder}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-[#05080D] p-3.5 text-xs text-white placeholder-brand-subtle focus:border-brand-blue outline-none transition-colors"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-md bg-rose-500/10 border border-rose-500/30 p-3 font-label-caps text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-stitch-primary h-11 px-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-label-caps tracking-wider uppercase disabled:opacity-50 group"
            >
              <span>
                {status === "submitting"
                  ? dict.leadForm.submitting
                  : isRtl
                  ? "إرسال الطلب ←"
                  : "ENVOYER MA DEMANDE →"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

