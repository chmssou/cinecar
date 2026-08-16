import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kmzomlg7";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SINGLETON_TYPES = new Set(["siteSettings"]);
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "dealership_studio",
  title: "CINECAR Dealership Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  schema: {
    types: schema.types,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
    newDocumentOptions: (input, { creationContext }) => {
      if (creationContext.type === "global") {
        return input.filter((item) => !SINGLETON_TYPES.has(item.templateId));
      }
      return input;
    },
  },
});
