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

  insideEyebrow: string;
  insideTitleStart: string;
  insideTitleAccent: string;
  insideSubtitle: string;
  insideTile1Label: string;
  insideTile2Label: string;
  insideTile3Label: string;
  insideTile4Label: string;
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
    "We equip students with the strategic thinking, creative skills, and industry connections needed to thrive in the fast-evolving world of marketing. Through hands-on campaigns, workshops, and mentorship, we transform ambitious students into agency-ready professionals.",

  visionEyebrow: "Our Vision",
  visionTitle: "The Most Impactful",
  visionTitleAccent: "Student Marketing Hub",
  visionBody:
    "To be the leading student-run marketing organization in Africa, a launchpad where bold ideas become real campaigns, and where every member graduates with a portfolio, a network, and the confidence to lead.",

  storyEyebrow: "Est. 2014",
  storyHeading: "Our Story",
  storyParagraph1:
    "Founded in 2014 at Strathmore University, the Strathmore Marketing Club began as a small group of students passionate about bridging the gap between classroom theory and real-world marketing practice. What started as informal study sessions quickly grew into a full-fledged student organization.",
  storyParagraph2:
    "Today, SMC is the premier student-run marketing organization at Strathmore, giving members hands-on experience in branding, digital strategy, content creation, and campaign execution through partnerships with real brands and agencies across Kenya.",

  stat1Value: 30,
  stat1Label: "Active Members",
  stat2Value: 10,
  stat2Label: "Events Hosted",
  stat3Value: 5,
  stat3Label: "Industry Partners: Connecting students with the best",

  insideEyebrow: "Inside the Agency",
  insideTitleStart: "A Look at",
  insideTitleAccent: "What We Do",
  insideSubtitle:
    "From brand strategy sessions to live campaign shoots, here's a glimpse inside the SMC experience.",
  insideTile1Label: "Workshop Session",
  insideTile2Label: "Marketing Week Panel",
  insideTile3Label: "Pitch Day",
  insideTile4Label: "Team Bonding",
};
