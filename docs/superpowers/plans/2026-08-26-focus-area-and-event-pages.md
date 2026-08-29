# Focus Area & Event Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the About Us and Activities sections, restyle "Our Focus Area" (6 cards only) to visually match the old About Us section, and make the Timeline's "Explore Event" buttons navigate to a real, reusable `/events/:eventId` detail page — with a config-driven "Register Now" button for ZenConnect.

**Architecture:** Extract the timeline event data (currently hard-coded inside `Timeline.tsx`) into a shared `client/src/data/events.ts` module keyed by `slug`, so both `Timeline.tsx` and a new generic `client/src/pages/EventDetail.tsx` read from one source — no per-event page components. The event image loader (`EventImage`) is extracted into its own component so both pages can use it. A new `FocusArea.tsx` component reuses `About.tsx`'s visual shell (background SVG, blobs, header pattern, card styling, bottom wave) populated only with the 6 existing focus-area items. `About.tsx` and `Activities.tsx` are deleted; all nav/footer links and anchors are updated to match.

**Tech Stack:** React 18 + TypeScript, wouter (routing), framer-motion (animation), Tailwind CSS, Vite. No test runner is configured in this repo (no jest/vitest in `package.json`), so verification is via `npm run check` (tsc) and manual dev-server checks (curl + visual spot-check), not automated tests.

**Spec:** User request in conversation (2026-08-26): remove About Us, restyle Our Focus Area (6 cards only, drop "Join Our Community"), remove Activities, wire up "Explore Event" buttons to real internal event pages sourced from existing timeline data, add a config-driven "Register Now" button on the ZenConnect event page, preserve navbar/hero/timeline/footer/colors/fonts/animations/responsiveness otherwise.

## Global Constraints

- Do not modify: `Navbar.tsx` layout/behavior beyond link text/href changes, `Hero.tsx`, `Timeline.tsx`'s existing card visuals/animations, `Footer.tsx` layout beyond the quick-links array, colors, fonts, or the dark theme default.
- No new dependencies — use only packages already in `package.json` (wouter, framer-motion, lucide-react).
- No backend/API changes.
- Follow existing code conventions: functional components, Tailwind utility classes, CSS vars `--power-red` / `--vitality-red` / `--somaiya-black`, `bg-gradient-red` / `text-gradient` utility classes.
- The repo has no automated test suite — "verify" steps below use `npm run check` (TypeScript) and `curl`/dev-server inspection instead of unit tests.

---

## File Structure

**Create:**
- `client/src/config/registration.ts` — single source of truth for the ZenConnect registration URL.
- `client/src/data/events.ts` — shared event data (moved out of `Timeline.tsx`) + `TimelineEventData` type + `getEventBySlug`.
- `client/src/components/EventImage.tsx` — event image-with-fallback component (moved out of `Timeline.tsx`).
- `client/src/components/FocusArea.tsx` — replaces `About.tsx` on the homepage; About's visual template + only the 6 focus-area cards.
- `client/src/pages/EventDetail.tsx` — generic `/events/:eventId` detail page driven by `events.ts`.

**Modify:**
- `client/src/index.css` — add the `.tl-skeleton` / `@keyframes tl-shimmer` rules globally (currently trapped inside `Timeline.tsx`'s local `<style>` tag, so they wouldn't apply on the standalone event page).
- `client/src/components/Timeline.tsx` — import data/component from the new shared files instead of defining them locally; make cards navigate to `/events/:slug`.
- `client/src/pages/Home.tsx` — drop `About`/`Activities`, add `FocusArea`.
- `client/src/App.tsx` — add the `/events/:eventId` route.
- `client/src/components/Navbar.tsx` — replace "About Us" (`#about`) with "Our Focus Area" (`#focus-area`); remove "Activities" links (desktop + mobile, home + other-page variants).
- `client/src/components/Footer.tsx` — same link updates in `quickLinks`.

