"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  isScrolled?: boolean
}

export function LanguageToggle({ isScrolled }: LanguageToggleProps = {}) {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      className={cn(
        "flex items-center space-x-2 transition-colors",
        isScrolled
          ? "border-gray-200 text-gray-700 hover:text-blue-600"
          : "border-gray-200 text-gray-700 hover:text-blue-600",
      )}
    >
      <Globe className="w-4 h-4" />
      <span>{language === "en" ? "ES" : "EN"}</span>
    </Button>
  )
}
