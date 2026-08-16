# CINECAR — COMPLETE PROJECT HANDOFF

> **IMPORTANT NOTICE FOR FUTURE AI DEVELOPERS / GEMINI:**  
> This document contains a **COMPLETE, FULL-SCOPE INSPECTION AND DOCUMENTATION** of the existing CINECAR digital platform codebase and running local application.  
> **DO NOT MODIFY**, **DO NOT REDESIGN**, **DO NOT REFACTOR**, and **DO NOT DELETE** any core architecture without reviewing the explicit guidelines and risk analysis maps provided in this document.

---

## 1. EXECUTIVE SUMMARY

**CINECAR** is a high-end luxury automotive showcase and vehicle importation platform built specifically for the Algerian market. It features a bilingual interface (**French [LTR]** and **Arabic [RTL]**), editorial-grade cinematic photography, seamless WhatsApp lead generation, and dynamic CMS management powered by **Sanity Studio v3**.

* **Project Name**: `cares` (Commercial name: **CineCar CAR SALES**)
* **Version**: `0.1.0`
* **Local Development Host**: `http://localhost:3000` (or `http://localhost:3001`)
* **Primary Target Audience**: Luxury car buyers and automotive importers in Algeria.
* **Core Technological Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v3, Sanity v3, Lucide React, Embla Carousel, Zod, and Resend.

---

## 2. PROJECT ARCHITECTURE

### 2.1 Framework & Core Tooling

| Core Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `^15.1.7` | Framework (App Router with dynamic localized routing) |
| **React** | `^19.0.0` | UI rendering engine |
| **TypeScript** | `^5.7.3` | Type-safe application logic |
| **Tailwind CSS** | `^3.4.17` | Utility-first styling & theme token extension |
| **Sanity Studio** | `^3.77.0` | Headless Content Management System (CMS) |
| **next-sanity** | `^9.8.5` | Client utilities & revalidation webhooks for Sanity |
| **Embla Carousel** | `^8.5.2` | Vehicle gallery slideshow & lightbox controls |
| **Zod** | `^3.24.2` | Schema validation for lead form inputs |
| **Resend** | `^4.1.2` | Transactional email delivery service for leads |

### 2.2 Directory Structure Map

