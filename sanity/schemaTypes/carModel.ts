import { defineType, defineField } from "sanity";
import { Layers } from "lucide-react";

export const carModel = defineType({
  name: "carModel",
  title: "Car Model",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "name",
      title: "Model Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      brandName: "brand.name",
    },
    prepare({ title, brandName }) {
      return {
        title,
        subtitle: brandName ? `Brand: ${brandName}` : "No brand assigned",
      };
    },
  },
});