**Delete:**
- `client/src/components/About.tsx` (content/visuals absorbed into `FocusArea.tsx`).
- `client/src/components/Activities.tsx` (removed outright per spec; nothing else imports it).

---

### Task 1: Registration config + shared event data module

**Files:**
- Create: `client/src/config/registration.ts`
- Create: `client/src/data/events.ts`
- Test: `npm run check` (tsc, no emit)

**Interfaces:**
- Produces: `ZENCONNECT_REGISTRATION_URL: string` from `config/registration.ts`.
- Produces: `interface TimelineEventData { id, slug, date, title, description, tags, isFlagship?, align, image, fallbackGradient, location, registrationUrl? }`, `timelineEvents: TimelineEventData[]`, `getEventBySlug(slug: string): TimelineEventData | undefined` from `data/events.ts`.

- [ ] **Step 1: Create the registration config**

```ts
// client/src/config/registration.ts
// Single place to update event registration links.
// TODO: replace with the real ZenConnect registration link before launch.
export const ZENCONNECT_REGISTRATION_URL =
  "https://forms.gle/REPLACE_WITH_ZENCONNECT_REGISTRATION_LINK";
```

- [ ] **Step 2: Create the shared event data module**

```ts
// client/src/data/events.ts
import { ZENCONNECT_REGISTRATION_URL } from "@/config/registration";

export interface TimelineEventData {
  id: number;
  slug: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  isFlagship?: boolean;
  align: "left" | "right";
  image: string;
  fallbackGradient: string;
  location: string;
  registrationUrl?: string;
}

export const timelineEvents: TimelineEventData[] = [
  {
    id: 1,
    slug: "zenconnect-25",
    date: "3rd September 2025",
    title: "ZenConnect '25",
    description:
      "A sneak peek into the exciting realm of AI & Data with us. Meet the council, explore fun activities, get a roadmap on your data journey, and network at a university level.",
    tags: ["Networking", "Roadmap Session", "Fun Activities"],
    align: "left",
    image: "/images/zenconnect.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0505,#6b1010,#c0392b)",
    location: "Somaiya Vidyavihar University, Mumbai",
    registrationUrl: ZENCONNECT_REGISTRATION_URL,
  },
  {
    id: 2,
    slug: "data-trek",
    date: "13th to 19th October 2025",
    title: "Data Trek",
    description:
      "A week-long virtual trek exploring the latest trends in data science and AI, featuring guest speakers from industry leaders and hands-on workshops.",
    tags: ["7 Days", "Guest Speakers", "Workshops"],
    align: "right",
    image: "/images/datatrek.jpg",
    fallbackGradient: "linear-gradient(135deg,#050a1a,#102060,#1a5fbf)",
    location: "Online / Virtual",
  },
  {
    id: 3,
    slug: "case-study-competition",
    date: "31st January 2026",
    title: "Case Study Competition",
    description:
      "A competition where students analyze and visualize data using Tableau, showcasing their skills in data storytelling, analytical thinking, and impactful insights.",
    tags: ["Tableau", "Data Storytelling", "₹50,000 Prize"],
    align: "left",
    image: "/images/casestudy.jpg",
    fallbackGradient: "linear-gradient(135deg,#050e05,#1a4010,#3a8c1a)",
    location: "Somaiya Vidyavihar University, Mumbai",
  },
  {
    id: 4,
    slug: "datathon-2026",
    date: "7th & 8th February 2026",
    title: "Datathon 2026",
    description:
      "Our flagship 48-hour Data Science & AI/ML hackathon with a prize pool of over ₹2 Lakhs+ and a footfall of over 1,000+ students from top universities.",
    tags: ["48 Hours", "Prize Pool ₹2L+", "1000+ Students", "AI / ML"],
    isFlagship: true,
    align: "right",
    image: "/images/datathon.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0500,#7a1500,#c0392b)",
    location: "Somaiya Vidyavihar University, Mumbai",
  },
];

export function getEventBySlug(slug: string): TimelineEventData | undefined {
  return timelineEvents.find((event) => event.slug === slug);
}
```

