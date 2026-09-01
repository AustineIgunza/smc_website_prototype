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

export const pastEventsData: PastEventData[] = [
  {
    id: "past-1788159220589",
    slug: "self-love-event",
    title: "Self-Love Event",
    description:
      "Collaboration with multiple clubs to promote self-awareness, confidence, and mental well-being through motivational talks, workshops, and a vendor fair. Approx. 200 attendees.",
    category: "Wellness",
    date: "2025-05-24T10:00:00Z",
    location: "Strathmore University",
    attendanceCount: 200,
    coverImageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
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
    id: "past-1788159301040",
    slug: "vc-run",
    title: "VC Run",
    description:
      "Fun run (2.5km–25km) held with Strathmore University to raise scholarship funds, featuring fitness challenges, trainer-led warm-ups, and live social media coverage.",
    category: "Fundraiser",
    date: "2025-06-14T06:30:00Z",
    location: "Strathmore University",
    attendanceCount: 100,
    coverImageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",
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
    id: "past-1788159429634",
    slug: "black-ticket-concert",
    title: "Black Ticket Concert",
    description:
      "Entertainment event with live performances by local and student artists, interactive audience sessions, and giveaways. Attracted over 150 students.",
    category: "Entertainment",
    date: "2025-07-19T18:00:00Z",
    location: "Strathmore University Auditorium",
    attendanceCount: 150,
    coverImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [],
    highlights: [
      "Live musical performances by local and student artists",
      "Interactive audience sessions and giveaways",
      "Over 150 student attendees",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Student Council",
    status: "PUBLISHED",
  },
  {
    id: "cmtisc0fw0005n8igwtr6f5av",
    slug: "drama-club-waiting-room",
    title: "Drama Club Show – Waiting Room",
    description:
      "Marketed and sold tickets for the drama society's play through video content and student outreach; the play ran for three consecutive days and was a success.",
    category: "Theatre & Arts",
    date: "2025-08-15T17:00:00Z",
    location: "Strathmore Auditorium",
    attendanceCount: 120,
    coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [],
    highlights: [
      "Promotional video campaign produced by SMC",
      "Ticket sales and audience outreach",
      "Three consecutive sold-out show nights",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "Strathmore Drama Society",
    status: "PUBLISHED",
  },
  {
    id: "past-1788159719256",
    slug: "mathare-visit-with-sesc",
    title: "Mathare Visit with SESC",
    description:
      "A combined CSR and team-building activity with children from Mathare, including donations, sustainable waste management workshops, team building at City Park, and gifts for the kids.",
    category: "CSR & Community",
    date: "2025-08-30T09:00:00Z",
    location: "City Park & Mathare, Nairobi",
    attendanceCount: 50,
    coverImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [],
    highlights: [
      "Donations distribution and gift giving",
      "Sustainable waste management workshop",
      "Team-building games at City Park",
    ],
    keyTakeaways: [],
    speakers: [],
    partnerName: "SESC",
    status: "PUBLISHED",
  },
  {
    id: "past-1788159758925",
    slug: "subaru-visit",
    title: "Subaru Visit",
    description:
      "Industrial visit to SubaruKe's Mombasa Road showroom and workshop with 40 students, covering car sales operations, servicing processes, and career opportunities in automotive sales.",
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
    id: "cmtisc0wi0008n8ig56m5mtcd",
    slug: "naivera-groundbreaking",
    title: "Naiverah Groundbreaking Event",
    description:
      "Attendance at Naiverah's groundbreaking event for their Membley, Ruiru apartment development, including a guided tour, an early-investment session, and a networking lunch.",
    category: "Industry Event",
    date: "2025-09-27T10:00:00Z",
    location: "Membley, Ruiru",
    attendanceCount: 30,
    coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
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
    id: "cmtisc11y0009n8ig4o5qt48d",
    slug: "deans-list-ceremony",
    title: "Dean's List Ceremony",
    description:
      "Supported the Student Council's Academics Docket by designing the event poster and marketing the ceremony, which recognized 500+ students for academic excellence.",
    category: "University Support",
    date: "2025-10-10T14:00:00Z",
    location: "Strathmore University",
    attendanceCount: 500,
    coverImageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",
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
    id: "past-1788160203431",
    slug: "ai-students-summit",
    title: "AI Students Summit",
    description:
      "A 2-day event featuring panel discussions and a full-day hackathon; the club led event marketing, video creation, and digital promotion, driving high participation and visibility.",
    category: "Summit",
    date: "2025-10-24T09:00:00Z",
    location: "Strathmore University",
    attendanceCount: 150,
    coverImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
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
    id: "cmtisc1cu000bn8igfhmmabel",
    slug: "clubs-and-sports-fair",
    title: "Clubs & Sports Fair",
    description:
      "Showcased club activities and opened recruitment for the new semester, engaging 56 students and recording one of the club's highest engagement days.",
    category: "Recruitment",
    date: "2025-11-07T09:00:00Z",
    location: "Strathmore University",
    attendanceCount: 56,
    coverImageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
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
    id: "past-1788159999850",
    slug: "campus-currency",
    title: "Campus Currency",
    description:
      "Collaborated with SBC to market their Campus Currency event through content creation, increasing Instagram visibility and driving signups.",
    category: "Marketing Campaign",
    date: "2025-11-14T10:00:00Z",
    location: "Strathmore University",
    attendanceCount: 80,
    coverImageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
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
    id: "cmtisc1nn000dn8ig2nc13z7f",
    slug: "the-13th",
    title: "THE 13TH – Roundtables and Fair",
    description:
      "The club's flagship collaboration with Strathmore University, bringing together 250–300 students and 48 exhibitors across roundtables, a fair, and a panel discussion on branding, leadership, and digital marketing.",
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
