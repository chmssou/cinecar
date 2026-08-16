import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({
  projectId: projectId || "demo_project_id",
  dataset: dataset || "production",
});

export const urlFor = (source: any) => {
  if (!source) {
    return {
      width: () => ({ height: () => ({ fit: () => ({ quality: () => ({ url: () => "/placeholder-car.jpg" }) }), url: () => "/placeholder-car.jpg" }), url: () => "/placeholder-car.jpg" }),
      height: () => ({ fit: () => ({ quality: () => ({ url: () => "/placeholder-car.jpg" }) }), url: () => "/placeholder-car.jpg" }),
      fit: () => ({ quality: () => ({ url: () => "/placeholder-car.jpg" }), url: () => "/placeholder-car.jpg" }),
      quality: () => ({ url: () => "/placeholder-car.jpg" }),
      url: () => "/placeholder-car.jpg",
    };
  }

  // Handle direct string URLs or asset objects with url property
  const directUrl = typeof source === "string" ? source : source?.asset?.url || source?.url;

  if (typeof directUrl === "string" && directUrl.startsWith("http")) {
    const mockChain: any = {
      width: () => mockChain,
      height: () => mockChain,
      fit: () => mockChain,
      quality: () => mockChain,
      url: () => directUrl,
    };
    return mockChain;
  }

  try {
    return builder.image(source);
  } catch {
    const mockChain: any = {
      width: () => mockChain,
      height: () => mockChain,
      fit: () => mockChain,
      quality: () => mockChain,
      url: () => "/placeholder-car.jpg",
    };
    return mockChain;
  }
};