```
b:\CARES
├── app/
│   ├── (site)/
│   │   └── [locale]/
│   │       ├── cars/
│   │       │   ├── [slug]/
│   │       │   │   └── page.tsx        # Vehicle Detail Page
│   │       │   └── page.tsx            # Full Inventory Showcase & Filtering
│   │       ├── layout.tsx              # Localized Root Shell (Navbar, Footer, Global Controls)
│   │       └── page.tsx                # Homepage (Hero, Selection, Contact/Lead Form)
│   ├── (studio)/
│   │   └── studio/
│   │       └── [[...index]]/page.tsx   # Sanity Studio CMS Embedded Route (/studio)
│   ├── api/
│   │   ├── lead/route.ts               # Lead Form Submission API Endpoint
│   │   └── revalidate/route.ts         # Sanity Webhook On-Demand Revalidation API
│   ├── globals.css                     # Global Theme CSS Tokens & Custom Animations
│   ├── layout.tsx                      # Root Next.js Layout & Font Definitions
│   ├── middleware.ts                   # Language Detection & Root Redirect Middleware
│   ├── not-found.tsx                   # Localized 404 Page
│   ├── robots.ts                       # SEO Robots Directive Generator
│   └── sitemap.ts                      # Dynamic XML Sitemap Generator
├── components/
│   ├── CarCard.tsx                     # Editorial Vehicle Card Component
│   ├── CarFilters.tsx                  # Advanced Inventory Filter & Search Bar
│   ├── Footer.tsx                      # Global Footer Component
│   ├── Gallery.tsx                     # High-Resolution Carousel & Fullscreen Lightbox
│   ├── GlobalControls.tsx              # Desktop Fixed Social & WhatsApp Dock
│   ├── LeadForm.tsx                    # Two-Column Contact Form with Honeypot Protection
│   ├── Navbar.tsx                      # Header Navbar & Mobile Navigation Drawer
│   ├── Pagination.tsx                  # Server-Side Inventory Pagination Controls
│   ├── StickyMobileContact.tsx         # Mobile Fixed Bottom Action Bar (WhatsApp + Call)
│   └── VideoPlayer.tsx                 # Video Preview Component (YouTube/Vimeo Embed)
├── lib/
│   ├── analytics.ts                    # Google Tag / Custom Event Analytics Wrapper
│   ├── i18n.ts                         # Bilingual Dictionaries (AR/FR) & Formatting Rules
│   ├── social.ts                       # Dynamic Social & Phone Link Resolvers
│   └── whatsapp.ts                     # Pre-filled WhatsApp Link Generator
├── public/
│   └── brand/
│       ├── cinecar-logo.png            # Official CINECAR Logo (Primary Active Asset)
│       └── cinecar-logo-black.png      # Alternative Black Variant Logo
├── sanity/
│   ├── lib/
│   │   ├── client.ts                   # Sanity Client Configuration
│   │   ├── fetch.ts                    # Sanity Queries Fetcher & Fallback Demo Cars
│   │   ├── image.ts                    # Sanity CDN Image URL Builder (`urlFor`)
│   │   └── queries.ts                  # GROQ Database Queries & Projections
│   ├── schemaTypes/
│   │   ├── brand.ts                    # Vehicle Brand Schema
│   │   ├── car.ts                      # Comprehensive Vehicle Document Schema
│   │   ├── carModel.ts                 # Vehicle Model Schema
│   │   ├── siteSettings.ts             # Global Site Settings Schema
│   │   ├── localizedString.ts          # Bilingual String Schema (ar/fr)
│   │   └── localizedText.ts            # Bilingual Multiline Text Schema (ar/fr)
│   ├── env.ts                          # Sanity API Environment Variable Validations
│   └── structure.ts                # Sanity Desk Structure Customization
├── middleware.ts                       # Middleware matching root `/`
├── next.config.ts                      # Next.js Server Configuration & Remote Image Domain Rules
├── tailwind.config.ts                  # Custom Automotive Theme Color & Font Configuration
└── package.json                        # Dependency Manifest
```

### 2.3 Key Operational File Explanations

1. **`middleware.ts`**: Intercepts requests to `/`. Checks for a `NEXT_LOCALE` cookie (values: `ar` or `fr`) or parses `Accept-Language` headers to automatically redirect users to `/[locale]`.
2. **`app/layout.tsx`**: Defines Google Fonts (`Barlow Condensed`, `Manrope`, `Noto Kufi Arabic`, `IBM Plex Sans Arabic`), injects Tailwind global styles, and wraps the application.
3. **`app/(site)/[locale]/layout.tsx`**: Loads site settings from Sanity, determines text direction (`rtl` for `ar`, `ltr` for `fr`), and renders `Navbar`, page content, `GlobalControls`, and `Footer`.
4. **`sanity/lib/fetch.ts`**: Central data fetcher. Executes GROQ queries against Sanity CDN. **Crucial Feature**: If Sanity credentials are missing or the database returns no vehicles, it seamlessly serves fallback `DEMO_CARS` data (containing 5 luxury vehicles: Porsche 911 GT3 RS, Audi RS e-tron GT, Mercedes-AMG G63, BMW M4 Competition, and Range Rover Sport).
5. **`lib/i18n.ts`**: Contains complete translations for all static UI elements, filters, vehicle specifications, status tags, features, and form field placeholders for both Arabic and French. Also provides `formatPrice()` and `formatNumber()`.

---

## 3. PAGE INVENTORY

