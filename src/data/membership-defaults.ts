export interface Benefit {
  id: string;
  icon: string; // pre-defined icon mapping key (e.g. 'target', 'brain', 'handshake', 'trophy', 'chart', 'palette')
  title: string;
  desc: string;
  longDesc: string;
  highlights: string[];
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
      id: "live-campaigns",
      icon: "target",
      title: "Live Campaigns",
      desc: "Work on real briefs from real brands — build a portfolio that speaks for itself.",
      longDesc:
        "As an SMC member, you get to work on live marketing briefs from partner brands and organisations. These aren't classroom simulations — they're real projects with real stakeholders, real deadlines, and real impact. Past campaigns have included social media takeovers, brand identity projects, market research studies, and event marketing initiatives. Every project you complete becomes a portfolio piece you can show to future employers.",
      highlights: [
        "Work with real brands like campus businesses and Nairobi startups",
        "Build a professional portfolio before graduation",
        "Get mentored by senior members throughout the project",
        "Present your work to actual clients and stakeholders",
      ],
    },
    {
      id: "workshops",
      icon: "brain",
      title: "Workshops & Masterclasses",
      desc: "Learn from industry professionals in branding, analytics, copywriting, and more.",
      longDesc:
        "Our monthly workshops and masterclasses cover every facet of modern marketing — from SEO and Google Analytics to copywriting, brand strategy, and paid advertising. Sessions are led by a mix of industry professionals, alumni, and experienced senior members. Every workshop includes hands-on exercises so you leave with practical skills, not just theory. We also run specialised bootcamps during semester breaks for deep dives into specific topics.",
      highlights: [
        "Monthly sessions covering digital, creative, and strategic marketing",
        "Led by industry professionals and experienced alumni",
        "Hands-on exercises with real tools (Google Analytics, Meta Ads, Canva, Figma)",
        "Certificate of participation for your CV",
      ],
    },
    {
      id: "networking",
      icon: "handshake",
      title: "Networking",
      desc: "Connect with alumni, agency leaders, and fellow marketing enthusiasts across Kenya.",
      longDesc:
        "SMC's network extends far beyond Strathmore's campus. Through our Agency Nights, alumni mixers, and industry partnerships, you'll build relationships with marketing professionals across Kenya's advertising and brand landscape. Many of our members have landed internships and jobs through connections made at SMC events. Our alumni network includes professionals at agencies like Ogilvy, Scanad, and WPP Scangroup, as well as in-house marketers at leading Kenyan companies.",
      highlights: [
        "Quarterly Agency Nights with senior marketing professionals",
        "Alumni mentorship programme pairing you with industry veterans",
        "Access to SMC's private LinkedIn and WhatsApp communities",
        "Invitations to exclusive industry events and conferences",
      ],
    },
    {
      id: "competitions",
      icon: "trophy",
      title: "Competitions",
      desc: "Represent Strathmore in national and pan-African marketing competitions.",
      longDesc:
        "Compete against the best marketing students in Kenya and beyond. SMC regularly fields teams for national and regional marketing competitions, where you'll tackle real brand briefs under time pressure and present to panels of industry judges. Competing sharpens your strategic thinking, teamwork, and presentation skills like nothing else. Our teams have consistently placed in the top three at national competitions.",
      highlights: [
        "National Brand challenge — annual inter-university competition",
        "Ad:Venture by EABL — East Africa's largest student marketing challenge",
        "Internal pitch competitions as preparation ground",
        "Coaching and mentorship from previous competition winners",
      ],
    },
    {
      id: "career-access",
      icon: "chart",
      title: "Career Access",
      desc: "Exclusive internship pipelines and mentorship from marketing professionals.",
      longDesc:
        "SMC isn't just a club — it's a career accelerator. We maintain active relationships with agencies, corporates, and startups who come to us first when they have internship and entry-level openings. Our members get priority access to these opportunities through our internal jobs board and direct referrals. The mentorship programme pairs you with a working professional who guides your career development throughout the year.",
      highlights: [
        "Exclusive internship listings from partner organisations",
        "1-on-1 mentorship with marketing professionals",
        "CV review and LinkedIn profile optimisation workshops",
        "Mock interview sessions with industry recruiters",
      ],
    },
    {
      id: "creative-freedom",
      icon: "palette",
      title: "Creative Freedom",
      desc: "Pitch ideas, lead projects, and bring your creative vision to life with a team behind you.",
      longDesc:
        "At SMC, every member has a voice. Got an idea for a content series? Pitch it. Want to organise a themed networking event? Lead it. Our flat creative culture means you don't need to wait years for a leadership role — you can propose and run projects from your very first semester. The executive team and senior members are there to support, not gatekeep. This is where you experiment, fail fast, learn faster, and build the confidence to lead.",
      highlights: [
        "Open pitch sessions where any member can propose projects",
        "Creative committees you can join or form around your interests",
        "Access to design tools, content creation resources, and studio space",
        "Freedom to experiment with new formats, platforms, and ideas",
      ],
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
