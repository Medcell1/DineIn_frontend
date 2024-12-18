import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RestaurantCardProps {
  id: string
  name: string
  image: string
  isOpen: boolean
}

export function RestaurantCard({  name, image, isOpen }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
          {!isOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg font-semibold px-3 py-1">
                Closed
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start gap-2">
        <h2 className="text-lg font-semibold line-clamp-1">{name}</h2>
        <div className="flex items-center justify-between w-full">
          <Badge variant={isOpen ? "default" : "secondary"} className="text-xs">
            {isOpen ? "Open" : "Closed"}
          </Badge>
          {isOpen ? (
            <Link href={`/${name}`} passHref>
              <Button variant="outline" size="sm">
                View Menu
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              View Menu
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