| Route | Page Name | Purpose | Primary Components | Data Source | Responsive & Nav Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Root Entry | Redirects to default locale (`/ar` or `/fr`) via middleware based on cookie/header | `middleware.ts` | Request Cookie / Header | Instant Server Redirect |
| `/[locale]` | **Homepage** | Primary landing experience showcasing brand identity, 3 selected vehicles, contact info & lead form | `Navbar`, `CarCard`, `LeadForm`, `StickyMobileContact`, `Footer` | Sanity (`siteSettings`, `getLatestCars(6)`) or `DEMO_CARS` | Hero zooms dynamically; grid converts to 1 column on mobile |
| `/[locale]/cars` | **Inventory Page** | Full vehicle catalogue with multi-criteria filtering, sorting, and pagination | `CarFilters`, `CarCard`, `Pagination`, `StickyMobileContact` | Sanity `getCars(filters)` / `getBrands()` / `getModels()` | Desktop strip filters; mobile opens fullscreen drawer sheet |
| `/[locale]/cars/[slug]` | **Vehicle Detail Page** | Comprehensive vehicle showcase with image gallery, specs, description, features, and related cars | `Gallery`, `CarCard`, `VideoPlayer`, `StickyMobileContact` | Sanity `getCarBySlug(slug)` & `getSimilarCars()` | Breadcrumbs at top; gallery with embla carousel & fullscreen modal |
| `/studio` | **Sanity Studio** | Embedded CMS dashboard for managing inventory, brands, models, and site settings | Sanity Studio Component | Sanity Project API | Desktop-optimized admin interface |
| `/api/lead` | Lead API | Handles form submissions with Zod validation, honeypot anti-spam check, and Resend email dispatch | `route.ts` | POST Request Payload | Server API Route |
| `/api/revalidate` | Webhook API | Listens to Sanity webhooks to invalidate Next.js tags (`cars`, `site-settings`, `brands`, etc.) | `route.ts` | Sanity Webhook POST | On-demand cache invalidation |

---

## 4. HOMEPAGE VISUAL ANALYSIS

Visual inspection of the live running localhost application reveals the following structured layout:

### 4.1 Header & Navigation
* **Logo**: Displays `/brand/cinecar-logo.png` on the far left (LTR) / right (RTL), rendering the official white and electric blue "CINECAR CAR SALES" emblem (height: 32px to 40px).
* **Navigation Links**: Minimal, uppercase tracking navigation links: `ACCUEIL`, `INVENTAIRE`, `CONTACT`.
* **Desktop Behavior**: Sits transparently over the hero image when scrolled to top; transitions smoothly to a dark glassmorphic background (`bg-[#05080D]/95`) with `backdrop-blur-md` upon scrolling > 60px down.
* **Mobile Drawer**: Replaces desktop links with a square icon button (`Menu`/`X`). Toggling opens a dark side drawer containing branded links, a direct "Appeler" phone button, social links (WhatsApp, Instagram, Facebook, TikTok), and a language switcher (`Français (FR)` / `العربية (AR)`).

### 4.2 Hero Section
* **Dimensions**: Occupies `92vh` on desktop and `80vh` on mobile viewports.
* **Visuals**: High-resolution photography background (Porsche 911 GT3 RS in mountain snow landscape) with continuous top-to-bottom and side-to-side gradient overlays (`from-black/60 via-transparent to-[#05080D]`).
* **Typography**:
  * Badge: `CINECAR CAR SALES` in electric blue uppercase caps tracking (`font-label-caps`).
  * Main Headline: `AUTOMOBILES D'EXCEPTION.` / `سيارات فاخرة واستثنائية.` in bold `Barlow Condensed` / `Noto Kufi Arabic` typography.
  * Subtitle: `Une sélection rigoureuse d'automobiles de prestige et d'importation dédiée.` in muted grey.
* **CTA Link**: `VOIR TOUT L'INVENTAIRE →` underlined link leading directly to `/[locale]/cars`.

