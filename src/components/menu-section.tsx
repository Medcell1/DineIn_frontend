import { useState } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from './menu-item'
import { Menu } from '@/@types'

interface MenuSectionProps {
  menus: Menu[]
  cart: { [key: string]: number }
  addToCart: (menuId: string) => void
  removeFromCart: (menuId: string) => void
}

export function MenuSection({ menus, cart, addToCart, removeFromCart }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(menus.map((menu) => menu.category.name)))

  const filteredMenus = selectedCategory
    ? menus.filter((menu) => menu.category.name === selectedCategory)
    : menus

  return (
    <div className="flex-grow">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => (
          <MenuItem
            key={menu._id}
            menu={menu}
            quantity={cart[menu._id] || 0}
            onAdd={() => addToCart(menu._id)}
            onRemove={() => removeFromCart(menu._id)}
          />
        ))}
      </div>
    </div>
  )
}

