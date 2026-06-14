import HeroHome from "@/components/home/HeroHome";
import MissionVision from "@/components/home/MissionVision";
import OurStory from "@/components/home/OurStory";
import InsideAgency from "@/components/home/InsideAgency";
import { getHomeContent } from "@/lib/home-content";

export default async function Home() {
  const content = await getHomeContent();
  return (
    <>
      <HeroHome content={content} />
      <MissionVision content={content} />
      <OurStory content={content} />
      <InsideAgency content={content} />
    </>
  );
}
