import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "../env";

// Use a demo-safe valid project ID for placeholder (only lowercase letters, numbers, dashes)
const safeProjectId = projectId && /^[a-z0-9-]+$/.test(projectId) ? projectId : "demoproject";

export const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});
