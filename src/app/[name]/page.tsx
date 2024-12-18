import { getRestaurant } from '@/action/restaurant';
import RestaurantPage from '@/components/RestaurantPage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamicParams = true;

// Page component
export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  try {
    const resolvedParams = await params; 
    const decodedName = decodeURIComponent(resolvedParams.name);
    const { user, menus } = await getRestaurant(decodedName);

    return <RestaurantPage restaurant={user} menus={menus} />;
  } catch (error) {
    console.error('Failed to fetch restaurant:', error);
    notFound();
  }
}

// Metadata generator
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params; // Resolve the Promise
    const decodedName = decodeURIComponent(resolvedParams.name);
    const { user } = await getRestaurant(decodedName);

    return {
      title: `${user.name} - Restaurant Details`,
      description: `Menu and details for ${user.name} located at ${user.location}`,
    };
  } catch {
    return {
      title: 'Restaurant Not Found',
      description: 'The requested restaurant could not be found',
    };
  }
}
