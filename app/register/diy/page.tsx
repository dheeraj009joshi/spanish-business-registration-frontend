"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ModernFormStep } from "@/components/modern-form-step"
import { AuthGuard } from "@/components/auth-guard"
import { formApi } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

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
    id: "business-names",
    title: "What will you name your business?",
    subtitle: "Provide your preferred business names in order of preference",
    type: "form" as const,
    fields: [
      { id: "businessName1", label: "First Choice Business Name", type: "text", required: true },
      { id: "businessName2", label: "Second Choice Business Name", type: "text", required: false },
      { id: "businessName3", label: "Third Choice Business Name", type: "text", required: false },
      { id: "professionType", label: "Profession Type (if Professional Corporation)", type: "text", required: false },
      {
        id: "publicBenefitStatement",
        label: "Public Benefit Statement (if Benefit Corporation)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "business-info",
    title: "Business Information",
    subtitle: "Provide details about your business operations",
    type: "form" as const,
    fields: [
      { id: "naicsCode", label: "NAICS Code", type: "text", required: true },
      { id: "naicsSubCode", label: "NAICS Sub Code", type: "text", required: true },
      { id: "principalAddress1", label: "Principal Office Address", type: "text", required: true },
      { id: "principalAddress2", label: "Address Line 2", type: "text", required: false },
      { id: "principalCity", label: "City", type: "text", required: true },
      { id: "principalState", label: "State", type: "text", required: true },
      { id: "principalZip", label: "ZIP Code", type: "text", required: true },
      { id: "primaryEmail", label: "Business Email", type: "email", required: true },
      { id: "confirmPrimaryEmail", label: "Confirm Business Email", type: "email", required: true },
      { id: "secondaryEmail", label: "Secondary Email", type: "email", required: false },
    ],
  },
  {
    id: "registered-agent",
    title: "Registered Agent Information",
    subtitle: "Provide information about your registered agent",
    type: "form" as const,
    fields: [
      { id: "county", label: "County", type: "text", required: true },
      { id: "organizerInfo", label: "Organizer Information", type: "textarea", required: true },
      { id: "optionalProvisions", label: "Optional Provisions", type: "textarea", required: false },
    ],
  },
  {
    id: "review",
    title: "Review & Submit",
    subtitle: "Please review your information before submitting",
    type: "review" as const,
  },
]

export default function DIYRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({
    principalState: "GA",
    businesstype: "domestic-llc", // Default to LLC
  })
  const router = useRouter()
  const { user } = useAuth()

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

  // Update the handleSubmit function to redirect to the success page instead of dashboard
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const result = await formApi.submitForm({
        type: "DIY",
        data: formData,
      })

      if (result.success) {
        router.push("/success?type=diy")
      } else {
        alert("Submission failed: " + result.error)
      }
    } catch (error) {
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
    const message = `Hi! I need help with my DIY business registration. I'm currently on step ${currentStep + 1}: ${steps[currentStep].title}`
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AuthGuard>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 py-3 md:py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Back to Home</span>
            </button>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              DIY Registration • {user?.firstName} {user?.lastName}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 md:px-6 min-h-0">
          <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
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
                  serviceType="DIY"
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="flex justify-center items-center space-x-2 md:space-x-3 py-4 md:py-6">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 md:w-8 bg-blue-500"
                      : index < currentStep
                        ? "w-1.5 md:w-2 bg-blue-500"
                        : "w-1.5 md:w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-4 md:py-6">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleWhatsAppContact}
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Need Help?
                </Button>

                <Button
                  onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 md:px-8"
                  size="sm"
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