Note: `id`, `date`, `title`, `description`, `tags`, `isFlagship`, `align`, `image`, `fallbackGradient` are copied verbatim from the current `Timeline.tsx` (no content changes). `slug`, `location`, and `registrationUrl` are new fields: `slug` powers the route, `location` is a reasonable inference (DataZen's own university affiliation per `About.tsx`, or "Online / Virtual" for the explicitly virtual Data Trek) since no location field existed before, and `registrationUrl` is only set for ZenConnect per the spec.

- [ ] **Step 3: Verify it compiles**

Run: `npm run check`
Expected: no new TypeScript errors referencing `config/registration.ts` or `data/events.ts` (pre-existing unrelated errors, if any, are out of scope).

- [ ] **Step 4: Commit**

```bash
git add client/src/config/registration.ts client/src/data/events.ts
git commit -m "feat: add shared event data module and registration config"
```

---

### Task 2: Extract `EventImage` and move its skeleton CSS to global scope

**Files:**
- Create: `client/src/components/EventImage.tsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: `EventImage({ src, alt, gradient, className? }): JSX.Element`, default export, used by both `Timeline.tsx` (Task 3) and `EventDetail.tsx` (Task 5).

- [ ] **Step 1: Create the shared `EventImage` component**

```tsx
// client/src/components/EventImage.tsx
import { useState } from "react";

export default function EventImage({
  src,
  alt,
  gradient,
  className = "h-44 md:h-52",
}: {
  src: string;
  alt: string;
  gradient: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative w-full rounded-lg overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div
          className="absolute inset-0 tl-skeleton"
          style={{ background: gradient }}
        />
      )}
      {error && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{ background: gradient }}
        />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
```

This is the exact component currently defined inline in `Timeline.tsx` (lines 67-107), with an added optional `className` prop (default matches the original fixed `h-44 md:h-52`) so `EventDetail.tsx` can render it larger.

- [ ] **Step 2: Move the skeleton shimmer CSS into `index.css` (global)**

`Timeline.tsx`'s trailing `<style>` block currently defines `.tl-skeleton` and `@keyframes tl-shimmer`, but that `<style>` tag only exists in the DOM while `Timeline` is mounted — so on the standalone `/events/:eventId` page (which doesn't render `Timeline`), the shimmer animation used by `EventImage` would silently not apply. Move those two rules into `client/src/index.css` so they're always available.

In `client/src/index.css`, insert immediately after the `.bg-gradient-red` rule (around line 169):

```css
/* Event image loading shimmer — shared by Timeline and EventDetail */
@keyframes tl-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.tl-skeleton {
  background-size: 200% 100%;
  animation: tl-shimmer 1.6s ease-in-out infinite;
  background-image: linear-gradient(
    105deg,
    rgba(183,32,46,0.18) 0%,
    rgba(237,28,36,0.38) 40%,
    rgba(183,32,46,0.18) 60%,
    rgba(120,10,10,0.22) 100%
  );
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run check`
Expected: no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/EventImage.tsx client/src/index.css
git commit -m "refactor: extract EventImage component and globalize its skeleton CSS"
```

---

### Task 3: Wire `Timeline.tsx` to the shared data/component and make cards navigate

**Files:**
- Modify: `client/src/components/Timeline.tsx`

**Interfaces:**
- Consumes: `timelineEvents`, `TimelineEventData` from `@/data/events` (Task 1); `EventImage` from `@/components/EventImage` (Task 2); `useLocation` from `wouter`.

- [ ] **Step 1: Replace the local interface/data/component with imports**

Delete lines 1-107 of `Timeline.tsx` (the `TimelineEvent` interface, the `timelineEvents` array, and the local `EventImage` function) and replace the top of the file with:

```tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { timelineEvents, type TimelineEventData } from "@/data/events";
import EventImage from "@/components/EventImage";
```

Then replace every remaining reference to the type name `TimelineEvent` (in `TimelineCard`'s and `Timeline`'s prop typings) with `TimelineEventData`.

- [ ] **Step 2: Make the whole card navigate to its event page**

In the `TimelineCard` component, add the location setter and an `onClick` on the outer `motion.div` (the one that already carries `cursor-pointer`):

```tsx
function TimelineCard({
  event,
  index,
}: {
  event: TimelineEventData;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();
  const isLeft = event.align === "left";

  return (
    <div ref={cardRef}>
      <motion.div
        className={`group relative rounded-xl overflow-hidden border cursor-pointer ${
          event.isFlagship
            ? "tl-card-flagship tl-card-inview border-[var(--vitality-red)] shadow-[0_0_40px_rgba(237,28,36,0.25)] bg-card/95"
            : `border-[var(--power-red)]/25 bg-card/90 shadow-xl hover:border-[var(--vitality-red)] ${
                isInView ? "tl-card-inview" : ""
              } ${isHovered ? "tl-card-hover" : ""}`
        }`}
        onClick={() => setLocation(`/events/${event.slug}`)}
        initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 14 }}
```

(the rest of the `motion.div` props — `animate`, `transition`, `whileHover`, `onHoverStart`, `onHoverEnd`, `style` — are unchanged; only the `onClick` line is new, inserted right after the `className` prop).

- [ ] **Step 3: Remove the now-globalized skeleton CSS from the local `<style>` block**

In the trailing `<style>{\`...\`}</style>` block at the bottom of the file, delete the `/* Image placeholder shimmer */` comment, the `@keyframes tl-shimmer { ... }` block, and the `.tl-skeleton { ... }` block (they now live in `index.css` per Task 2). Leave the node-pulse, image-reveal, and hover-zoom rules untouched.

- [ ] **Step 4: Verify it compiles**

Run: `npm run check`
Expected: no TypeScript errors in `Timeline.tsx`.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Timeline.tsx
git commit -m "feat: source Timeline events from shared data and navigate to event pages"
```

---

### Task 4: `FocusArea.tsx` — About Us's visual template, populated with only the 6 focus cards

**Files:**
- Create: `client/src/components/FocusArea.tsx`

**Interfaces:**
- Produces: default export `FocusArea(): JSX.Element`, section `id="focus-area"`, consumed by `Home.tsx` (Task 6).

- [ ] **Step 1: Create the component**

```tsx
// client/src/components/FocusArea.tsx
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Brain, Code, Database, Layers, TrendingUp } from "lucide-react";

export default function FocusArea() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // The 6 focus-area blocks — content unchanged, carried over from the former About Us section
  const focusAreas = [
    {
      title: "Machine Learning",
      description:
        "Explore the cutting-edge algorithms that enable systems to learn and improve from experience.",
      icon: <Brain size={28} />,
    },
    {
      title: "Data Visualization",
      description:
        "Transform complex data into insightful visual representations for better decision making.",
      icon: <TrendingUp size={28} />,
    },
    {
      title: "Big Data Analytics",
      description:
        "Work with massive datasets to uncover patterns and insights that drive innovation.",
      icon: <Database size={28} />,
    },
    {
      title: "AI Development",
      description:
        "Create intelligent systems that can perceive, learn, reason and solve complex problems.",
      icon: <Code size={28} />,
    },
    {
      title: "Deep Learning",
      description:
        "Build neural networks that mimic human brain function to solve complex real-world problems.",
      icon: <Layers size={28} />,
    },
    {
      title: "Data Cleaning",
      description:
        "Ensure data quality by identifying and correcting errors, inconsistencies, and missing values.",
      icon: <Database size={28} />,
    },
  ];

  const DataFlow = () => (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 z-0"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="focusDataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--power-red)" />
          <stop offset="100%" stopColor="var(--vitality-red)" />
        </linearGradient>
      </defs>

      {Array.from({ length: 20 }).map((_, i) => (
        <path
          key={i}
          d={`M${100 + i * 40},${100 + Math.sin(i) * 50}
              C${300 + i * 5},${200 + Math.cos(i) * 100}
               ${500 - i * 10},${400 + Math.sin(i) * 150}
               ${800 + Math.cos(i) * 100},${700 + Math.sin(i) * 100}`}
          fill="none"
          stroke="url(#focusDataGradient)"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          opacity={0.3 + (i % 3) * 0.2}
        />
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <circle
          key={i}
          cx={200 + (i % 5) * 150}
          cy={200 + Math.floor(i / 5) * 200}
          r={5 + (i % 3) * 3}
          fill="var(--power-red)"
          opacity={0.5 + (i % 2) * 0.3}
        />
      ))}
    </svg>
  );

  return (
    <section
      id="focus-area"
      className="py-20 md:py-32 bg-transparent relative overflow-hidden"
      ref={containerRef}
    >
      <DataFlow />

      <motion.div
        className="absolute top-[10%] right-[10%] w-40 h-40 rounded-full bg-[var(--power-red)] opacity-5 z-0"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[5%] w-32 h-32 rounded-full bg-[var(--vitality-red)] opacity-5 z-0"
        style={{ y: y2 }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-24 h-24 rounded-full bg-[var(--somaiya-black)] opacity-5 z-0"
        style={{ y: y3 }}
      />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            Our Focus Area
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Disciplines We </span>
            <span className="text-gradient">Explore</span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            At DataZen, we explore multiple disciplines within data science, equipping students
            with the tools and knowledge to excel in today's data-driven world.
          </motion.p>

          <motion.div
            className="h-1 w-20 bg-gradient-red mx-auto mt-8"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 80 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {focusAreas.map((area, index) => {
            const color = index % 2 === 0 ? "var(--power-red)" : "var(--vitality-red)";
            return (
              <motion.div
                key={index}
                className="bg-card rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-2"
                variants={cardAnimation}
              >
                <div className="p-8">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                      color,
                    }}
                  >
                    {area.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-foreground">{area.title}</h3>

                  <p className="text-muted-foreground">{area.description}</p>

                  <div className="h-1 w-12 mt-6" style={{ background: color }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  );
}
```

This reuses `About.tsx`'s exact background treatment (`DataFlow` SVG, three parallax blobs), header pattern (pill badge → gradient heading → subtitle → underline bar), the "big card" styling from About's former 3-card Core Values grid (gradient icon box, title, description, colored underline), the staggered `framer-motion` entrance animation, and the bottom wave divider — applied to a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` layout holding exactly the 6 focus items. No "Join Our Community" content, no About Us copy.

- [ ] **Step 2: Verify it compiles**

Run: `npm run check`
Expected: no TypeScript errors in `FocusArea.tsx`.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/FocusArea.tsx
git commit -m "feat: add FocusArea section styled after the former About Us section"
```

---

### Task 5: `EventDetail.tsx` — generic event page + ZenConnect Register Now button

**Files:**
- Create: `client/src/pages/EventDetail.tsx`

**Interfaces:**
- Consumes: `getEventBySlug` from `@/data/events` (Task 1), `EventImage` from `@/components/EventImage` (Task 2), `useParams`/`Link` from `wouter`.
- Produces: default export `EventDetail(): JSX.Element`, consumed by `App.tsx` (Task 7) at route `/events/:eventId`.

- [ ] **Step 1: Create the page**

```tsx
// client/src/pages/EventDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUp, Calendar, MapPin, Trophy, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventImage from "@/components/EventImage";
import { getEventBySlug } from "@/data/events";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventBySlug(eventId) : undefined;
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.title = event ? `${event.title} - DataZen` : "Event Not Found - DataZen";
    window.scrollTo(0, 0);

    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [event]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-32 pb-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Event <span className="text-gradient">Not Found</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the event you're looking for.
            </p>
            <Link
              href="/#timeline"
              className="inline-flex items-center gap-2 bg-gradient-red text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all"
            >
              <ArrowLeft size={16} /> Back to Timeline
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-red z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(183,32,46,0.08)_0%,transparent_100%)]" />

          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <Link
              href="/#timeline"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to Timeline
            </Link>

            {event.isFlagship && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-red text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-md">
                <Trophy className="w-3.5 h-3.5" /> Flagship Event
              </div>
            )}

            <div className="text-xs md:text-sm font-bold tracking-[2.5px] text-[var(--vitality-red)] uppercase mb-4">
              {event.date}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              <span className="text-gradient">{event.title}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-3 py-1 rounded bg-[var(--power-red)]/10 text-[var(--vitality-red)] border border-[var(--power-red)]/20 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="h-1 w-20 bg-gradient-red mt-8" />
          </div>
        </section>

        {/* Details + Image */}
        <section className="pb-24 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="rounded-xl overflow-hidden shadow-2xl mb-12 max-w-2xl mx-auto">
              <EventImage
                src={event.image}
                alt={event.title}
                gradient={event.fallbackGradient}
                className="h-64 md:h-80"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-6">
                <Calendar className="text-[var(--vitality-red)] mt-1" size={20} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Date</div>
                  <div className="text-sm text-muted-foreground">{event.date}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-6">
                <MapPin className="text-[var(--vitality-red)] mt-1" size={20} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Location</div>
                  <div className="text-sm text-muted-foreground">{event.location}</div>
                </div>
              </div>
            </div>

            {event.registrationUrl && (
              <div className="text-center">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-red text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:opacity-90 transition-all text-lg"
                >
                  Register Now <ExternalLink size={18} />
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:right-12 w-12 h-12 bg-gradient-red rounded-full flex items-center justify-center shadow-lg z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <ArrowUp className="text-white" size={20} />
        </motion.button>
      )}
    </div>
  );
}
```

This follows the same page shell as the existing `Resources.tsx`/`Register.tsx` pages: `bg-background text-foreground` (dark by default per `theme-context.tsx`), fixed scroll-progress bar, `Navbar`, `<main className="flex-1 pt-20">`, `Footer`, and a conditional back-to-top button matching `Resources.tsx`'s pattern. The "Register Now" button only renders when `event.registrationUrl` is set — currently only `zenconnect-25`.

- [ ] **Step 2: Verify it compiles**

Run: `npm run check`
Expected: no TypeScript errors in `EventDetail.tsx`.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/EventDetail.tsx
git commit -m "feat: add generic event detail page with ZenConnect registration CTA"
```

