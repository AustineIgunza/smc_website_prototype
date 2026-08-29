import Membership from "@/components/Membership";
import { getMembershipContent } from "@/lib/membership-content";

export default async function MembershipPage() {
  const content = await getMembershipContent();
  return <Membership content={content} />;
}
