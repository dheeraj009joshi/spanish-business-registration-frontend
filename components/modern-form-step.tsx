"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import ModernInput from "@/components/modern-input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface FormStep {
  id: string
  title: string
  subtitle: string
  type: "selection" | "form" | "services" | "review" | "address"
  addressType?: "personal" | "business"
  options?: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
  fields?: Array<{
    id: string
    label: string
    type: string
    required: boolean
  }>
}

interface ModernFormStepProps {
  step: FormStep
  formData: any
  onSelection: (value: string) => void
  onInputChange: (field: string, value: string | boolean | string[]) => void
  onCopyAddress?: () => void
  serviceType?: "DIY" | "ASSISTED"
}

export function ModernFormStep({
  step,
  formData,
  onSelection,
  onInputChange,
  onCopyAddress,
  serviceType = "DIY",
}: ModernFormStepProps) {
  const getSelectedValue = () => {
    const fieldName = step.id.replace("-", "")
    return formData[fieldName] || ""
  }

  // Set default LLC selection
  useEffect(() => {
    if (step.id === "business-type" && !formData.businesstype) {
      onSelection("domestic-llc")
    }
  }, [step.id, formData.businesstype, onSelection])

  const calculatePrice = () => {
    const basePrice = serviceType === "DIY" ? 99 : 299
    let additionalServices = 0

    // Calculate additional services for both DIY and ASSISTED
    if (formData.additionalServices) {
      const servicePrices: Record<string, number> = {
        ein: 50,
        "registered-agent": 99,
        "operating-agreement": 150,
        "business-license": 75,
        "expedited-processing": 100,
        "document-review": 50,
      }

      formData.additionalServices.forEach((service: string) => {
        additionalServices += servicePrices[service] || 0
      })
    }

    return basePrice + additionalServices
  }

  if (step.type === "selection") {
    return (
      <div className="text-center h-full flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900 dark:text-white"
        >
          {step.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8"
        >
          {step.subtitle}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
          {step.options?.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              onClick={() => onSelection(option.id)}
              className={`group relative p-4 md:p-5 lg:p-6 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105 ${
                getSelectedValue() === option.id
                  ? "border-green-500 bg-green-50 dark:bg-green-500/10 dark:border-green-400"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
              }`}
            >
              <div className="text-lg md:text-xl lg:text-2xl mb-1 md:mb-2">{option.icon}</div>
              <h3 className="text-xs md:text-sm lg:text-base font-semibold mb-1 text-gray-900 dark:text-white leading-tight">
                {option.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{option.description}</p>

              {/* Selection indicator */}
              {getSelectedValue() === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 md:top-2 right-1 md:right-2 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  if (step.type === "form") {
    return (
      <div className="text-center h-full flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900 dark:text-white"
        >
          {step.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8"
        >
          {step.subtitle}
        </motion.p>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {step.fields?.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <ModernInput
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={(e) => onInputChange(field.id, e.target.value)}
                  textarea={field.type === "textarea"}
                  required={field.required}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step.type === "address") {
    return (
      <div className="text-center h-full flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900 dark:text-white"
        >
          {step.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8"
        >
          {step.subtitle}
        </motion.p>

        <div className="max-w-5xl mx-auto">
          {step.addressType === "business" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-6 flex justify-center"
            >
              <Button
                type="button"
                onClick={onCopyAddress}
                className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Personal Address as Business Address
              </Button>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {step.fields?.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <ModernInput
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={(e) => onInputChange(field.id, e.target.value)}
                  textarea={field.type === "textarea"}
                  required={field.required}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step.type === "services") {
    const services = [
      { id: "ein", label: "EIN (Tax ID) Application", price: "$50" },
      { id: "registered-agent", label: "Registered Agent Service", price: "$99/year" },
      { id: "operating-agreement", label: "Operating Agreement", price: "$150" },
      { id: "business-license", label: "Business License Research", price: "$75" },
      { id: "document-review", label: "Document Review & Consultation", price: "$50" },
      { id: "expedited-processing", label: "Expedited Processing", price: "$100" },
    ]

    return (
      <div className="text-center h-full flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900 dark:text-white"
        >
          {step.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8"
        >
          {step.subtitle}
        </motion.p>

        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex items-center space-x-2 p-2 md:p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50"
            >
              <Checkbox
                id={service.id}
                checked={formData.additionalServices?.includes(service.id)}
                onCheckedChange={(checked) => {
                  const current = formData.additionalServices || []
                  if (checked) {
                    onInputChange("additionalServices", [...current, service.id])
                  } else {
                    onInputChange(
                      "additionalServices",
                      current.filter((s: string) => s !== service.id),
                    )
                  }
                }}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1 text-left">
                <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-white leading-tight">
                  {service.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{service.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (step.type === "review") {
    const totalPrice = calculatePrice()

    // Helper function to format address for display
    const formatAddress = (type: "personal" | "business") => {
      const prefix = type === "personal" ? "personal" : "business"
      const address = [
        formData[`${prefix}AddressLine1`],
        formData[`${prefix}AddressLine2`] ? formData[`${prefix}AddressLine2`] : "",
        [formData[`${prefix}City`], formData[`${prefix}State`], formData[`${prefix}ZipCode`]]
          .filter(Boolean)
          .join(", "),
        formData[`${prefix}County`] ? `${formData[`${prefix}County`]} County` : "",
      ]
        .filter(Boolean)
        .join(", ")
      return address
    }

    return (
      <div className="text-center h-full flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight text-gray-900 dark:text-white"
        >
          {step.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8"
        >
          {step.subtitle}
        </motion.p>

        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Information Review */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6"
            >
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Business Information
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Business Type:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.businesstype || "LLC"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Business Name:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.businessName || ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Business Email:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.businessEmail || ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Phone Number:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.phoneNumber || ""}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Business Address:</span>
                    <span className="text-gray-900 dark:text-white font-medium block">{formatAddress("business")}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Personal Address:</span>
                    <span className="text-gray-900 dark:text-white font-medium block">{formatAddress("personal")}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pricing Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 md:p-6"
            >
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900 dark:text-white">Pricing Summary</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{serviceType} Registration:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${serviceType === "DIY" ? "99" : "299"}
                  </span>
                </div>
                {formData.additionalServices && formData.additionalServices.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm block mb-1">Additional Services:</span>
                    {formData.additionalServices.map((service: string) => {
                      const serviceDetails = {
                        ein: { label: "EIN (Tax ID) Application", price: 50 },
                        "registered-agent": { label: "Registered Agent Service", price: 99 },
                        "operating-agreement": { label: "Operating Agreement", price: 150 },
                        "business-license": { label: "Business License Research", price: 75 },
                        "document-review": { label: "Document Review & Consultation", price: 50 },
                        "expedited-processing": { label: "Expedited Processing", price: 100 },
                      }[service]

                      return (
                        <div key={service} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{serviceDetails?.label}:</span>
                          <span className="text-gray-900 dark:text-white font-medium">${serviceDetails?.price}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-green-600 dark:text-green-400">${totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Agreement Checkboxes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 text-left">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => onInputChange("agreeToTerms", !!checked)}
                className="mt-1 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
              >
                I certify that the information provided is true and accurate.
              </label>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <Checkbox
                id="agreeToPayment"
                checked={formData.agreeToPayment}
                onCheckedChange={(checked) => onInputChange("agreeToPayment", !!checked)}
                className="mt-1 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label
                htmlFor="agreeToPayment"
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
              >
                I agree to pay the total amount of{" "}
                <strong className="text-green-600 dark:text-green-400">${totalPrice}</strong> for the selected services.
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}
