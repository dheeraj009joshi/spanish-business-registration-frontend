"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, ArrowRight, Headphones, UserCheck } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  icon: "file-text" | "users" | "message-circle"
  title: string
  description: string
  features: string[]
  ctaText: string
  ctaLink: string
  color: "blue" | "green" | "emerald" | "purple"
  popular?: boolean
  popularText?: string
  isExternal?: boolean
}

export function ServiceCard({
  icon,
  title,
  description,
  features,
  ctaText,
  ctaLink,
  color,
  popular = false,
  popularText = "Most Popular",
  isExternal = false,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorStyles = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-200",
      hover: "hover:border-blue-300 hover:shadow-blue-100/50",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      border: "border-green-200",
      hover: "hover:border-green-300 hover:shadow-green-100/50",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700",
      border: "border-emerald-200",
      hover: "hover:border-emerald-300 hover:shadow-emerald-100/50",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-200",
      hover: "hover:border-purple-300 hover:shadow-purple-100/50",
    },
  }

  const IconComponent = {
    "file-text": FileText,
    users: UserCheck, // Changed to UserCheck for assisted service
    "message-circle": Headphones, // Changed to Headphones for WhatsApp support
  }[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("pt-5", popular && "pt-8")}
    >
      <Card
        className={cn(
          "relative overflow-visible transition-all duration-300 border-2 h-full flex flex-col mt-4",
          popular ? colorStyles[color].border : "border-transparent",
          colorStyles[color].hover,
          isHovered ? "shadow-xl transform -translate-y-1" : "shadow-md",
        )}
      >
        {popular && (
          <div className="absolute -top-3 left-0 w-full flex justify-center z-10">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 shadow-lg">
              {popularText}
            </Badge>
          </div>
        )}

        <CardHeader className={cn("pt-8", popular && "pt-8")}>
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4", colorStyles[color].bg)}>
            <IconComponent className={cn("w-7 h-7", colorStyles[color].text)} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">
          <div className="space-y-3 mb-6 flex-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {isExternal ? (
            <Button
              className={cn("w-full group", colorStyles[color].button)}
              onClick={() => window.open(ctaLink, "_blank")}
            >
              {ctaText}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Link href={ctaLink} className="w-full">
              <Button className={cn("w-full group", colorStyles[color].button)}>
                {ctaText}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
