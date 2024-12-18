'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RestaurantHeader } from '@/components/restaurant-header'
import { MenuSection } from '@/components/menu-section'
import { Cart } from '@/components/cart'
import { Menu, Restaurant } from '@/@types'

interface RestaurantPageProps {
  restaurant: Restaurant
  menus: Menu[]
}

export default function RestaurantPage({ restaurant, menus }: RestaurantPageProps) {
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const addToCart = (menuId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [menuId]: (prevCart[menuId] || 0) + 1,
    }))
  }

  const removeFromCart = (menuId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      if (newCart[menuId] > 1) {
        newCart[menuId]--
      } else {
        delete newCart[menuId]
      }
      return newCart
    })
  }

  const cartItems = menus.filter((menu) => cart[menu._id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <RestaurantHeader user={restaurant} />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <MenuSection menus={menus} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
        <Cart 
          items={cartItems} 
          cart={cart} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart}
          restaurantName={restaurant.name}
          restaurantPhone={restaurant.phoneNumber}
        />
      </div>
    </motion.div>
  )
}

