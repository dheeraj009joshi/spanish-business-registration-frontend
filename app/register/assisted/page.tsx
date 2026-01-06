"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle, CreditCard, Shield, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ModernFormStep } from "@/components/modern-form-step"
import { AuthGuard } from "@/components/auth-guard"
import { formApi, paymentApi } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"

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
  {
    id: "payment",
    title: "Complete Payment",
    subtitle: "Secure payment powered by Stripe",
    type: "payment" as const,
  },
]

export default function AssistedRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({
    businessType: "domestic-llc",
    personalState: "GA",
    businessState: "GA",
    additionalServices: [],
  })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { language } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculatePrice = () => {
    const basePrice = 299
    let additionalServices = 0
    const servicePrices: Record<string, number> = {
      ein: 50,
      "registered-agent": 99,
      "operating-agreement": 150,
      "business-license": 75,
      "expedited-processing": 100,
      "document-review": 50,
    }

    if (formData.additionalServices) {
      formData.additionalServices.forEach((service: string) => {
        additionalServices += servicePrices[service] || 0
      })
    }

    return basePrice + additionalServices
  }

  const handleNext = async () => {
    // If we're on the review step, submit the form first
    if (steps[currentStep].type === "review") {
      await handleSubmitForm()
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmitForm = async () => {
    setIsSubmitting(true)

    try {
      const totalAmount = calculatePrice()

      const submissionData = {
        ...formData,
        totalAmount,
        businessType: formData.businesstype || formData.businessType || "domestic-llc",
      }

      const result = await formApi.submitForm({
        type: "ASSISTED",
        data: submissionData,
      })

      if (result.success && result.data?.submissionId) {
        setSubmissionId(result.data.submissionId)
        setCurrentStep(currentStep + 1) // Move to payment step
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Failed to submit registration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayment = async () => {
    setIsSubmitting(true)

    try {
      const result = await paymentApi.createCheckoutSession({
        submissionId: submissionId || undefined,
        type: "ASSISTED",
        additionalServices: formData.additionalServices || [],
      })

      if (result.success && result.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.url
      } else {
        toast({
          title: "Payment Error",
          description: result.error || "Failed to create payment session",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating payment:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing payment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
        return true
      case "review":
        return formData.agreeToTerms === true && formData.agreeToPayment === true
      case "payment":
        return true
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

  const totalPrice = calculatePrice()

  // Payment Step Component
  const PaymentStep = () => (
    <div className="text-center h-full flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900">
          {language === "es" ? "¡Registro Guardado!" : "Registration Saved!"}
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          {language === "es" 
            ? "Tu información ha sido guardada. Completa el pago para procesar tu registro."
            : "Your information has been saved. Complete payment to process your registration."}
        </p>

        {/* Payment Summary Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-600">
              {language === "es" ? "Pago seguro con Stripe" : "Secure payment powered by Stripe"}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">ASSISTED Registration</span>
              <span className="font-semibold text-gray-900">$299</span>
            </div>
            
            {formData.additionalServices && formData.additionalServices.length > 0 && (
              <>
                <div className="text-left">
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Additional Services</span>
                </div>
                {formData.additionalServices.map((service: string) => {
                  const serviceDetails: Record<string, { label: string; price: number }> = {
                    ein: { label: "EIN (Tax ID) Application", price: 50 },
                    "registered-agent": { label: "Registered Agent Service", price: 99 },
                    "operating-agreement": { label: "Operating Agreement", price: 150 },
                    "business-license": { label: "Business License Research", price: 75 },
                    "document-review": { label: "Document Review", price: 50 },
                    "expedited-processing": { label: "Expedited Processing", price: 100 },
                  }
                  const details = serviceDetails[service]
                  return (
                    <div key={service} className="flex justify-between items-center py-2 text-sm">
                      <span className="text-gray-600">{details?.label}</span>
                      <span className="font-medium text-gray-900">${details?.price}</span>
                    </div>
                  )
                })}
              </>
            )}

            <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
              <span className="text-lg font-semibold text-gray-900">
                {language === "es" ? "Total a Pagar" : "Total Amount"}
              </span>
              <span className="text-2xl font-bold text-green-600">${totalPrice}</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                />
                {language === "es" ? "Procesando..." : "Processing..."}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                {language === "es" ? `Pagar $${totalPrice}` : `Pay $${totalPrice}`}
              </>
            )}
          </Button>

          {/* Security badges */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center text-gray-400 text-xs">
              <Shield className="w-4 h-4 mr-1" />
              SSL Secured
            </div>
            <div className="flex items-center text-gray-400 text-xs">
              <Lock className="w-4 h-4 mr-1" />
              256-bit Encryption
            </div>
          </div>
        </div>

        {/* Test Card Info (only show in development) */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <span className="mr-2">🧪</span> Test Mode - Use These Cards
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><span className="font-mono bg-blue-100 px-2 py-0.5 rounded">4242 4242 4242 4242</span> - Success</p>
            <p><span className="font-mono bg-blue-100 px-2 py-0.5 rounded">4000 0000 0000 0002</span> - Decline</p>
            <p className="text-xs text-blue-600 mt-2">Use any future date & any 3-digit CVC</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

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
                {steps[currentStep].type === "payment" ? (
                  <PaymentStep />
                ) : (
                  <ModernFormStep
                    step={steps[currentStep]}
                    formData={formData}
                    onSelection={handleSelection}
                    onInputChange={handleInputChange}
                    onCopyAddress={handleCopyPersonalAddress}
                    serviceType="ASSISTED"
                  />
                )}
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
                disabled={currentStep === 0 || steps[currentStep].type === "payment"}
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

                {steps[currentStep].type !== "payment" && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 md:px-10"
                  >
                    {steps[currentStep].type === "review" ? (
                      <>
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            Continue to Payment
                            <ArrowRight className="w-4 h-4 ml-2" />
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
