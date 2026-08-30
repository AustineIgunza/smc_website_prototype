export interface Benefit {
  id: string;
  iconName: string;
  title: string;
  desc: string;
  longDesc?: string;
  highlights?: string[];
}

export const benefits: Benefit[] = [
  {
    id: "industry-exposure",
    iconName: "target",
    title: "Real Industry Exposure",
    desc: "Members gain hands on access to corporates like KCB, Subaru, Nation Media and Naivera, covering banking, automotive, media and real estate marketing.",
  },
  {
    id: "portfolio-building",
    iconName: "palette",
    title: "Hands-on Portfolio Building",
    desc: "From producing promo videos to running social campaigns, members build tangible, real-world marketing work for their portfolios.",
  },
  {
    id: "leadership-execution",
    iconName: "trophy",
    title: "Leadership and Event Execution Skills",
    desc: "Organizing 12 events in 7 months including THE 13TH with 250-300 attendees, builds genuine project management experience.",
  },
  {
    id: "networking",
    iconName: "handshake",
    title: "Networking with Professionals and Peers",
    desc: "Roundtables, panel discussions and industrial visits connect members directly with industry professionals and the wider student community.",
  },
  {
    id: "community-growth",
    iconName: "brain",
    title: "Community Impact and Personal Growth",
    desc: "Initiatives like the Mathare CSR visit and the Self-Love Event let members develop interpersonal skills while making a genuine difference beyond campus.",
  },
];
