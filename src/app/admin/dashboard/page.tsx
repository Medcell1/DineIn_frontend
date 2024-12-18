export const dynamic = "force-dynamic";

import { getUserStats } from "@/action/stat"
import DashboardPage from "../components/DashboardPage"



export default async function Dashboard() {
  const stat = await getUserStats();
  return (
  <DashboardPage stat={stat}/>
  )
}