### 4.3 Vehicle Selection Grid
* **Header**: Section label `SÉLECTION` + main title `DERNIÈRES ARRIVÉES`.
* **Tile Count**: Strictly limited to **3 vehicles** on the homepage (`latestCars.slice(0, 3)`).
* **Grid Layout**: 3 equal columns on desktop (`lg:grid-cols-3`), 2 columns on tablet (`sm:grid-cols-2`), 1 single column on mobile (`grid-cols-1`).
* **Card Details**: Shows primary image (3:2 aspect ratio), status tag (`DISPONIBLE` in emerald green), stock number (`#MA-911`), title, formatted price (`38 500 000 DA`), quick specs line (`2024 · 4 200 KM · AUTOMATIQUE`), and `VOIR LE VÉHICULE →` action link.

### 4.4 Editorial Contact & Lead Section (`#contact`)
* **Two-Column Split**:
  * **Left Column (40%)**: Editorial header ("PARLONS DE VOTRE PROCHAIN VÉHICULE"), showroom address (Alger, Algérie), phone number (+213 550 12 34 56), WhatsApp number, and live business hours indicator with pulsing green status dot ("OUVERT AUJOURD'HUI · JUSQU'À 18:00").
  * **Right Column (60%)**: `LeadForm` component featuring borderless dark input fields for Name, Phone, Email, Message, and a prominent blue submit CTA button.

---

## 5. VEHICLE DETAIL PAGE HIERARCHY

Inspecting `/[locale]/cars/[slug]` (e.g. Porsche 911 GT3 RS) reveals the exact top-to-bottom layout structure:

1. **Breadcrumb Bar**: `ACCUEIL > INVENTAIRE > PORSCHE 911 GT3 RS`.
2. **Vehicle Identity Header**:
   * Brand badge (`PORSCHE` in tracking electric blue).
   * Main title (`PORSCHE 911 GT3 RS` in 5xl bold display font).
   * Secondary spec line (`2024 · 4 200 KM · AUTOMATIQUE`).
   * Price & Status Block (Right aligned on desktop): Large price text (`38 500 000 DA`), previous price strike-through (if present), availability status (`DISPONIBLE`), stock number (`#MA-911`).
3. **Primary Vehicle Gallery**:
   * Main viewport in 16:9 aspect ratio powered by Embla Carousel.
   * Floating overlay ribbon displaying image counter (`1 / 2`) and `FULLSCREEN` modal trigger button.
   * Horizontal thumbnail strip below the main image.
4. **Key Specification Strip**: 4 equal columns bounded by top/bottom borders and thin vertical dividers:
   * **YEAR**: `2024`
   * **KILOMÉTRAGE**: `4 200 km`
   * **CARBURANT**: `Essence`
   * **TRANSMISSION**: `Automatique`
5. **Editorial Description**: Multi-line vehicle overview text rendered with `whitespace-pre-line`.
6. **Detailed Specifications Grid**: 2-column list of all technical data (Brand, Model, Trim, Year, Mileage, Fuel, Transmission, Engine, Capacity, Power, Drivetrain, Exterior Color, Interior Color, Doors, Seats, Condition, Origin, Registration Status).
7. **Features & Equipment Grid**: 3-column checkmark list of equipment (Panoramic roof, 360 camera, Apple CarPlay, etc.).
8. **Video Presentation**: Embedded Mux / YouTube player container (rendered if `videoUrl` is set).
9. **Recommended Vehicles Section**: "SÉLECTION RECOMMANDÉE" grid displaying up to 4 similar vehicles.
10. **Sticky Mobile Contact Actions**: Fixed bottom bar with `WhatsApp` and `Appeler` buttons.

