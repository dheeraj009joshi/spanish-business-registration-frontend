"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

interface StatsCounterProps {
  value: number
  label: string
}

export function StatsCounter({ value, label }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const start = 0
    const duration = 2000
    const end = Math.min(value, 9999)

    // Get the time when animation is triggered
    const startTime = Date.now()

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Use easeOutQuad for smoother animation
      const easeProgress = 1 - (1 - progress) * (1 - progress)

      setCount(Math.floor(easeProgress * end))

      if (progress === 1) {
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, isInView])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">{count.toLocaleString()}+</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}
