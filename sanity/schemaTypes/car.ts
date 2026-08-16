import { defineType, defineField } from "sanity";
import { Car } from "lucide-react";

export const car = defineType({
  name: "car",
  title: "Car",
  type: "document",
  icon: Car,
  fields: [
    // 1. Vehicle Name
    defineField({
      name: "vehicleName",
      title: "Vehicle Name (Nom du Véhicule)",
      type: "string",
      description: "Ex: Peugeot 301 Pack M, BMW M4 Competition xDrive, Audi RS E-Tron GT",
      validation: (Rule) => Rule.required().error("Vehicle Name is required"),
    }),

    // 2. Brand
    defineField({
      name: "brand",
      title: "Brand (Marque)",
      type: "string",
      description: "Ex: Peugeot, BMW, Audi, Mercedes-Benz, Porsche, Dacia",
      validation: (Rule) => Rule.required().error("Brand is required"),
    }),

    // 3. Model
    defineField({
      name: "model",
      title: "Model (Modèle)",
      type: "string",
      description: "Ex: 301, M4, A3, G-Class, 911, Sandero",
      validation: (Rule) => Rule.required().error("Model is required"),
    }),

    // 4. Trim
    defineField({
      name: "trim",
      title: "Trim / Finish (Finition - Optionnel)",
      type: "string",
      description: "Ex: Pack M, GT Line, AMG Line, Weissach Package",
    }),

    // 5. Vehicle Type
    defineField({
      name: "vehicleType",
      title: "Vehicle Type (Type de Véhicule)",
      type: "string",
      options: {
        list: [
          { title: "Sedan (Berline)", value: "sedan" },
          { title: "Hatchback (Compacte)", value: "hatchback" },
          { title: "SUV / 4x4", value: "suv" },
          { title: "Coupe (Coupé)", value: "coupe" },
          { title: "Convertible (Cabriolet)", value: "convertible" },
          { title: "Van / Utility", value: "van" },
          { title: "Pickup", value: "pickup" },
          { title: "Other (Autre)", value: "other" },
        ],
      },
    }),

    // 6. Year
    defineField({
      name: "year",
      title: "Year (Année)",
      type: "number",
      description: "Ex: 2015, 2024",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1900)
          .max(2100)
          .error("Year is required (e.g. 2015)"),
    }),

    // 7. Mileage
    defineField({
      name: "mileage",
      title: "Mileage (Kilométrage en KM)",
      type: "number",
      description: "Ex: 161000 (enter number only)",
      validation: (Rule) => Rule.min(0).error("Mileage cannot be negative"),
    }),

    // 8. Fuel
    defineField({
      name: "fuel",
      title: "Fuel (Carburant)",
      type: "string",
      options: {
        list: [
          { title: "Petrol / Gasoline (Essence)", value: "gasoline" },
          { title: "Diesel (Gazoil)", value: "diesel" },
          { title: "Electric (100% Électrique)", value: "electric" },
          { title: "Hybrid (Hybride)", value: "hybrid" },
          { title: "Plug-in Hybrid", value: "plug_in_hybrid" },
          { title: "LPG (GPL)", value: "lpg" },
          { title: "Other (Autre)", value: "other" },
        ],
      },
    }),

    // 9. Transmission
    defineField({
      name: "transmission",
      title: "Transmission (Boîte de vitesse)",
      type: "string",
      options: {
        list: [
          { title: "Manual (Manuelle)", value: "manual" },
          { title: "Automatic (Automatique)", value: "automatic" },
          { title: "Other (Autre)", value: "other" },
        ],
      },
    }),

    // 10. Price
    defineField({
      name: "price",
      title: "Price (Prix de Vente en DZD)",
      type: "number",
      description: "Ex: 2900000 (enter number only)",
      validation: (Rule) =>
        Rule.required().min(0).error("Price is required (e.g. 2900000)"),
    }),

    // 11. Status
    defineField({
      name: "salesStatus",
      title: "Status (Statut de Disponibilité)",
      type: "string",
      options: {
        list: [
          { title: "AVAILABLE (Disponible)", value: "available" },
          { title: "NOT AVAILABLE (Non disponible)", value: "not_available" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (Rule) => Rule.required().error("Status is required"),
    }),

    // 12. Photos
    defineField({
      name: "images",
      title: "Photos (Photos du Véhicule)",
      type: "array",
      description: "Upload main photo first, then additional photos (up to 20 images)",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).max(20).error("Please upload at least 1 main photo"),
    }),

    // 13. Description
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      description: "Simple multiline vehicle description",
    }),

    // 14. Video URL
    defineField({
      name: "videoUrl",
      title: "Vehicle Video Link (Optionnel - YouTube / Vimeo)",
      type: "url",
      description: "Ex: https://www.youtube.com/watch?v=...",
    }),

    // ============================================================
    // AUTOMATIC / INTERNAL FIELDS (Managed behind the scenes)
    // ============================================================
    defineField({
      name: "slug",
      title: "URL Slug (Automatic / Modifiable)",
      type: "slug",
      options: {
        source: (doc) => {
          const name = (doc.vehicleName as string) || `${doc.brand || ""} ${doc.model || ""} ${doc.year || ""}`;
          return name.trim();
        },
        maxLength: 96,
      },
    }),
    defineField({
      name: "stockNumber",
      title: "Stock Number (Code Stock)",
      type: "string",
      description: "Identifiant unique pour chaque véhicule du stock",
      initialValue: () => `CINE-${Math.floor(1000 + Math.random() * 9000)}`,
      validation: (Rule) =>
        Rule.custom(async (stockNumber, context) => {
          if (!stockNumber) return true;
          const client = context.getClient({ apiVersion: "2026-08-13" });
          const id = context.document?._id.replace(/^drafts\./, "") || "";
          const count = await client.fetch(
            `count(*[_type == "car" && stockNumber == $stockNumber && !(_id in [$id, $draftId])])`,
            { stockNumber, id, draftId: `drafts.${id}` }
          );
          return count === 0 ? true : "Stock Number must be unique across all vehicles";
        }),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      hidden: true,
      initialValue: "DZD",
    }),
    defineField({
      name: "showPrice",
      title: "Show Price",
      type: "boolean",
      hidden: true,
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      hidden: true,
      initialValue: false,
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      hidden: true,
      initialValue: 100,
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      hidden: true,
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      vehicleName: "vehicleName",
      brand: "brand",
      model: "model",
      year: "year",
      price: "price",
      salesStatus: "salesStatus",
      media: "images.0",
    },
    prepare({ vehicleName, brand, model, year, price, salesStatus, media }) {
      const brandStr = typeof brand === "string" ? brand : (typeof brand?.name === "string" ? brand.name : "");
      const modelStr = typeof model === "string" ? model : (typeof model?.name === "string" ? model.name : "");
      const title = vehicleName || [brandStr, modelStr, year].filter(Boolean).join(" ") || "New Car";
      const statusLabel = salesStatus === "not_available" ? "NOT AVAILABLE" : "AVAILABLE";
      const formattedPrice = price ? `${new Intl.NumberFormat("fr-FR").format(price)} DZD` : "No price";
      return {
        title,
        subtitle: `${formattedPrice} | ${statusLabel}`,
        media,
      };
    },
  },
});