> ℹ️ **DOCUMENTED INFORMATION DUPLICATION (DO NOT ALTER):**  
> Vehicle details such as **Price**, **Year**, **Mileage**, **Transmission**, and **Sales Status** intentionally appear in multiple places:  
> 1. In the Vehicle Identity Header  
> 2. In the 4-Column Key Spec Strip  
> 3. In the Detailed Specifications Grid  
> 4. In the Sticky Mobile Action Bar  
> *This redundancy ensures high visibility and immediate conversion capability across all screen scroll positions.*

---

## 6. CONTACT & CTA SYSTEM MAP

| CTA / Element | Component Location | Desktop Visibility | Mobile Visibility | Destination / Action | Duplicated Locations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Desktop Dock WhatsApp** | `GlobalControls.tsx` | Visible (Bottom Right/Left) | Hidden (`hidden md:flex`) | Opens `https://wa.me/{number}` | Yes (Footer, Mobile Drawer, Sticky Bar) |
| **Sticky Mobile WhatsApp** | `StickyMobileContact.tsx` | Hidden (`md:hidden`) | Fixed Bottom Bar | Opens vehicle-specific WhatsApp pre-filled text URL | Yes (Detail page, Dock, Drawer) |
| **Mobile Drawer Call** | `Navbar.tsx` | Hidden | Inside Hamburger Drawer | Initiates `tel:+213550123456` phone call | Yes (Sticky Bar, Contact section) |
| **Sticky Mobile Call** | `StickyMobileContact.tsx` | Hidden (`md:hidden`) | Fixed Bottom Bar | Initiates `tel:+213550123456` phone call | Yes (Mobile Drawer, Contact section) |
| **Inquiry Form** | `LeadForm.tsx` | Visible on `#contact` | Visible on `#contact` | Submits JSON payload to `/api/lead` | Single primary form |
| **Social Links Cluster** | `GlobalControls`, `Footer`, `Navbar` | Visible in Dock & Footer | Visible in Drawer & Footer | External links to Instagram, Facebook, TikTok | Yes (Multiple UI anchors) |
| **Language Switcher** | `Navbar` & `Footer` | Visible in Footer | Visible in Mobile Drawer & Footer | Sets `NEXT_LOCALE` cookie and updates URL prefix | Yes (Drawer + Footer) |

---

## 7. RESPONSIVE BEHAVIOR SYSTEM

* **Standard Breakpoints**:
  * Mobile: `< 640px` (Default stack)
  * Tablet / Small Desktop: `640px` (`sm`) to `768px` (`md`)
  * Desktop: `1024px` (`lg`)
  * Container Maximum: `1600px` (`max-w-container`)
* **Header Transition**: Desktop displays inline horizontal links (`gap-9`). Mobile collapses links into a square hamburger button that triggers an animated side drawer (`w-4/5 max-w-xs`).
* **Card Grid Scaling**:
  * Homepage Grid: 3 columns (`lg:grid-cols-3`) → 2 columns (`sm:grid-cols-2`) → 1 column (`grid-cols-1`).
  * Inventory Page Filters: Desktop inline strip → Mobile fullscreen modal sheet triggered by a sticky filter button with active count badge.
* **Sticky Elements**:
  * Header: Sticky top with background blur on scroll.
  * Mobile Action Bar: Fixed bottom screen anchor (`bottom-0 left-0 right-0 z-40`) on mobile devices.
  * Desktop Social Dock: Fixed bottom right/left dock (`bottom-6 z-40`) on desktop devices.

---

## 8. VISUAL DESIGN SYSTEM & TOKENS

The visual identity strictly follows a **PREMIUM AUTOMOTIVE DARK THEME**:

```typescript
// tailwind.config.ts color tokens
colors: {
  brand: {
    bg: "#05080D",              // Deepest Automotive Obsidian/Navy
    card: "#09111C",            // Dark Surface Panel Background
    surface: "#101416",         // Elevated Surface Container
    "surface-high": "#191C1E",    // High-Contrast Surface
    border: "rgba(255, 255, 255, 0.1)",       // Standard Thin Border
    "border-subtle": "rgba(255, 255, 255, 0.06)", // Subtle Divider Line
    blue: "#126BFF",            // Core Electric Blue Accent
    "blue-hover": "#2F80FF",      // Hover Blue Highlight
    text: "#E0E3E6",            // Primary White/Platinum Body Text
    muted: "#C2C6D8",           // Secondary Muted Body Text
    subtle: "#8C90A1",          // Label & Micro-Text Color
  }
}
```