---

### Task 6: Wire `Home.tsx` and `App.tsx`

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Consumes: `FocusArea` from `@/components/FocusArea` (Task 4), `EventDetail` from `@/pages/EventDetail` (Task 5).

- [ ] **Step 1: Update `Home.tsx` imports and JSX**

In `client/src/pages/Home.tsx`, change:

```tsx
import About from "@/components/About";
import Activities from "@/components/Activities";
```

to:

```tsx
import FocusArea from "@/components/FocusArea";
```

And change:

```tsx
        <Hero />
        <About />
        <Activities />
        <Timeline />
```

to:

```tsx
        <Hero />
        <FocusArea />
        <Timeline />
```

- [ ] **Step 2: Add the event route to `App.tsx`**

In `client/src/App.tsx`, add the import and route:

```tsx
import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Resources from "@/pages/Resources";
import EventDetail from "@/pages/EventDetail";
import NotFound from "@/pages/not-found";
import PixelCardExample from "./components/PixelCardExample";
import { ThemeProvider } from "./contexts/theme-context";

function App() {
  return (
    <ThemeProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resources" component={Resources} />
        <Route path="/events/:eventId" component={EventDetail} />
        <Route path="/pixel-cards" component={PixelCardExample} />
        <Route component={NotFound} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run check`
Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/Home.tsx client/src/App.tsx
git commit -m "feat: mount FocusArea on the homepage and register the /events/:eventId route"
```

---

### Task 7: Update `Navbar.tsx` and `Footer.tsx` links; delete `About.tsx` / `Activities.tsx`

**Files:**
- Modify: `client/src/components/Navbar.tsx`
- Modify: `client/src/components/Footer.tsx`
- Delete: `client/src/components/About.tsx`
- Delete: `client/src/components/Activities.tsx`

- [ ] **Step 1: Update the desktop home-page nav (in the `isHomePage` branch)**

Change:

```tsx
                <a href="#home" className="font-medium hover:text-primary transition-colors">Home</a>
                <a href="#about" className="font-medium hover:text-primary transition-colors">About Us</a>
                <a href="#activities" className="font-medium hover:text-primary transition-colors">Activities</a>
                <a href="#timeline" className="font-medium hover:text-primary transition-colors">Timeline</a>
