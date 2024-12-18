import { getUserProfile } from "@/action/user"
import { AdminNav } from "../components/AdminNav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const user = await getUserProfile()
  
  return (
    
    <div className="min-h-screen bg-background">
      <header className="bg-background text-primary-foreground shadow"> 
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center mb-4">
          </div>
          <AdminNav image={user.image} name={user.name} />
        </div>
      </header>
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}
