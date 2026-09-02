export interface PastEventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
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

// The 2024/2025 slate — 12 events run in 7 months, culminating in THE 13TH.
// Images (where available) live in /public/events and are extracted from
// the Strathmore Marketing Club website PDF.
export const pastEventsData: PastEventData[] = [
  {
    id: "past-self-love-event",
    slug: "self-love-event",
    title: "Self-Love Event",
    description:
      "Collaboration with multiple clubs promoting self-awareness, confidence and mental well-being through motivational talks, workshops and a vendor fair.",
    category: "Wellness",
    date: "2025-05-24T10:00:00Z",
    location: "Strathmore University",
    attendanceCount: 200,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Motivational talks on self-awareness and confidence",
      "Workshops on mental well-being",
      "Vendor fair with student-run brands",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Clubs and Societies",
    status: "PUBLISHED",
  },
  {
    id: "past-vc-run",
    slug: "vc-run",
    title: "VC Run",
    description:
      "Fun run (2.5km–25km) held with Strathmore University to raise scholarship funds, featuring fitness challenges, trainer-led warm-ups and live social media coverage.",
    category: "Fundraiser",
    date: "2025-06-14T06:30:00Z",
    location: "Strathmore University",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Distance options from 2.5km up to 25km",
      "Fitness challenges and trainer-led warm-ups",
      "Live social media coverage of the run",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Strathmore University",
    status: "PUBLISHED",
  },
  {
    id: "past-black-ticket-concert",
    slug: "black-ticket-concert",
    title: "Black Ticket Concert",
    description:
      "Live performances by local and student artists, with interactive audience sessions and giveaways.",
    category: "Entertainment",
    date: "2025-07-05T18:00:00Z",
    location: "Strathmore University",
    attendanceCount: 150,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Live performances by local and student artists",
      "Interactive audience sessions",
      "On-stage giveaways",
    ],
    keyTakeaways: [],
    speakers: [],
    status: "PUBLISHED",
  },
  {
    id: "past-drama-waiting-room",
    slug: "drama-club-waiting-room",
    title: "Drama Club Show — Waiting Room",
    description:
      "Marketed and sold tickets for the drama society's play through video content and student outreach; ran three consecutive days.",
    category: "Marketing Campaign",
    date: "2025-07-19T18:00:00Z",
    location: "Strathmore University",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Video content produced to promote the play",
      "Ticket sales handled end-to-end by SMC",
      "Three consecutive show nights",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Drama Society",
    status: "PUBLISHED",
  },
  {
    id: "past-mathare-visit",
    slug: "mathare-visit-with-sesc",
    title: "Mathare Visit with SESC",
    description:
      "Combined CSR and team-building activity with children from Mathare — donations, sustainable waste management workshops, team building at City Park and gifts for the kids.",
    category: "CSR",
    date: "2025-08-16T09:00:00Z",
    location: "Mathare & City Park, Nairobi",
    attendanceCount: 0,
    coverImageUrl: "/events/mathare-kids-bus.jpg",
    galleryUrls: ["/events/mathare-kids-bus.jpg", "/events/city-park-swing.jpg"],
    highlights: [
      "Donations for children from Mathare",
      "Sustainable waste management workshop",
      "Team building activities at City Park",
      "Gifts distributed to the kids",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "SESC",
    status: "PUBLISHED",
  },
  {
    id: "past-subaru-visit",
    slug: "subaru-visit",
    title: "Subaru Visit",
    description:
      "Visit to SubaruKe's Mombasa Road showroom and workshop, covering car sales operations, servicing processes and careers in automotive sales.",
    category: "Industrial Visit",
    date: "2025-09-06T09:30:00Z",
    location: "SubaruKe Showroom, Mombasa Road, Nairobi",
    attendanceCount: 40,
    coverImageUrl: "/events/subaru-showroom.jpg",
    galleryUrls: [
      "/events/subaru-showroom.jpg",
      "/events/subaru-group-1.jpg",
      "/events/subaru-group-2.jpg",
    ],
    highlights: [
      "Walkthrough of car sales operations",
      "Behind-the-scenes look at the servicing workshop",
      "Careers session on automotive sales",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Subaru",
    status: "PUBLISHED",
  },
  {
    id: "past-naivera-groundbreaking",
    slug: "naivera-groundbreaking",
    title: "Naivera Groundbreaking Event",
    description:
      "Attendance at Naivera's groundbreaking for their Membley, Ruiru apartment development — guided tour, early-investment session and networking lunch.",
    category: "Industry Event",
    date: "2025-09-27T10:00:00Z",
    location: "Membley, Ruiru",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Guided tour of the development site",
      "Early-investment session with the Naivera team",
      "Networking lunch with attendees",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Naivera",
    status: "PUBLISHED",
  },
  {
    id: "past-deans-list-ceremony",
    slug: "deans-list-ceremony",
    title: "Dean's List Ceremony",
    description:
      "Supported the Student Council's Academics Docket with poster design and event marketing; recognised 500+ students for academic excellence.",
    category: "University Support",
    date: "2025-10-10T14:00:00Z",
    location: "Strathmore University",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Poster design for the ceremony",
      "Event marketing across student channels",
      "Recognised 500+ students for academic excellence",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Student Council",
    status: "PUBLISHED",
  },
  {
    id: "past-ai-students-summit",
    slug: "ai-students-summit",
    title: "AI Students Summit",
    description:
      "Two-day event with panel discussions and a full-day hackathon; the club led event marketing, video creation and digital promotion.",
    category: "Summit",
    date: "2025-10-24T09:00:00Z",
    location: "Strathmore University",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Two-day programme with panel discussions",
      "Full-day hackathon",
      "SMC led event marketing, video creation and digital promotion",
    ],
    keyTakeaways: [],
    speakers: [],
    status: "PUBLISHED",
  },
  {
    id: "past-clubs-sports-fair",
    slug: "clubs-and-sports-fair",
    title: "Clubs & Sports Fair",
    description:
      "Showcased club activities and opened recruitment for the new semester — one of the club's highest engagement days.",
    category: "Recruitment",
    date: "2025-11-07T09:00:00Z",
    location: "Strathmore University",
    attendanceCount: 56,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Showcased club activities to the student body",
      "Opened recruitment for the new semester",
      "One of the club's highest engagement days",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Clubs and Societies",
    status: "PUBLISHED",
  },
  {
    id: "past-campus-currency",
    slug: "campus-currency",
    title: "Campus Currency",
    description:
      "Collaborated with SBC on content creation — increased Instagram visibility and drove signups.",
    category: "Marketing Campaign",
    date: "2025-11-14T10:00:00Z",
    location: "Strathmore University",
    attendanceCount: 0,
    coverImageUrl: "",
    galleryUrls: [],
    highlights: [
      "Content created in collaboration with SBC",
      "Increased Instagram visibility",
      "Drove signups for the initiative",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "SBC",
    status: "PUBLISHED",
  },
  {
    id: "past-the-13th",
    slug: "the-13th",
    title: "THE 13TH — Roundtables and Fair",
    description:
      "Flagship collaboration with Strathmore University — roundtables, a fair and a panel discussion on branding, leadership and digital marketing. 250–300 attendees and 48 exhibitors.",
    category: "Flagship",
    date: "2025-11-28T09:00:00Z",
    location: "Strathmore University",
    attendanceCount: 300,
    coverImageUrl: "/events/the13th-panel.jpg",
    galleryUrls: [
      "/events/the13th-panel.jpg",
      "/events/the13th-audience-1.jpg",
      "/events/the13th-audience-2.jpg",
      "/events/the13th-roundtable.jpg",
    ],
    highlights: [
      "48 exhibitors across the fair",
      "Roundtables on branding, leadership and digital marketing",
      "Panel discussion with industry leaders",
      "250–300 attendees across the day",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Strathmore University, KCB, Subaru",
    status: "PUBLISHED",
  },
];
