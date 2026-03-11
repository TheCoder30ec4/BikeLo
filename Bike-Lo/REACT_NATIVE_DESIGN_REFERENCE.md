# BikeLo Website – React Native Design Reference

This document captures the design system, theme, styles, icons, and structure of the BikeLo web app so a React Native app can match it.

---

## 1. Overview

- **Product**: BikeLo – buy, sell & service pre-owned bikes.
- **Tagline**: “Your Dream Bike, Deliver to Your [Doorstep / Dreams / Journey / Adventure / Freedom]”
- **Key value**: 10,000+ certified bikes; 75-point inspection; 6 months engine warranty; 2 free services; 1-year free insurance; RC/TC assurance.
- **Tech stack (web)**: React 19, Vite, React Router, Tailwind CSS 4, Framer Motion, Lucide React, Radix UI (navigation, slot, etc.).

---

## 2. Theme (Light / Dark)

The app supports **light** and **dark** modes with a **system** option. Theme is stored in `localStorage` under key `theme` (`'light' | 'dark' | 'system'`).

### 2.1 CSS Variables (Design Tokens)

Use these as the single source of truth for React Native (e.g. in a `theme.ts` or StyleSheet).

#### Light mode (`:root`)

| Token | Value | Usage |
|-------|--------|--------|
| `--background` | `oklch(1 0 0)` (white) | Screen background |
| `--foreground` | `#000000` | Primary text |
| `--card` | `oklch(1 0 0)` | Card background |
| `--card-foreground` | `#000000` | Card text |
| `--primary` | `#DC2626` | (Shadcn default – overridden in UI by orange) |
| `--border` | `oklch(0.9220 0 0)` | Borders |
| `--radius` | `0.625rem` (10px) | Default border radius |
| `--font-sans` | System + Noto Sans | Body text |
| `--font-serif` | Georgia, Times, etc. | **Not overridden in HTML** – see Typography |
| Link / accent (in code) | `#DC2626` | Links (light) |

#### Dark mode (`.dark`)

| Token | Value | Usage |
|-------|--------|--------|
| `--background` | `oklch(0.12 0 0)` | Screen background |
| `--foreground` | `oklch(0.95 0 0)` | Primary text |
| `--card` | `oklch(0.18 0 0)` | Card background |
| `--primary` | `#f7931e` | Primary actions (orange) |
| `--ring` | `#f7931e` | Focus ring |
| `--border` | `oklch(0.25 0 0)` | Borders |
| Link / accent (in code) | `#f7931e` | Links, CTAs |

**Transitions**: `0.3s ease` or `cubic-bezier(0.4, 0, 0.2, 1)` for background, color, border-color, box-shadow.

---

## 3. Brand Colors (Actual UI Usage)

These are what the components use; they override some CSS variables.

| Name | Hex | RGB | Usage |
|------|-----|-----|--------|
| **Primary orange** | `#f7931e` | 247, 147, 30 | CTAs, active nav, badges, highlights, social icons, star rating |
| **Primary orange (hover)** | `#e6851a` | 230, 133, 26 | Buttons, links on hover |
| **Logo “Bike” (red)** | `#DC2626` | 220, 38, 38 | “Bike” in “Bike-Lo” (navbar, footer) |
| **Wishlist heart (active)** | `red-500` (Tailwind) | — | Filled heart when wishlisted |
| **White** | `#FFFFFF` | 255, 255, 255 | Cards (light), button text, nav text (dark) |
| **Black** | `#000000` | 0, 0, 0 | Headings/text (light) |

### 3.1 Semantic Grays (Tailwind)

- **Light**: `gray-200`, `gray-300`, `gray-400`, `gray-600`, `gray-700` (borders, secondary text).
- **Dark**: `gray-700`, `gray-800`, `gray-900`, `neutral-800` (borders, cards, nav toggle).  
- **Muted text**: `text-gray-500` / `dark:text-gray-400`, `text-gray-600` / `dark:text-gray-400`.

### 3.2 Opacity Variants

- `rgba(247, 147, 30, 0.1)` – subtle orange background (e.g. social icon circle).
- `rgba(247, 147, 30, 0.2)` – footer top border, tile hover (dark).
- `rgba(247, 147, 30, 0.3)` – social icon border, footer border (dark).
- `rgba(247, 147, 30, 0.15)` – tile hover (light).
- `rgba(247, 147, 30, 0.5)` – glow in hero; outline button border.

---

## 4. Typography

### 4.1 Fonts

- **Google Font**: **Noto Serif** (weights 400, 700) – used for headings, logo, nav, buttons, hero, footer, cards.  
  - Import: `https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap`
- **Body / UI**: System stack (e.g. `ui-sans-serif`, `system-ui`, `Segoe UI`, `Roboto`, `Noto Sans`).  
  React Native: use **Noto Serif** for headings and primary UI; system for body if desired.

