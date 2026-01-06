"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, XCircle, FileText, ExternalLink, CreditCard, AlertCircle, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { formApi, paymentApi, type FormSubmission } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import confetti from 'canvas-confetti'

function SuccessPageContent() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | 'pending' | null>(null)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const submissionType = searchParams.get("type") || "assisted"
  const submissionId = searchParams.get("submissionId")
  const sessionId = searchParams.get("session_id")
  const cancelled = searchParams.get("cancelled")
  const { user } = useAuth()
  const { language } = useLanguage()

  // Verify payment if session_id is present
  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          const result = await paymentApi.verifySession(sessionId)
          if (result.success && result.data?.status === 'complete') {
            setPaymentStatus('success')
            setPaymentVerified(true)
            // Trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
          } else {
            setPaymentStatus('pending')
          }
        } catch (error) {
          console.error("Failed to verify payment:", error)
          setPaymentStatus('pending')
        }
      } else if (cancelled === 'true') {
        setPaymentStatus('cancelled')
      }
    }

    verifyPayment()
  }, [sessionId, cancelled])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true)
        const data = await formApi.getSubmissions()
        setSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const filteredSubmissions =
    activeTab === "all"
      ? submissions
      : submissions.filter((sub) => sub.status.toLowerCase() === activeTab.toLowerCase())

  // Payment Success View
  if (paymentStatus === 'success') {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <img src="/images/logo.png" alt="GeorgiaBiz Pro" className="h-8 w-8 mr-2" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</h1>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "es" ? "Volver al Inicio" : "Back to Home"}
              </Button>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <PartyPopper className="w-8 h-8 text-yellow-500 mr-2" />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {language === "es" ? "¡Pago Exitoso!" : "Payment Successful!"}
                  </h1>
                  <PartyPopper className="w-8 h-8 text-yellow-500 ml-2 transform scale-x-[-1]" />
                </div>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  {language === "es" 
                    ? "Tu registro de negocio está siendo procesado."
                    : "Your business registration is now being processed."}
                </p>
              </motion.div>

              {/* Success Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">
                      {language === "es" ? "Confirmación de Pago" : "Payment Confirmation"}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {submissionType.toUpperCase()} Registration
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">
                      {language === "es" ? "Estado" : "Status"}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {language === "es" ? "Pagado" : "Paid"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">
                      {language === "es" ? "Siguiente Paso" : "Next Step"}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {language === "es" ? "Procesando Registro" : "Processing Registration"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-left"
              >
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  {language === "es" ? "¿Qué sigue?" : "What happens next?"}
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    {language === "es" 
                      ? "Nuestro equipo revisará tu información (24-48 horas)"
                      : "Our team will review your information (24-48 hours)"}
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    {language === "es"
                      ? "Recibirás un correo con actualizaciones de estado"
                      : "You'll receive email updates on your registration status"}
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    {language === "es"
                      ? "Una vez aprobado, recibirás tus documentos oficiales"
                      : "Once approved, you'll receive your official documents"}
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  {language === "es" ? "Ver Mi Dashboard" : "View My Dashboard"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="border-gray-300 text-gray-700 dark:text-gray-300 px-8 py-3"
                >
                  {language === "es" ? "Volver al Inicio" : "Back to Home"}
                </Button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  // Payment Cancelled View
  if (paymentStatus === 'cancelled') {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <img src="/images/logo.png" alt="GeorgiaBiz Pro" className="h-8 w-8 mr-2" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</h1>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "es" ? "Volver al Inicio" : "Back to Home"}
              </Button>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <XCircle className="w-12 h-12 text-orange-600" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "es" ? "Pago Cancelado" : "Payment Cancelled"}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {language === "es" 
                  ? "Tu pago fue cancelado. Tu registro ha sido guardado y puedes completar el pago más tarde."
                  : "Your payment was cancelled. Your registration has been saved and you can complete payment later."}
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-orange-500 mr-3" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {language === "es" ? "Registro Pendiente de Pago" : "Registration Pending Payment"}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {language === "es"
                    ? "Tu información ha sido guardada. Para procesar tu registro, necesitas completar el pago."
                    : "Your information has been saved. To process your registration, you need to complete payment."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                  >
                    {language === "es" ? "Ir al Dashboard" : "Go to Dashboard"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/register/${submissionType}`)}
                    className="border-gray-300 text-gray-700 dark:text-gray-300 px-8 py-3"
                  >
                    {language === "es" ? "Nuevo Registro" : "New Registration"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  // Default Success View (form submitted, payment pending or no payment required)
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="GeorgiaBiz Pro" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">GeorgiaBiz Pro</h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {submissionType === "assisted"
                    ? "Your business registration request has been submitted!"
                    : "Your business registration has been submitted!"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {submissionType === "assisted"
                    ? "Our team will review your information and contact you within 24 hours to proceed with your registration."
                    : "Your registration is being processed. You can check the status below."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submissions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Business Submissions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track and manage your business registration submissions
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex px-6 -mb-px">
                {["all", "pending", "processing", "completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Submissions */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-green-600 dark:border-t-green-400"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <div key={submission.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`
                        p-2 rounded-full mr-4
                        ${
                          submission.type === "ASSISTED"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }
                      `}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{submission.businessName}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.type} Registration • Submitted{" "}
                          {new Date(submission.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4
                        ${submission.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}
                        ${submission.status === "PROCESSING" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
                        ${submission.status === "COMPLETED" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}
                        ${submission.status === "REJECTED" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
                      `}
                      >
                        {submission.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/submissions/${submission.id}`)}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Details
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeTab === "all"
                      ? "No submissions found. Start your first business registration!"
                      : `No ${activeTab} submissions found.`}
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/register/diy")}>
                    Start New Registration
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-green-600"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
