import { getUserProfile } from "@/action/user"
import ProfileForm from "../../components/ProfileForm"

export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const user = await getUserProfile()

  return (
    <div className="container mx-auto py-10 px-4">
      
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}

