"use client"

import { Clock, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: "clock" | "shield" | "users"
  title: string
  description: string
  color: "blue" | "green" | "purple"
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      shadow: "shadow-blue-100/50",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      shadow: "shadow-green-100/50",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      shadow: "shadow-purple-100/50",
    },
  }

  const IconComponent = {
    clock: Clock,
    shield: Shield,
    users: Users,
  }[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div
        className={cn(
          "p-8 rounded-2xl border transition-all duration-300",
          colorStyles[color].bg,
          colorStyles[color].border,
          "hover:shadow-xl",
          colorStyles[color].shadow,
        )}
      >
        <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center mb-6", "bg-white")}>
          <IconComponent className={cn("w-8 h-8", colorStyles[color].text)} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}
