import { StopList } from "@/features/stop-list/ui/StopList";

/** Серверная страница: читает фильтры из URL и рендерит стоп-лист. */
export default async function Home({ searchParams }: PageProps<"/">) {
  const { shop, status } = await searchParams;

  return (
    <main>
      <StopList shop={shop} status={status} />
    </main>
  );
}
