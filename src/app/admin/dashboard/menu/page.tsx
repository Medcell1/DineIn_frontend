import { getCurrentUser } from "@/app/lib/get-session";
import { fetchMenuItemsByUser } from "@/action/menu";
import { fetchCategories } from "@/action/category";
import MenuDashboardClient from "../../components/MenuPage";
export const dynamic = "force-dynamic";
export default async function MenuDashboardServer({
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

    const user = await getCurrentUser();
    if (!user) {
      return <div>Unauthorized. Please log in.</div>;
    }

    const { menuItems, pagination } = await fetchMenuItemsByUser({
      search,
      page,
      limit: itemsPerPage,
    });

    const categories = await fetchCategories();

    return (
      <MenuDashboardClient
        initialMenuItems={menuItems}
        initialPagination={pagination}
        initialCategories={categories}
        initialSearch={search}
      />
    );
  } catch (error) {
    console.error("Error fetching menu dashboard data:", error);
    return <div>Error loading menu dashboard. Please try again later.</div>;
  }
}
