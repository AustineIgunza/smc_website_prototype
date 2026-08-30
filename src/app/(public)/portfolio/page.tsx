import Portfolio from "@/components/Portfolio";
import { getPartnershipsContent } from "@/lib/partnerships-content";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const partnershipsContent = await getPartnershipsContent();
  return <Portfolio partnershipsContent={partnershipsContent} />;
}
