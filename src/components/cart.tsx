import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Menu } from '@/@types'

interface CartProps {
  items: Menu[]
  cart: { [key: string]: number }
  addToCart: (menuId: string) => void
  removeFromCart: (menuId: string) => void
  restaurantName: string
  restaurantPhone: string
}

export function Cart({ items, cart, addToCart, removeFromCart, restaurantName, restaurantPhone }: CartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const totalPrice = items ? items.reduce((sum, item) => sum + item.price * cart[item._id], 0) : 0
  const handleCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('items', JSON.stringify(items))
    localStorage.setItem('restaurantName', restaurantName)
    localStorage.setItem('restaurantPhone', restaurantPhone)
    
    router.push('/checkout')
  }
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 w-80 bg-background border border-border rounded-lg shadow-lg z-10"
          >
            <div className="p-4">
              <h3 className="font-semibold mb-4">Your Cart</h3>
              {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty</p>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => removeFromCart(item._id)}>
                          -
                        </Button>
                        <span>{cart[item._id]}</span>
                        <Button variant="outline" size="icon" onClick={() => addToCart(item._id)}>
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

