"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ModernFormStep } from "@/components/modern-form-step"
import { AuthGuard } from "@/components/auth-guard"
import { formApi } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

const steps = [
  {
    id: "business-type",
    title: "What type of business are you registering?",
    subtitle: "Choose the business structure that best fits your needs",
    type: "selection" as const,
    options: [
      {
        id: "domestic-profit",
        title: "Domestic Profit Corporation",
        description: "Traditional corporation structure",
        icon: "🏢",
      },
      {
        id: "domestic-llc",
        title: "Limited Liability Company (LLC)",
        description: "Most popular choice for small businesses",
        icon: "🏛️",
      },
      {
        id: "domestic-nonprofit",
        title: "Nonprofit Corporation",
        description: "For charitable and social causes",
        icon: "❤️",
      },
      {
        id: "domestic-professional",
        title: "Professional Corporation",
        description: "For licensed professionals",
        icon: "👨‍⚕️",
      },
      {
        id: "domestic-lp",
        title: "Domestic Limited Partnership",
        description: "For businesses with limited partners",
        icon: "🤝",
      },
      {
        id: "domestic-benefit",
        title: "Domestic Benefit Corporation",
        description: "For social and environmental impact",
        icon: "🌱",
      },
    ],
  },
  {
    id: "business-info",
    title: "Tell us about your business",
    subtitle: "Provide basic information about your business",
    type: "form" as const,
    fields: [
      { id: "businessName", label: "Desired Business Name", type: "text", required: true },
      { id: "businessEmail", label: "Business Email", type: "email", required: true },
      { id: "phoneNumber", label: "Phone Number", type: "tel", required: true },
      { id: "industry", label: "Industry", type: "text", required: true },
      { id: "businessDescription", label: "Brief Business Description", type: "textarea", required: true },
    ],
  },
  {
    id: "personal-address",
    title: "What is your personal address?",
    subtitle: "Provide your personal address information",
    type: "address" as const,
    addressType: "personal" as const,
    fields: [
      { id: "personalAddressLine1", label: "Street Address", type: "text", required: true },
      { id: "personalAddressLine2", label: "Apt, Suite, etc. (optional)", type: "text", required: false },
      { id: "personalCity", label: "City", type: "text", required: true },
      { id: "personalState", label: "State", type: "text", required: true },
      { id: "personalZipCode", label: "ZIP Code", type: "text", required: true },
      { id: "personalCounty", label: "County", type: "text", required: true },
    ],
  },
  {
    id: "business-address",
    title: "Where is your business located?",
    subtitle: "Provide your business address information",
    type: "address" as const,
    addressType: "business" as const,
    fields: [
      { id: "businessAddressLine1", label: "Street Address", type: "text", required: true },
      { id: "businessAddressLine2", label: "Apt, Suite, etc. (optional)", type: "text", required: false },
      { id: "businessCity", label: "City", type: "text", required: true },
      { id: "businessState", label: "State", type: "text", required: true },
      { id: "businessZipCode", label: "ZIP Code", type: "text", required: true },
      { id: "businessCounty", label: "County", type: "text", required: true },
    ],
  },
  {
    id: "additional-services",
    title: "Additional Services",
    subtitle: "Select any additional services you'd like to include",
    type: "services" as const,
  },
  {
    id: "review",
    title: "Review & Submit",
    subtitle: "Please review your information before submitting",
    type: "review" as const,
  },
]

export default function AssistedRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({
    businessType: "domestic-llc", // Default to LLC
    personalState: "GA", // Default to Georgia
    businessState: "GA", // Default to Georgia
    additionalServices: [],
  })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { translations } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelection = (value: string) => {
    const step = steps[currentStep]
    setFormData((prev) => ({ ...prev, [step.id.replace("-", "")]: value }))
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCopyPersonalAddress = () => {
    setFormData((prev) => ({
      ...prev,
      businessAddressLine1: prev.personalAddressLine1 || "",
      businessAddressLine2: prev.personalAddressLine2 || "",
      businessCity: prev.personalCity || "",
      businessState: prev.personalState || "GA",
      businessZipCode: prev.personalZipCode || "",
      businessCounty: prev.personalCounty || "",
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate total amount based on selected services
      const basePrice = 299 // Base price for assisted registration
      const additionalServicesTotal = (formData.additionalServices || []).reduce((total: number, service: string) => {
        switch (service) {
          case "ein":
            return total + 50
          case "registered-agent":
            return total + 99
          case "operating-agreement":
            return total + 150
          case "business-license":
            return total + 75
          case "document-review":
            return total + 50
          case "expedited-processing":
            return total + 100
          default:
            return total
        }
      }, 0)

      const totalAmount = basePrice + additionalServicesTotal

      // Prepare submission data
      const submissionData = {
        ...formData,
        totalAmount,
        businessType: formData.businesstype || formData.businessType || "domestic-llc",
      }

      const result = await formApi.submitForm({
        type: "ASSISTED",
        data: submissionData,
      })

      if (result.success) {
        router.push(`/success?type=assisted&submissionId=${result.data?.submissionId}`)
      } else {
        alert("Submission failed: " + result.error)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    const step = steps[currentStep]
    switch (step.type) {
      case "selection":
        const fieldName = step.id.replace("-", "")
        return formData[fieldName] !== undefined && formData[fieldName] !== ""
      case "form":
      case "address":
        return (
          step.fields?.every((field) => {
            if (field.required) {
              return formData[field.id] && formData[field.id].trim() !== ""
            }
            return true
          }) || false
        )
      case "services":
        return true // Optional step
      case "review":
        return formData.agreeToTerms === true && formData.agreeToPayment === true
      default:
        return false
    }
  }

  const handleWhatsAppContact = () => {
    const message = `Hi! I need help with my Assisted business registration. I'm currently on step ${currentStep + 1}: ${steps[currentStep].title}`
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (!mounted) {
    return (
      <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="h-screen"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 py-3 md:py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Back to Home</span>
            </button>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Assisted Registration • {user?.firstName} {user?.lastName}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 md:px-8 min-h-0">
          <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex-1 flex flex-col justify-center"
              >
                <ModernFormStep
                  step={steps[currentStep]}
                  formData={formData}
                  onSelection={handleSelection}
                  onInputChange={handleInputChange}
                  onCopyAddress={handleCopyPersonalAddress}
                  serviceType="ASSISTED"
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="flex justify-center items-center space-x-3 md:space-x-4 py-6 md:py-8">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-8 md:w-10 bg-green-500"
                      : index < currentStep
                        ? "w-2 md:w-2.5 bg-green-500"
                        : "w-2 md:w-2.5 bg-gray-300 dark:bg-gray-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-6 md:py-8">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleWhatsAppContact}
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Need Help?
                </Button>

                <Button
                  onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 md:px-10"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Registration
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