### 4.2 Font Usage in Code

- `fontFamily: "'Noto Serif', serif"` – all major headings, logo “Bike-Lo”, nav links, primary buttons, hero, footer logo/headings/CTAs, BikeCard title.

### 4.3 Scale (from components)

| Element | Web (Tailwind) | Approx. size |
|---------|-----------------|--------------|
| Logo (navbar) | `text-4xl font-bold` | 36px, bold |
| Hero headline | `text-4xl` → `xl:text-7xl` | 36px → 72px, bold |
| Hero subtext | `text-lg sm:text-xl` | 18–20px |
| Section title | `text-2xl sm:text-3xl lg:text-4xl font-bold` | 24–36px |
| Card title (bike) | `text-lg font-bold` | 18px |
| Nav link | `text-[15px] font-bold` | 15px |
| Body / description | `text-sm`, `text-base` | 14–16px |
| Small / caption | `text-xs`, `text-sm` | 12–14px |
| Footer column heading | `0.8rem font-bold uppercase letter-spacing` | ~13px |
| Badge | `text-xs font-semibold` | 12px |

---

## 5. Spacing & Layout

- **Container**: `container mx-auto`, `max-w-6xl` / `max-w-7xl` (1152px / 1280px).
- **Section padding**: `py-10 sm:py-12 lg:py-16`, `px-4 sm:px-6 lg:px-8` (e.g. 40–64px vertical, 16–24px horizontal).
- **Gap**: `gap-4`, `gap-6`, `gap-8` (16–32px).
- **Navbar height**: `h-16` (64px).

---

## 6. Border Radius & Shadows

- **Radius**: `--radius: 0.625rem` (10px). Cards use `rounded-xl` (12px). Buttons often `rounded-md` (6px) or `rounded-lg`; footer CTAs `rounded-full` (pill).
- **Shadows**:  
  - Cards: `shadow-sm` / `hover:shadow-lg`.  
  - Buttons: subtle shadow; hero buttons use a “shine” overlay (gradient).  
  - Values in CSS: `--shadow-sm`, `--shadow`, `--shadow-lg` (see `index.css`).

---

## 7. Icons

### 7.1 Lucide React (npm: `lucide-react`)

Used across the app. In React Native you can use `react-native-lucide` or export SVGs from Lucide.

| Icon | Where used |
|------|------------|
| `Sun` | Theme toggle (show when current theme is dark) |
| `Moon` | Theme toggle (show when current theme is light) |
| `Star` | Hero rating (5 stars), filled with orange |
| `ChevronDownIcon` | Navigation menu |
| `X` | Dialog close |
| `MoveRight`, `PhoneCall` | Animated hero / CTAs |
| `Instagram`, `Linkedin`, `Facebook`, `Twitter` | Footer social links |
| `Phone` | Footer “Call” CTA |

Sizes in use: `w-5 h-5` (20px), `size={22}`, `size={18}`.

### 7.2 Inline SVGs (heart, location, etc.)

- **Heart (wishlist)** – path used in `BikeCard.tsx`:
  - `viewBox="0 0 24 24"`, stroke 2, round caps/joins.
  - Path: `"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"`.
- **Lightning (kms)**: `d="M13 10V3L4 14h7v7l9-11h-7z"`.
- **Check circle**: `d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"`.
- **Settings (transmission)**: path from BikeCard (gear icon).
- **Location pin**: path from BikeCard.
- **Play (video)**: `d="M8 5v14l11-7z"`.
- **Arrow right**: `d="M9 5l7 7-7 7"`.

All use `stroke="currentColor"`, `strokeWidth={2}`, `strokeLinecap="round"`, `strokeLinejoin="round"` where applicable.

### 7.3 Emojis (BuySellSection benefits)

- 🔍 75 Points Inspection  
- 🛡️ 6 Months Engine Warranty  
- 🔧 2 Free Service  
- 📋 1-Year Free Insurance  
- ✓ 100% RC TC Assurance  
- ⚡ Instant online quote  
- 📋 Free bike evaluation  
- 💳 Same day payment  

In React Native you can keep these as text or replace with vector icons.

---

## 8. Assets

### 8.1 Images (WebP / PNG)

- **Hero**: `Hero-Image.webp`
- **Benefits (Buy tab)**: `Inspection.webp`, `6MonthsWarranty.webp`, `servicing.webp`, `Insurance.webp`, `RCTransfer.webp`
- **Partners / brands**: `TvsLogo.webp`, `KotakLogo.webp`, `AXISBank_Logo.webp`, `ICICI Logo.webp`, `HondaLogo.webp`, `SuzukiLogo.webp`, `YamahaLogo.webp`
- **Public**: `logo-dark.png`, `logo-light.png` (for favicon/header if needed)

