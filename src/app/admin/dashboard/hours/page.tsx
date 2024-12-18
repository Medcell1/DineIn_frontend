import { getWorkingHours } from "@/action/hours";
import WorkHoursPage from "../../components/HoursPage";
export const dynamic = "force-dynamic";

export default async function WorkHours() {
  

  const initialWorkHours = await getWorkingHours();

  return <WorkHoursPage initialWorkHours={initialWorkHours} />;
}