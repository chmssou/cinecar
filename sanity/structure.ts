import type { StructureResolver } from "sanity/structure";
import { Settings, Car, CheckCircle2, XCircle, List } from "lucide-react";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("CINECAR Dealership Studio")
    .items([
      // 1. CARS SECTION
      S.listItem()
        .title("CARS")
        .icon(Car)
        .child(
          S.list()
            .title("CARS")
            .items([
              S.listItem()
                .title("ALL")
                .icon(List)
                .child(
                  S.documentList()
                    .title("ALL CARS")
                    .filter('_type == "car"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("AVAILABLE")
                .icon(CheckCircle2)
                .child(
                  S.documentList()
                    .title("AVAILABLE CARS")
                    .filter('_type == "car" && salesStatus == "available" && archived != true')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("NOT AVAILABLE")
                .icon(XCircle)
                .child(
                  S.documentList()
                    .title("NOT AVAILABLE CARS")
                    .filter(
                      '_type == "car" && (salesStatus == "not_available" || salesStatus == "sold" || salesStatus == "reserved" || archived == true)'
                    )
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
            ])
        ),

      S.divider(),

      // 2. SITE SETTINGS
      S.listItem()
        .title("SITE SETTINGS")
        .id("siteSettings")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("SITE SETTINGS")
        ),
    ]);
