export interface EventItem {
  id: string;
  tag: "Flagship" | "Workshop" | "Networking" | "Competition";
  title: string;
  date: string;
  /** ISO date for countdown — set to a near-future date for the next upcoming event */
  isoDate: string;
  time: string;
  location: string;
  spotsTotal: number;
  spotsTaken: number;
  desc: string;
  longDesc: string;
  host: string;
  agenda: string[];
}

export const events: EventItem[] = [
  {
    id: "marketing-week",
    tag: "Flagship",
    title: "Marketing Week",
    date: "September 15–19, 2026",
    isoDate: "2026-09-15T09:00:00",
    time: "9:00 AM – 5:00 PM",
    location: "Strathmore Auditorium",
    spotsTotal: 200,
    spotsTaken: 163,
    desc: "A week-long immersion featuring industry panels, brand challenges, and the annual pitch competition.",
    longDesc:
      "Marketing Week is SMC's flagship annual event — five days of intensive programming that brings together students, alumni, and industry professionals. Expect keynote talks from top agency leaders, live brand challenge rounds, portfolio review sessions, and the highly anticipated final-night pitch competition where teams present to a panel of CMOs. Past partners include Safaricom, EABL, and Ogilvy Africa.",
    host: "SMC Executive Council",
    agenda: [
      "Day 1 — Opening Keynote & Industry Panel",
      "Day 2 — Brand Challenge Briefing & Team Formation",
      "Day 3 — Workshops: SEO, Copywriting, Visual Storytelling",
      "Day 4 — Portfolio Reviews & Mentorship Sessions",
      "Day 5 — Final Pitch Competition & Awards Ceremony",
    ],
  },
  {
    id: "digital-strategy-bootcamp",
    tag: "Workshop",
    title: "Digital Strategy Bootcamp",
    date: "Monthly — Next: July 12, 2026",
    isoDate: "2026-07-12T10:00:00",
    time: "10:00 AM – 1:00 PM",
    location: "SBS Computer Lab 3",
    spotsTotal: 40,
    spotsTaken: 28,
    desc: "Hands-on sessions covering SEO, social media analytics, paid ads, and content calendars.",
    longDesc:
      "Our monthly Digital Strategy Bootcamp is a hands-on, laptop-required session where you learn by doing. Each month focuses on a different channel or skill — from Google Analytics and Meta Ads Manager to content calendar planning and influencer outreach strategy. You'll leave with templates and frameworks you can apply immediately to personal projects or internships.",
    host: "Director of Marketing",
    agenda: [
      "Intro: This month's channel deep-dive",
      "Live demo & guided walkthrough",
      "Hands-on exercise with real data",
      "Q&A + resource pack handout",
    ],
  },
  {
    id: "agency-nights",
    tag: "Networking",
    title: "Agency Nights",
    date: "Quarterly — Next: August 8, 2026",
    isoDate: "2026-08-08T18:00:00",
    time: "6:00 PM – 9:00 PM",
    location: "Strathmore Rooftop Lounge",
    spotsTotal: 60,
    spotsTaken: 45,
    desc: "Intimate evenings with agency leaders — hear their stories, ask your questions, make connections.",
    longDesc:
      "Agency Nights are SMC's signature networking events — small, curated evenings where 2–3 senior agency professionals share their career journeys, take unfiltered Q&A, and mingle with members over drinks and appetizers. Past guests have included Creative Directors from Scanad, Strategists from Wunderman Thompson, and founders of Nairobi's hottest digital-first agencies. Dress code: smart casual.",
    host: "Director of Partnerships",
    agenda: [
      "Welcome & introductions",
      "Fireside chat with guest speakers",
      "Open Q&A session",
      "Networking mixer with drinks & appetizers",
    ],
  },
  {
    id: "brand-challenge",
    tag: "Competition",
    title: "Brand Challenge",
    date: "Bi-Annual — Next: October 3, 2026",
    isoDate: "2026-10-03T09:00:00",
    time: "9:00 AM – 4:00 PM",
    location: "SBS Amphitheatre",
    spotsTotal: 80,
    spotsTaken: 52,
    desc: "Teams compete to solve a real brand brief. Winners present to the client's marketing team.",
    longDesc:
      "The Brand Challenge is a high-stakes, day-long competition where teams of 4–5 receive a real brief from a partner brand and have six hours to craft a full campaign strategy. From insight mining to creative execution, teams present their solutions to a judging panel that includes the client's marketing team. The winning team gets mentorship, internship fast-tracks, and recognition across SMC's channels.",
    host: "Director of Events",
    agenda: [
      "Brief reveal & team formation",
      "Research & strategy development (3 hrs)",
      "Creative execution & deck building (3 hrs)",
      "Team presentations (15 min each)",
      "Judging deliberation & awards",
    ],
  },
  {
    id: "content-creators-lab",
    tag: "Workshop",
    title: "Content Creators Lab",
    date: "Monthly — Next: June 28, 2026",
    isoDate: "2026-06-28T14:00:00",
    time: "2:00 PM – 5:00 PM",
    location: "Media Lab, SBS Building",
    spotsTotal: 30,
    spotsTaken: 22,
    desc: "Learn video editing, graphic design, and content production with hands-on tools and real briefs.",
    longDesc:
      "The Content Creators Lab is where SMC members build their production chops. Each session focuses on a creative tool or technique — from Canva and Figma for social graphics to CapCut and Premiere Pro for short-form video. You'll work on real briefs from SMC's content pipeline, and the best pieces get published on our official channels. Bring your laptop and creativity.",
    host: "Director of Creatives",
    agenda: [
      "Tool spotlight & creative brief",
      "Guided tutorial with live examples",
      "Hands-on creation session",
      "Peer review & feedback round",
    ],
  },
  {
    id: "market-research-clinic",
    tag: "Workshop",
    title: "Market Research Clinic",
    date: "Bi-Monthly — Next: July 25, 2026",
    isoDate: "2026-07-25T10:00:00",
    time: "10:00 AM – 12:30 PM",
    location: "SBS Seminar Room 2",
    spotsTotal: 35,
    spotsTaken: 18,
    desc: "Survey design, data analysis, and insight presentation — practical skills for real research projects.",
    longDesc:
      "The Market Research Clinic teaches the analytical side of marketing. You'll learn how to design effective surveys, conduct focus groups, analyse data with spreadsheets and basic tools, and present insights that actually drive decisions. Sessions alternate between technique workshops and live project clinics where you apply skills to SMC's ongoing research partnerships.",
    host: "Director of Research",
    agenda: [
      "Methodology overview & best practices",
      "Live walkthrough of a real project",
      "Hands-on exercise: design & analyse",
      "Insight presentation practice",
    ],
  },
];

/** Returns the next upcoming event (closest future isoDate) */
export function getNextEvent(): EventItem {
  const now = Date.now();
  const sorted = [...events]
    .filter((e) => new Date(e.isoDate).getTime() > now)
    .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
  return sorted[0] ?? events[0];
}

/** All unique tags for filter UI */
export const eventTags = ["All", "Flagship", "Workshop", "Networking", "Competition"] as const;
export type EventTag = (typeof eventTags)[number];
