export interface PastEventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Flagship" | "Workshop" | "Networking" | "Competition" | "Agency Visit";
  date: string;
  location: string;
  attendanceCount: number;
  coverImageUrl: string;
  galleryUrls: string[];
  highlights: string[];
  keyTakeaways: string[];
  speakers: string[];
  partnerName?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  status: "PUBLISHED" | "DRAFT";
}

export const pastEventsData: PastEventData[] = [
  {
    id: "past-summit-2025",
    slug: "strathmore-marketing-summit-2025",
    title: "Strathmore Marketing Summit 2025",
    description:
      "Our premier annual conference uniting 350+ student marketers, CMOs, and agency founders across East Africa under the theme 'The Next Era of Brand Architecture & AI Creativity'.",
    category: "Flagship",
    date: "2025-11-14T09:00:00Z",
    location: "Strathmore Main Auditorium & Student Center",
    attendanceCount: 380,
    coverImageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
    ],
    highlights: [
      "Keynote addresses by 6 East African marketing executives",
      "Live AI prompt battle & campaign prototyping workshop",
      "Inter-university marketing pitch competition with KES 150,000 in prizes",
      "Executive recruitment booth with Ogilvy & Scanad talent leads",
    ],
    keyTakeaways: [
      "Brand loyalty in Gen-Z requires radical cultural authenticity over algorithmic push.",
      "Combining predictive analytics with emotive storytelling yields 3.4x higher conversion in Kenyan retail.",
      "Omnichannel strategy is no longer optional—unified customer data platforms are the standard.",
    ],
    speakers: [
      "Wanjiku Karanja — Group Head of Brand Strategy, Ogilvy Africa",
      "David Omondi — VP of Growth & Product Marketing, Wasoko",
      "Dr. Angela Ndegwa — Dean, Strathmore Business School",
      "Kevin Mwangi — Creative Director, Squad Digital",
    ],
    partnerName: "Ogilvy Africa & Strathmore Business School",
    testimonial:
      "The energy and tactical depth of Strathmore Marketing Club's summit rivaled established national advertising symposiums. Truly outstanding student leadership.",
    testimonialAuthor: "Wanjiku Karanja, Group Head of Brand Strategy, Ogilvy Africa",
    status: "PUBLISHED",
  },
  {
    id: "past-brand-sprint-2025",
    slug: "brand-sprint-hackathon-2025",
    title: "Brand Sprint: 24-Hour Strategy Hackathon",
    description:
      "12 student teams tackled a live brief from a leading fintech startup, building full visual identities, go-to-market strategies, and content engines in 24 intensive hours.",
    category: "Competition",
    date: "2025-09-27T10:00:00Z",
    location: "SBS Amphitheatre & Innovation Hub",
    attendanceCount: 95,
    coverImageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    ],
    highlights: [
      "Live mentorship from 8 senior brand strategists and art directors",
      "12 complete campaign pitch decks delivered within 24 hours",
      "Winning team received funded brand execution and agency internships",
    ],
    keyTakeaways: [
      "Rapid brand positioning frameworks cut deliberation time by 70%.",
      "Customer journey mapping uncovers hyper-localized friction points that standard surveys miss.",
      "Clear visual hierarchy and micro-copy drive 80% of onboarding conversions in digital banking.",
    ],
    speakers: [
      "Brian Bett — Product Lead, LipaLater",
      "Faith Mutheu — Senior Art Director, Dentsu Kenya",
    ],
    partnerName: "Safaricom & LipaLater",
    testimonial:
      "The student campaigns were sharp, thoroughly researched, and ready for market deployment on Monday morning.",
    testimonialAuthor: "Brian Bett, Product Lead",
    status: "PUBLISHED",
  },
  {
    id: "past-digital-masterclass-2025",
    slug: "performance-marketing-masterclass",
    title: "Performance Marketing & Growth Bootcamp",
    description:
      "A hands-on technical workshop where participants managed live ad budgets, structured Meta and Google campaigns, and analyzed attribution models.",
    category: "Workshop",
    date: "2025-06-18T14:00:00Z",
    location: "SBS Computer Lab 2",
    attendanceCount: 70,
    coverImageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    ],
    highlights: [
      "KES 50,000 real media spend managed live by student cohorts",
      "Deep dive into Looker Studio reporting and GA4 custom events",
      "100% of participants achieved Meta Certified Digital Marketing Associate readiness",
    ],
    keyTakeaways: [
      "Creative fatigue hits short-form ads within 7 to 10 days in the Kenyan market.",
      "Targeting broad audiences with strong creative anchors outperforms micro-segmented targeting in GA4.",
      "First-party email retention lists deliver the highest lifetime ROI.",
    ],
    speakers: [
      "Samson Kiprono — Growth Lead, Sendy",
      "Stacy Achieng — Paid Media Specialist, Google Kenya Partner Network",
    ],
    partnerName: "Google Partner Network",
    testimonial:
      "The most practical marketing lab I've attended at Strathmore. We built actual campaigns that generated sales in real-time.",
    testimonialAuthor: "Trevor Kimani, 3rd Year BCOM Marketing Student",
    status: "PUBLISHED",
  },
  {
    id: "past-agency-safari-2025",
    slug: "agency-safari-behind-the-scenes",
    title: "Agency Safari: Inside Nairobi's Top Creative Shops",
    description:
      "An exclusive industry expedition visiting Ogilvy Africa, Scanad, and Havas Africa, exploring production studios, pitch war-rooms, and executive Q&A sessions.",
    category: "Agency Visit",
    date: "2025-04-11T08:30:00Z",
    location: "Riverside Drive & Westlands Creative Hubs",
    attendanceCount: 50,
    coverImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    ],
    highlights: [
      "Behind-the-scenes access to television commercial soundstages",
      "Speed portfolio reviews by executive creative directors",
      "4 SMC members offered summer creative internships on the spot",
    ],
    keyTakeaways: [
      "Agency pitching is 90% theater and client empathy, 10% slide deck.",
      "Cross-functional fluency between copywriting, media buying, and motion graphics makes young marketers indispensable.",
    ],
    speakers: [
      "Christine Mathenge — Executive Creative Director, Scanad",
      "Mark Gitau — Head of Studio, Havas Africa",
    ],
    partnerName: "Scanad & Ogilvy Africa",
    testimonial:
      "Opening our studio doors to the Strathmore Marketing Club was inspiring. The level of curiosity and portfolio polish was remarkable.",
    testimonialAuthor: "Christine Mathenge, ECD Scanad",
    status: "PUBLISHED",
  },
  {
    id: "past-cmo-roundtable-2024",
    slug: "cmo-roundtable-2024",
    title: "CMO Roundtable: Building Cult Brands in Africa",
    description:
      "An intimate fireside dinner bringing together leading commercial directors and 40 selected student fellows to dissect consumer psychology and market expansion.",
    category: "Networking",
    date: "2024-10-25T18:00:00Z",
    location: "Strathmore Rooftop Pavilion",
    attendanceCount: 65,
    coverImageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    ],
    highlights: [
      "Fireside chat on scaling homegrown East African brands globally",
      "Structured networking rounds matching students with industry mentors",
      "Launch of the SMC Alumni Mentorship Guild",
    ],
    keyTakeaways: [
      "Great brands don't satisfy existing demand; they create new cultural rituals.",
      "Pricing power is earned through emotional resonance and unassailable brand trust.",
    ],
    speakers: [
      "Peter Njonjo — Co-founder & Brand Pioneer",
      "Brenda Chege — Regional Marketing Director, Diageo",
    ],
    partnerName: "Strathmore Alumni Relations",
    testimonial:
      "One of the highest-caliber networking dinners I have attended. SMC provides unmatched real-world exposure for its students.",
    testimonialAuthor: "Brenda Chege, Regional Marketing Director",
    status: "PUBLISHED",
  },
];
