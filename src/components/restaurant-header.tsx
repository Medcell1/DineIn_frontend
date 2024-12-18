import { Restaurant } from '@/@types'
import { motion } from 'framer-motion'
import { Clock, MapPin, Phone } from 'lucide-react'

interface RestaurantHeaderProps {
  user: Restaurant
}

export function RestaurantHeader({ user }: RestaurantHeaderProps) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground border-b py-8 transition-colors"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{user.name}</h1>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>{user.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              {user.todayWorkingHours?.openTime} - {user.todayWorkingHours?.closeTime}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

