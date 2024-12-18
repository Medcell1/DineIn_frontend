import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu } from '@/@types'

interface MenuItemProps {
  menu: Menu
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

export function MenuItem({ menu, quantity, onAdd, onRemove }: MenuItemProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md"
    >
      <div className="relative aspect-video">
        <Image src={menu.image} alt={menu.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">{menu.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {menu.price.toFixed(2)} / {menu.measure}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">${(menu.price * quantity).toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onRemove} disabled={quantity === 0}>
              -
            </Button>
            <span>{quantity}</span>
            <Button variant="outline" size="icon" onClick={onAdd}>
              +
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