* **Typography Tokens**:
  * Display / Headlines: `Barlow Condensed` (Latin) & `Noto Kufi` (Arabic).
  * Body / UI Text: `Manrope` (Latin) & `IBM Plex Sans Arabic` (Arabic).
  * Labels & Caps: `.font-label-caps` utility applying uppercase transformation, tracking (`0.12em` on LTR, `0em` on RTL), and bold weight.
* **Border Radii**: Strict, subtle rounded edges (default `6px`, cards `6px`, images `2px` or `12px` for gallery).

---

## 9. APPROVED CINECAR LOGO ASSETS

| Asset Path | File Type | Dimensions / Size | Usage Location | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`public/brand/cinecar-logo.png`** | PNG | 78.9 KB | **Navbar & Footer** (ALL PAGES) | **PRIMARY APPROVED LOGO**. Features white "CINECAR" lettering with electric blue vehicle silhouette and "CAR SALES" subtitle. |
| `public/brand/cinecar-logo-black.png` | PNG | 30.1 KB | Asset Store | Dark variant for light backgrounds (not currently rendered). |
| `public/cinecar-logo.png` | PNG | 78.9 KB | Public Root | Duplicate copy of primary brand logo. |
| `public/cinecar-logo-horizontal.png` | PNG | 78.9 KB | Public Root | Duplicate copy of primary horizontal logo. |

> ⚠️ **CRITICAL LOGO DIRECTIVE:**  
> `public/brand/cinecar-logo.png` is the **ONLY APPROVED LOGO** currently rendered in `Navbar.tsx` and `Footer.tsx`. **DO NOT REPLACE**, **DO NOT ALTER**, and **DO NOT GENERATE** new logo graphics.

---

## 10. SANITY & DATA ARCHITECTURE

### 10.1 Schema Definitions (`sanity/schemaTypes/`)
1. **`car`** (`car.ts`): Main vehicle document. Contains fields for `titleOverride`, `stockNumber` (unique string validation), `slug` (auto-generated from brand + model + trim + year + short ID), `brand` (reference), `model` (filtered reference), `trim`, `year`, `salesStatus` (`available`, `reserved`, `sold`), `archived`, `featured`, `priority`, `price`, `showPrice`, `oldPrice`, `currency`, `mileage`, `fuel`, `transmission`, `engine`, `engineCapacity`, `power`, `driveType`, `exteriorColor`, `interiorColor`, `doors`, `seats`, `condition`, `origin`, `registration`, `vinInternal`, `publicVinSuffix`, `features` (array of pre-defined options), `description` (localized text), `images` (array of Sanity image assets), `videoUrl`, `seoTitle`, and `seoDescription`.
2. **`brand`** (`brand.ts`): Brand document (`name`, `slug`, `logo`, `country`, `sortOrder`, `active`).
3. **`carModel`** (`carModel.ts`): Model document linked via reference to brand (`name`, `slug`, `brand`, `sortOrder`, `active`).
4. **`siteSettings`** (`siteSettings.ts`): Global site configuration (`businessName`, `logo`, `whatsappNumber`, `phoneNumbers`, `email`, `address`, `workingHours`, `heroImage`, `defaultSEO`).

