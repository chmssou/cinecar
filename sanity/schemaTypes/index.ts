import { type SchemaTypeDefinition } from "sanity";
import { brand } from "./brand";
import { carModel } from "./carModel";
import { car } from "./car";
import { siteSettings } from "./siteSettings";
import { localizedString } from "./localizedString";
import { localizedText } from "./localizedText";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localizedString, localizedText, brand, carModel, car, siteSettings],
};
