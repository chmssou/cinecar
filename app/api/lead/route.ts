import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  website: z.string().optional(), // Honeypot field
  carId: z.string().optional(),
  displayTitle: z.string().optional(),
  stockNumber: z.string().optional(),
  carUrl: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = leadSchema.parse(body);

    // 1. Honeypot Spam Check
    if (validated.website && validated.website.trim() !== "") {
      // Quietly reject bot submissions
      return NextResponse.json(
        { success: false, message: "Spam detected" },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      email,
      message,
      displayTitle = "General Inquiry",
      stockNumber = "N/A",
      carUrl = "",
      locale = "ar",
    } = validated;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.LEAD_DESTINATION_EMAIL || "leads@dealership.dz";

    if (!apiKey || apiKey.startsWith("re_demo")) {
      console.log("[Lead API Mocked Log]", {
        name,
        phone,
        email,
        message,
        displayTitle,
        stockNumber,
        carUrl,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        message: "Inquiry received successfully (demo mode)",
      });
    }

    const resend = new Resend(apiKey);
    const subject = `New Inquiry — ${displayTitle} [${stockNumber}]`;

    const htmlBody = `
      <h2>New Lead Submission</h2>
      <p><strong>Vehicle:</strong> ${displayTitle} (${stockNumber})</p>
      <p><strong>Vehicle Link:</strong> <a href="${carUrl}">${carUrl}</a></p>
      <hr />
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
      ${message ? `<p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
      <hr />
      <p><small>Submitted at ${new Date().toISOString()} (${locale})</small></p>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, message: "Lead submitted successfully" });
  } catch (err: any) {
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Invalid input" },
      { status: 400 }
    );
  }
}
