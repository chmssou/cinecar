"use client";

import { NextStudio } from "next-sanity/studio";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import config from "@/sanity.config";

function shouldForwardProp(propName: string, target: any) {
  if (propName === "disableTransition") {
    return false;
  }
  return typeof target === "string" ? isPropValid(propName) : true;
}

export default function StudioPage() {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <NextStudio config={config} />
    </StyleSheetManager>
  );
}
