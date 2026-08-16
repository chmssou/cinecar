import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const { isValidSignature, body } = await parseBody<{
      _id?: string;
      _type?: string;
      slug?: { current?: string } | string;
    }>(request, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    if (!body || !body._type) {
      return NextResponse.json(
        { message: "Malformed webhook payload" },
        { status: 400 }
      );
    }

    const { _type, slug } = body;
    const slugString = typeof slug === "string" ? slug : slug?.current;

    switch (_type) {
      case "car":
        revalidateTag("cars");
        revalidateTag("featured-cars");
        if (slugString) {
          revalidateTag(`car-slug:${slugString}`);
        }
        break;

      case "brand":
        revalidateTag("brands");
        revalidateTag("cars");
        break;

      case "carModel":
        revalidateTag("models");
        revalidateTag("cars");
        break;

      case "siteSettings":
        revalidateTag("site-settings");
        break;

      default:
        revalidateTag("cars");
        revalidateTag("site-settings");
        break;
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slugString,
    });
  } catch (err: any) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