### 8.2 SVGs (under `src/assets`)

- `Exchange.svg`, `file.svg`, `Finance.svg`, `Insurance.svg`

Use these same filenames and paths when bundling assets for React Native (e.g. require or metro asset resolution).

---

## 9. Components & Styling Summary

| Component | Key styles |
|-----------|------------|
| **Navbar** | Transparent bg; logo “Bike” `#DC2626`, “-Lo” black/white by theme; nav links bold Noto Serif, active/hover `#f7931e`; theme toggle rounded, sun/moon icon |
| **Hero** | Tiles background; gradient glow (orange + purple in dark); headline Noto Serif; rotating word in `#f7931e`; underline on “Deliver”; buttons `#f7931e` / `#e6851a`, Noto Serif; 5 stars filled orange; avatars orange circles |
| **BuySellSection** | Tabs: pill container, active tab `#f7931e`; benefit cards with border, hover border orange; CTA “Browse Bikes” orange button |
| **BikeCard** | Card white/dark gray; image 48 height, hover scale; wishlist heart top-right; tags badge `#f7931e`; title Noto Serif; price `#f7931e`; specs with small icons (lightning, check, gear, location) |
| **Footer** | Top border orange rgba; logo “Bike” red, “-Lo” black/white; description serif; social icons circle with orange border/fill on hover; CTA call orange pill; outline buttons orange border; column headings uppercase; links hover `#f7931e` |
| **Buttons (primary)** | `#f7931e` bg, `#e6851a` hover, white text, Noto Serif, rounded-md/lg, optional scale on hover |
| **Badge (tags)** | `#f7931e` bg, white text, small rounded |

---

## 10. Routes / Pages

| Path | Page | Content |
|------|------|--------|
| `/` | Home | Hero, BrandMarquee, BuySellSection, PremiumServices, PopularBikes, BrowseByStyle |
| `/bikes` | Bikes | Listing with filters, BikeGrid of BikeCards |
| `/buy` | Buy | Buy flow / benefits |
| `/sell` | Sell | Sell flow, form |
| `/service` | Service | Servicing info |
| `/parts` | Parts | Spare parts |
| `/about` | About | About us |

---

## 11. Data Types

```ts
interface Bike {
  id: string;
  year: number;
  brand: string;
  model: string;
  variant: string;
  price: number;       // lakhs
  emi: number;         // per month
  kmsDriven: number;
  fuelType: "Petrol" | "Diesel" | "Electric";
  transmission: "Manual" | "Automatic";
  location: string;
  tags: string[];
  imageUrl: string;
}
```

Price display: `₹ ${price.toFixed(2)} L`. Kms: if >= 1000 then `(kms/1000).toFixed(1) + 'k km'`, else `kms + ' km'`.

---

## 12. Animation (Framer Motion)

- Hero: text fade/translate (e.g. y: 40 → 0), rotating word (opacity/y), star and avatar stagger (scale/rotate).
- Navbar: hide on scroll down, show on scroll up (`translateY`).
- Cards: hover scale (e.g. 1.05), shadow transition.
- Easing: `ease: [0.16, 1, 0.3, 1]`, `type: "spring", stiffness: 200, damping: 15` for snappy UI.

For React Native, use `react-native-reanimated` and/or `react-native-animatable` to approximate these (opacity, translateY, scale).

---

## 13. React Native Mapping Tips

1. **Theme**: Create a `theme` object (e.g. `light` / `dark`) with the hex values above; switch based on system or user setting and store in AsyncStorage.
2. **Fonts**: Load **Noto Serif** (e.g. `expo-font`) and use it for all headings, logo, and primary buttons.
3. **Colors**: Use the “Brand Colors” table; primary orange `#f7931e` and hover `#e6851a` everywhere for CTAs and accents.
4. **Icons**: Use `react-native-lucide` or equivalent for Sun, Moon, Star, Phone, ChevronDown, X, MoveRight, PhoneCall, and social icons; replicate the heart path for wishlist.
5. **Spacing**: Map Tailwind spacing (e.g. 4 → 16, 6 → 24, 8 → 32) to your spacing scale.
6. **Assets**: Copy `src/assets` and `public` images into the RN project and reference them the same way (e.g. `require('./assets/Insurance.webp')`).
7. **Navigation**: Map routes to a stack or tab navigator; keep the same path names for deep linking if needed.

---

## 14. File Reference

| Purpose | Path |
|--------|------|
| Global theme & tokens | `src/index.css` |
| Theme hook (light/dark/system) | `src/hooks/use-theme.tsx` |
| Routes | `src/App.tsx` |
| Bike type | `src/types/bike.ts` |
| Mock data | `src/data/mockBikes.ts` |
| Font link | `index.html` (Noto Serif) |

Using this reference, you can replicate BikeLo’s theme, style, and icons in a React Native app consistently.
