export interface InternalPartner {
  id: string;
  name: string;
  category?: string;
}

export interface ExternalPartner {
  id: string;
  name: string;
  description: string;
  industry?: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export interface PartnershipsContent {
  title: string;
  subtitle: string;
  description: string;
  internalPartners: InternalPartner[];
  externalPartners: ExternalPartner[];
}

export const DEFAULT_PARTNERSHIPS_CONTENT: PartnershipsContent = {
  title: "Partnerships",
  subtitle: "Collaborating with Industry & University Pillars",
  description:
    "We bridge the gap between classroom theory and real-world brand execution through strategic institutional alliances and corporate partnerships.",
  internalPartners: [
    {
      id: "strathmore-university",
      name: "Strathmore University",
      category: "Academic & Institutional Pillar",
    },
    {
      id: "strathmore-foundation",
      name: "Strathmore University Foundation",
      category: "Advancement & Endowment",
    },
    {
      id: "strathmore-communications",
      name: "Strathmore Communications Department",
      category: "Institutional Communications",
    },
    {
      id: "clubs-and-societies",
      name: "Clubs and Societies",
      category: "Student Life & Extracurriculars",
    },
    {
      id: "student-council",
      name: "Student Council",
      category: "Student Leadership & Governance",
    },
  ],
  externalPartners: [
    {
      id: "naivera",
      name: "Naivera",
      industry: "Fintech & Digital Engagement",
      description:
        "Gives the club real-world insight into modern marketing practices and connects members with valuable mentorship, offering hands-on understanding of branding and digital engagement.",
    },
    {
      id: "kcb",
      name: "KCB",
      industry: "Banking & Financial Services",
      description:
        "Supported the club's presence at THE 13TH and gave members exposure to professional, corporate-level marketing strategies within the banking industry.",
    },
    {
      id: "subaru",
      name: "Subaru",
      industry: "Automotive & Mobility",
      description:
        "Enabled an industrial visit and a presence at THE 13TH, giving members firsthand exposure to automotive brand positioning and experiential promotional strategies.",
    },
    {
      id: "nation-media",
      name: "Nation Media",
      industry: "Media & Broadcasting",
      description:
        "Offers insight into media-focused marketing, including advertising and communication strategies, deepening members' understanding of how media shapes brand visibility and public engagement.",
    },
  ],
};
