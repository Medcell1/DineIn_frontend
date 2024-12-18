import { fetchAllRestaurants } from "@/action/restaurant";
import HomePage from "@/components/HomePage";
export const dynamic = "force-dynamic";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  try {
    const resolvedSearchParams = await searchParams;

    const search = resolvedSearchParams?.search || "";
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
    const itemsPerPage = 10;

    const { restaurants, pagination } = await fetchAllRestaurants({
      search,
      page,
      limit: itemsPerPage,
    });

    return (
      <HomePage 
        initialRestaurants={restaurants} 
        pagination={pagination} 
      />
    );
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return <div>Error loading restaurants. Please try again later.</div>;
  }
}
