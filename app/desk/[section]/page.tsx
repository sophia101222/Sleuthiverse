import DeskSectionPage from "../section-page";

export function generateStaticParams() {
  return ["timeline", "people", "clues", "notes"].map(section => ({ section }));
}

export default async function DeskToolRoute({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <DeskSectionPage section={section} />;
}
