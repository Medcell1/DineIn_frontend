'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

export function ErrorState() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container.current) {
      lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: '/animations/error-animation.json'
      })
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div ref={container} className="w-64 h-64 sm:w-96 sm:h-96"></div>
      <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-center">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mt-2 text-center">Please try again later</p>
    </div>
  )
}

