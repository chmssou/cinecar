import { defineType, defineField } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "Arabic (العربية)",
      type: "string",
    }),
    defineField({
      name: "fr",
      title: "French (Français)",
      type: "string",
    }),
  ],
});
