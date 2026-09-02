// Default homepage copy. Renders if the HomeContent table is empty or
// the DB is unreachable. Admins edit the live values via /admin/home.
export interface HomeContent {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;

  missionEyebrow: string;
  missionTitle: string;
  missionTitleAccent: string;
  missionBody: string;

  visionEyebrow: string;
  visionTitle: string;
  visionTitleAccent: string;
  visionBody: string;

  storyEyebrow: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;

  stat1Value: number;
  stat1Label: string;
  stat2Value: number;
  stat2Label: string;
  stat3Value: number;
  stat3Label: string;

  insideTile1Label: string;
  insideTile2Label: string;
  insideTile3Label: string;
  insideTile4Label: string;
  insideTile1Image: string | null;
  insideTile2Image: string | null;
  insideTile3Image: string | null;
  insideTile4Image: string | null;
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroEyebrow: "The Future of Marketing",
  heroTitleLine1: "Strathmore",
  heroTitleLine2: "Marketing",
  heroTitleAccent: "Club",
  heroSubtitle:
    "Where Strategy Meets Creativity. Empowering the next generation of marketing visionaries.",
  heroPrimaryCtaLabel: "Join the Club",
  heroPrimaryCtaHref: "/membership",
  heroSecondaryCtaLabel: "Explore Our Work",
  heroSecondaryCtaHref: "/portfolio",

  missionEyebrow: "Our Mission",
  missionTitle: "Building Marketing Leaders",
  missionTitleAccent: "From the Ground Up",
  missionBody:
    "Educate, inspire and equip members with the tools and support needed to secure exciting employment opportunities, thrive in entrepreneurship, and become world-class leaders in the field of marketing.",

  visionEyebrow: "Our Vision",
  visionTitle: "The Driving Force Behind",
  visionTitleAccent: "Student Entrepreneurship",
  visionBody:
    "Be the driving force behind student entrepreneurship in Strathmore and the next generation of marketing professionals and thought leaders in Kenya.",

  storyEyebrow: "Rebuilt in 2024/2025",
  storyHeading: "Our Story",
  storyParagraph1:
    "The club entered the 2024/2025 academic year in a unique position. After a period of inactivity in previous years, it was revived through the leadership of Kennedy Karanja, who rebuilt its foundation before graduating. When the current Executive Team took office in May 2025, the club had no registered members, no active projects, and no existing partnerships — they started completely from the ground up.",
  storyParagraph2:
    "Through focused recruitment, visibility efforts, and consistent engagement, the club grew to 53 members and ran 12 events within just seven months, culminating in THE 13TH as its biggest and most successful partnership to date.",

  stat1Value: 53,
  stat1Label: "Active Members",
  stat2Value: 12,
  stat2Label: "Events in 7 Months",
  stat3Value: 4,
  stat3Label: "External Partners",

  insideTile1Label: "THE 13TH — Panel",
  insideTile2Label: "THE 13TH — Audience",
  insideTile3Label: "Subaru Visit",
  insideTile4Label: "Mathare CSR Visit",
  insideTile1Image: "/events/the13th-panel.jpg",
  insideTile2Image: "/events/the13th-audience-1.jpg",
  insideTile3Image: "/events/subaru-group-2.jpg",
  insideTile4Image: "/events/mathare-kids-bus.jpg",
};
