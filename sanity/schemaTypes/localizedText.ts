import { defineType, defineField } from "sanity";

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "Arabic (العربية)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "fr",
      title: "French (Français)",
      type: "text",
      rows: 4,
    }),
  ],
});
