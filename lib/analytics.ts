export type EventName =
  | "car_view"
  | "whatsapp_click"
  | "phone_click"
  | "lead_submit"
  | "gallery_open"
  | "video_play"
  | "filter_applied"
  | "share_click"
  | "social_click";

export function trackEvent(name: EventName, payload?: Record<string, any>): void {
  try {
    if (typeof window !== "undefined") {
      // Custom event dispatch for optional GTM / GA / Custom Analytics integration
      window.dispatchEvent(
        new CustomEvent("app_analytics_event", {
          detail: { name, payload, timestamp: new Date().toISOString() },
        })
      );
      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${name}:`, payload);
      }
    }
  } catch (err) {
    // Fail silently in production
  }
}
