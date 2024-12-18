'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Menu } from '@/@types'

export default function CheckoutPage() {
  const router = useRouter()
  
  // State for cart and restaurant details
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [items, setItems] = useState<Menu[]>([])
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')

  // State for form inputs
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    const storedItems = localStorage.getItem('items')
    const storedRestaurantName = localStorage.getItem('restaurantName')
    const storedRestaurantPhone = localStorage.getItem('restaurantPhone')

    if (!storedCart || !storedItems) {
      router.push(`/${restaurantName}`)
      return
    }

    try {
      setCart(JSON.parse(storedCart))
      setItems(JSON.parse(storedItems))
      setRestaurantName(storedRestaurantName || '')
      setRestaurantPhone(storedRestaurantPhone || '')
    } catch (error) {
      console.error('Error parsing stored cart data:', error)
      router.push('/menu')
    }
  }, [router])

  // Calculate total price safely
  const totalPrice = items.reduce((sum, item) => {
    // Ensure item exists in cart and has a valid quantity
    const quantity = cart[item._id] || 0
    return sum + (item.price * quantity)
  }, 0)

  // Generate WhatsApp message for order
  const generateWhatsAppMessage = () => {
    const orderDetails = items
      .filter(item => cart[item._id] > 0)
      .map(item => 
        `${item.name} x${cart[item._id]} - $${(item.price * cart[item._id]).toFixed(2)}`
      )
      .join('\n')

    const message = `
New order for ${restaurantName}:

Customer Details:
Name: ${name}
Address: ${address}
Phone: ${phone}

Order:
${orderDetails}

Total: $${totalPrice.toFixed(2)}

Additional Notes:
${notes}
    `.trim()

    return encodeURIComponent(message)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form inputs
    if (!name || !address || !phone) {
      alert('Please fill in all required fields')
      return
    }

    // Generate WhatsApp link
    const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${generateWhatsAppMessage()}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Optionally clear cart after submission
    localStorage.removeItem('cart')
    localStorage.removeItem('items')
  }

  // Prevent rendering if no items in cart
  if (items.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground py-8"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Textarea
                placeholder="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Place Order via WhatsApp
              </Button>
            </form>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm">
              {items.map((item) => (
                cart[item._id] > 0 && (
                  <div key={item._id} className="flex justify-between items-center mb-2">
                    <span>{item.name} x{cart[item._id]}</span>
                    <span>${(item.price * cart[item._id]).toFixed(2)}</span>
                  </div>
                )
              ))}
              <div className="border-t border-border mt-4 pt-4 font-semibold">
                <div className="flex justify-between items-center">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}