```

to:

```tsx
                <a href="#home" className="font-medium hover:text-primary transition-colors">Home</a>
                <a href="#focus-area" className="font-medium hover:text-primary transition-colors">Our Focus Area</a>
                <a href="#timeline" className="font-medium hover:text-primary transition-colors">Timeline</a>
```

- [ ] **Step 2: Update the desktop other-page nav (the `else` branch)**

Change:

```tsx
                <Link href="/" className="font-medium hover:text-primary transition-colors">Home</Link>
                <Link href="/#about" className="font-medium hover:text-primary transition-colors">About Us</Link>
                <Link href="/#activities" className="font-medium hover:text-primary transition-colors">Activities</Link>
                <Link href="/#timeline" className="font-medium hover:text-primary transition-colors">Timeline</Link>
```

to:

```tsx
                <Link href="/" className="font-medium hover:text-primary transition-colors">Home</Link>
                <Link href="/#focus-area" className="font-medium hover:text-primary transition-colors">Our Focus Area</Link>
                <Link href="/#timeline" className="font-medium hover:text-primary transition-colors">Timeline</Link>
```

- [ ] **Step 3: Update the mobile home-page nav**

Change:

```tsx
                  <a 
                    href="#about" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    About Us
                  </a>
                  <a 
                    href="#activities" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Activities
                  </a>