### 10.2 Data Flow & Query Projections
* Database queries are written in GROQ inside `sanity/lib/queries.ts` using `CAR_PROJECTION`.
* Data moves from Sanity CDN → `sanityFetch()` in `sanity/lib/fetch.ts` → React Server Components (`HomePage`, `CarsPage`, `CarDetailPage`) → Client UI Components (`CarCard`, `Gallery`, `CarFilters`).
* **Fallback Behavior**: If Sanity CDN returns no data or fails during development, `fetch.ts` automatically serves built-in `DEMO_CARS` data (containing 5 luxury vehicles: Porsche 911 GT3 RS, Audi RS e-tron GT, Mercedes-AMG G63, BMW M4 Competition, and Range Rover Sport).

---

## 11. FUNCTIONALITY MAP

```mermaid
flowchart TD
    User([User Request]) --> Middleware{Middleware /}
    Middleware -->|No Cookie/Header| Redirect[Redirect to /ar or /fr]
    Middleware -->|Has Locale| Layout[app/[locale]/layout.tsx]
    
    Layout --> Navbar[Navbar Component]
    Layout --> MainContent[Page Content]
    Layout --> Dock[GlobalControls Desktop Dock]
    Layout --> Footer[Footer Component]
    
    MainContent -->|Homepage| Home[app/[locale]/page.tsx]
    MainContent -->|Inventory| Inventory[app/[locale]/cars/page.tsx]
    MainContent -->|Detail| Detail[app/[locale]/cars/[slug]/page.tsx]
    
    Home --> LeadForm[LeadForm Component]
    LeadForm -->|POST| LeadAPI[/api/lead Route]
    LeadAPI -->|Resend SDK| Email[Destination Email Inbox]
    
    Detail --> GalleryComp[Gallery Component]
    Detail --> WhatsAppGen[lib/whatsapp.ts]
    WhatsAppGen -->|Click| WAExternal[wa.me External Redirect]
```

---

## 12. KNOWN UI/UX ISSUES & OBSERVATIONS

> ℹ️ **NOTE**: These issues are documented for observation only. **DO NOT FIX OR MODIFY** them as part of this handoff.

### 🔴 CRITICAL
* **Demo Data Image Mismatches**: In `sanity/lib/fetch.ts`, the `DEMO_CARS` array contains asset URLs from Unsplash where vehicle images do not match vehicle titles:
  * The card for **"AUDI RS E-TRON GT"** renders an image of an **Audi R8**.
  * The card for **"MERCEDES-AMG G63"** renders an image of an **Audi Avant Wagon (RS6/RS4)**.

### 🟠 HIGH
* **Price Formatting Inconsistency in `CarCard` Subtitles**: In `CarCard.tsx`, price text rendered via string interpolation in certain raw data scenarios can render without thousand separators (e.g. `38500000 DA` instead of `38 500 000 DA`) if `formatPrice()` is bypassed in custom sub-templates.

### 🟡 MEDIUM
* **Next.js Dev Overlay Obscuration**: In local development (`npm run dev`), Next.js runtime issue indicator badges (`1 Issue`) render in the bottom-left corner of the viewport, partially overlapping the sticky mobile contact bar.

### 🔵 LOW
* **Redundant Specifications Display**: On the vehicle detail page, specifications like Year, Mileage, and Transmission appear in 3 distinct blocks on the same page (Header, Key Specs Strip, and Full Specs Grid).

---

## 13. WHAT MUST NOT BE CHANGED ("DO NOT BREAK")

Future AI agents and developers **MUST NOT** modify or break the following core elements:

1. ❌ **DO NOT CHANGE THE LOCALIZATION ARCHITECTURE**: The `[locale]` URL prefix structure (`/ar` and `/fr`), cookie handler (`NEXT_LOCALE`), and translation dictionaries in `lib/i18n.ts` must remain intact.
2. ❌ **DO NOT CHANGE THE SANITY SCHEMA ARCHITECTURE**: The document structure (`car`, `brand`, `carModel`, `siteSettings`) and GROQ projection `CAR_PROJECTION` must match existing queries.
3. ❌ **DO NOT MODIFY OR REPLACE THE CINECAR LOGO**: The logo asset located at `public/brand/cinecar-logo.png` is approved and final.
4. ❌ **DO NOT ALTER THE DEMO FALLBACK MECHANISM**: The `DEMO_CARS` fallback in `sanity/lib/fetch.ts` is essential for application stability when live Sanity credentials are not present.
5. ❌ **DO NOT REMOVE THE HONEYPOT FIELD IN LEAD FORM**: The hidden `website` field in `LeadForm.tsx` prevents automated spam submissions.

