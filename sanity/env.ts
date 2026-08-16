export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Sanity projectId must only contain a-z, 0-9, and dashes
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kmzomlg7";
export const projectId = /^[a-z0-9-]+$/.test(rawProjectId) ? rawProjectId : "kmzomlg7";

export const useCdn = false;
