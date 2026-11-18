import WorkshopSectionPage from "../section-page";

export function generateStaticParams() {
  return ["worldbuilding", "timeline", "characters", "objects", "plot", "clues", "notes"].map(section => ({ section }));
}

export default async function WorkshopToolRoute({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <WorkshopSectionPage section={section} />;
}