---

## 14. SAFE MODIFICATION MAP

For future feature additions or UI tweaks, refer to this exact file map:

| Task / Requirement | File(s) to Modify | Risk Level |
| :--- | :--- | :--- |
| **Modify Navigation Links** | `components/Navbar.tsx` | Low |
| **Modify Footer Content / Links** | `components/Footer.tsx` | Low |
| **Modify Vehicle Card Visual Layout** | `components/CarCard.tsx` | Medium |
| **Modify Vehicle Detail Page Layout** | `app/(site)/[locale]/cars/[slug]/page.tsx` | Medium |
| **Modify Gallery Controls or Lightbox** | `components/Gallery.tsx` | Medium |
| **Modify Filter Options & Sorting** | `components/CarFilters.tsx` & `sanity/lib/fetch.ts` | High |
| **Modify Theme Colors & Typography** | `tailwind.config.ts` & `app/globals.css` | High |
| **Modify Sanity Vehicle Document Fields** | `sanity/schemaTypes/car.ts` & `sanity/lib/queries.ts` | High |
| **Modify WhatsApp Pre-filled Messages** | `lib/whatsapp.ts` | Low |
| **Modify Contact Email & Lead Logic** | `app/api/lead/route.ts` & `components/LeadForm.tsx` | Medium |

---

## 15. DEPENDENCY & RISK ANALYSIS

```mermaid
graph TD
    A[lib/i18n.ts] --> B[app/[locale]/layout.tsx]
    A --> C[components/Navbar.tsx]
    A --> D[components/CarCard.tsx]
    A --> E[app/[locale]/cars/[slug]/page.tsx]
    
    F[sanity/lib/fetch.ts] --> G[app/[locale]/page.tsx]
    F --> H[app/[locale]/cars/page.tsx]
    F --> I[app/[locale]/cars/[slug]/page.tsx]
    
    J[sanity/lib/queries.ts] --> F
```

* **High Risk Node 1: `lib/i18n.ts`**: Contains all dictionary keys. Removing or renaming a dictionary key will cause runtime errors across almost every component in the application.
* **High Risk Node 2: `sanity/lib/fetch.ts` & `queries.ts`**: Controls data fetching for the entire site. Any syntax error in GROQ queries or projection types will break data rendering globally.
* **High Risk Node 3: `middleware.ts`**: Controls entry routing. Malformed matcher patterns will cause infinite redirect loops or 404 errors for visitors.

---

## 16. RECOMMENDED DEVELOPMENT WORKFLOW FOR GEMINI / FUTURE AI

When instructed to implement changes or new features on CINECAR, follow this step-by-step process:

1. **Read This Document Completely**: Inspect the page maps, safe modification paths, and risk nodes before touching code.
2. **Verify Environment State**: Ensure `npm run dev` is running on `http://localhost:3000`.
3. **Target Specific Components**: Refer to Section 14 (*Safe Modification Map*) to isolate modifications to single components without breaking shared layouts.
4. **Preserve Fallbacks**: Keep the `DEMO_CARS` fallback in `fetch.ts` operational for offline/demo reliability.
5. **Test Both Locales**: Always test changes in both French (`/fr`) LTR mode and Arabic (`/ar`) RTL mode to ensure typography and layout alignment remain intact.

---

### HANDOFF DOCUMENTATION COMPLETE
*Inspected, Analyzed, Documented, and Verified by Antigravity AI Code Assistant.*
