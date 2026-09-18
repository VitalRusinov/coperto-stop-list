import { StopList } from "@/features/stop-list/ui/StopList";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { shop, status } = await searchParams;

  return (
    <main>
      <StopList shop={shop} status={status} />
    </main>
  );
}
