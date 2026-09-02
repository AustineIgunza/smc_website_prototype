export interface Benefit {
  id: string;
  icon: string; // pre-defined icon mapping key (e.g. 'target', 'brain', 'handshake', 'trophy', 'chart', 'palette')
  title: string;
  desc: string;
  longDesc?: string;
  highlights?: string[];
}

export interface JoinStep {
  num: string;
  title: string;
  desc: string;
  screenshotUrl?: string | null;
}

export interface MembershipContent {
  title: string;
  subtitle: string;
  description: string;
  joinTitle: string;
  joinDescription: string;
  joinCtaLabel: string;
  joinCtaHref: string;
  benefits: Benefit[];
  joinSteps: JoinStep[];
}

export const DEFAULT_MEMBERSHIP_CONTENT: MembershipContent = {
  title: "Membership",
  subtitle: "Why Join SMC?",
  description: "Membership isn't just a card — it's access to a launchpad that accelerates your marketing career from day one.",
  joinTitle: "How to Join",
  joinDescription: "Official registration is completed via Strathmore University's club portal. Click the button below to visit the portal and follow the simple steps below.",
  joinCtaLabel: "Visit clubs.strathmore.edu",
  joinCtaHref: "https://clubs.strathmore.edu",
  benefits: [
    {
      id: "industry-exposure",
      icon: "target",
      title: "Real Industry Exposure",
      desc: "Members gain hands-on access to corporates like KCB, Subaru, Nation Media, and Naivera, covering banking, automotive, media, and real estate marketing.",
    },
    {
      id: "portfolio-building",
      icon: "palette",
      title: "Hands-on Portfolio Building",
      desc: "From producing promo videos to running social campaigns, members build tangible, real-world marketing work for their portfolios.",
    },
    {
      id: "leadership-execution",
      icon: "trophy",
      title: "Leadership & Event Execution Skills",
      desc: "Organizing 12 events in 7 months, including THE 13TH with 250–300 attendees, builds genuine project management experience.",
    },
    {
      id: "networking",
      icon: "handshake",
      title: "Networking with Professionals & Peers",
      desc: "Roundtables, panel discussions, and industrial visits connect members directly with industry professionals and the wider student community.",
    },
    {
      id: "community-growth",
      icon: "brain",
      title: "Community Impact & Personal Growth",
      desc: "Initiatives like the Mathare CSR visit and the Self-Love Event let members develop interpersonal skills while making a genuine difference beyond campus.",
    },
  ],
  joinSteps: [
    {
      num: "01",
      title: "Visit the Portal",
      desc: "Click the link above to head over to the Strathmore Clubs website.",
      screenshotUrl: null,
    },
    {
      num: "02",
      title: "Sign In",
      desc: "Log in with your university student credentials to access your dashboard.",
      screenshotUrl: null,
    },
    {
      num: "03",
      title: "Search for SMC",
      desc: "Navigate to the Clubs directory and search for 'Strathmore Marketing Club'.",
      screenshotUrl: null,
    },
    {
      num: "04",
      title: "Send Request",
      desc: "Click 'Join' to submit your application. You will be notified once approved!",
      screenshotUrl: null,
    },
  ],
};