```

to:

```tsx
                  <a 
                    href="#focus-area" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Our Focus Area
                  </a>
```

- [ ] **Step 4: Update the mobile other-page nav**

Change:

```tsx
                  <Link 
                    href="/#about" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/#activities" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Activities
                  </Link>
```

to:

```tsx
                  <Link 
                    href="/#focus-area" 
                    className="block py-2 px-4 text-sm hover:bg-accent rounded"
                    onClick={handleLinkClick}
                  >
                    Our Focus Area
                  </Link>
```

- [ ] **Step 5: Update `Footer.tsx`'s quick links**

Change:

```tsx
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Activities", href: "#activities" },
    { name: "Timeline", href: "#timeline" },
  ];
```

to:

```tsx
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Our Focus Area", href: "#focus-area" },
    { name: "Timeline", href: "#timeline" },
  ];
```

- [ ] **Step 6: Delete the superseded components**

```bash
git rm client/src/components/About.tsx client/src/components/Activities.tsx
```

- [ ] **Step 7: Verify it compiles and nothing else references the deleted files**

Run: `npm run check`
Expected: no TypeScript errors.

Run: `grep -rn "components/About\b\|components/Activities\b" client/src --include="*.tsx" --include="*.ts"`
Expected: no output (confirms no dangling imports).

- [ ] **Step 8: Commit**

```bash
git add client/src/components/Navbar.tsx client/src/components/Footer.tsx
git commit -m "feat: point nav/footer links at Our Focus Area, drop Activities links, remove old components"
```

---

### Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full TypeScript check**

Run: `npm run check`
Expected: exits 0 with no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: exits 0; `dist/public` is generated with no build errors.

- [ ] **Step 3: Start the dev server and smoke-test routes**

Run (background): `npm run dev`

Then:
```bash
curl -s http://localhost:5000/ | grep -o 'focus-area' 
curl -s http://localhost:5000/ | grep -c 'id="about"\|id="activities"'
curl -s http://localhost:5000/events/zenconnect-25 -o /dev/null -w '%{http_code}\n'
curl -s http://localhost:5000/events/data-trek -o /dev/null -w '%{http_code}\n'
curl -s http://localhost:5000/events/case-study-competition -o /dev/null -w '%{http_code}\n'
curl -s http://localhost:5000/events/datathon-2026 -o /dev/null -w '%{http_code}\n'
curl -s http://localhost:5000/events/not-a-real-event -o /dev/null -w '%{http_code}\n'
```
Expected: homepage HTML contains `focus-area` and does not contain `id="about"` or `id="activities"`; all four real event routes and the bogus one return `200` (SPA serves `index.html` for all paths — the "not found" state is rendered client-side, confirm visually or via a headless browser check if available).

Note: `npm run dev` serves via Vite's dev middleware behind the Express server (per `server/index.ts` / `vite.config.ts`), so exact port may differ — check terminal output for the actual URL if 5000 doesn't respond.

- [ ] **Step 4: Manual/visual pass** (if a browser tool is available in this environment)

- [ ] Load `/` — About Us section is gone, no blank gap where it was.
- [ ] "Our Focus Area" section appears in About's old visual style (background pattern, blobs, badge/heading/underline header, big gradient-icon cards) and shows exactly 6 cards, no "Join Our Community" block.
- [ ] Activities section is gone, no blank gap.
- [ ] Navbar (desktop + mobile) shows Home / Our Focus Area / Timeline / Team / Resources — no "Activities" link, "About Us" now points at `#focus-area`.
- [ ] Footer quick links match.
- [ ] Timeline still renders and animates as before; clicking any card (or its "Explore Event" row) navigates to `/events/<slug>`.
- [ ] Each event page shows dark background, navbar, footer, correct title/date/description/tags/location/image (or gradient fallback, since no real image files exist in the repo yet — see summary below).
- [ ] ZenConnect's page (`/events/zenconnect-25`) shows a "Register Now" button opening the placeholder URL from `client/src/config/registration.ts`.
- [ ] Other three event pages show no registration button.
- [ ] `/events/does-not-exist` shows the dark-themed "Event Not Found" state with a working back link.
- [ ] Resize to tablet/mobile widths — Focus Area grid, timeline, and event pages reflow correctly, no overflow.
- [ ] Browser console has no new errors on any of the above pages.

- [ ] **Step 5: Stop the dev server**

```bash
# kill the backgrounded npm run dev process
```

---

## Self-Review Notes

- **Spec coverage:** About Us removed (Task 6/7) → Focus Area restyled with only 6 cards (Task 4/6) → Join Our Community removed (Task 4 has no such block) → Activities removed (Task 6/7) → Explore Event buttons work via real internal `/events/:eventId` routes sourced from existing timeline data, no per-event components (Tasks 1, 3, 5, 6) → ZenConnect Register Now button, config-driven (Tasks 1, 5) → nav/anchors cleaned up, no dangling links (Task 7) → Navbar/Hero/Timeline visuals/Footer/colors/fonts untouched beyond the required link edits (all tasks explicitly scope edits to the minimum needed lines).
- **No fabricated event images**: the repo has no files under `public/images/`, so `event.image` paths (`/images/zenconnect.jpg` etc., unchanged from the original `Timeline.tsx`) will 404 and `EventImage` will show the existing gradient fallback — same behavior as today's Timeline cards. This is called out explicitly in the final summary to the user rather than silently masked.
- **`location` and `registrationUrl` fields are new** (no prior data existed for them) — flagged in the final summary as an assumption to review/edit.
