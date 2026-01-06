"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  Globe,
  Send,
  Calendar
} from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"
import { contactApi } from "@/lib/api"

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    titleEs: "Teléfono",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri 9AM-5PM EST",
    descriptionEs: "Lun-Vie 9AM-5PM EST",
    color: "green",
    href: "tel:+15551234567"
  },
  {
    icon: Mail,
    title: "Email",
    titleEs: "Correo Electrónico",
    value: "business@registrarnegocio.com",
    description: "We reply within 24 hours",
    descriptionEs: "Respondemos en 24 horas",
    color: "blue",
    href: "mailto:business@registrarnegocio.com"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    titleEs: "WhatsApp",
    value: "+1 (555) 987-6543",
    description: "Instant support available",
    descriptionEs: "Soporte instantáneo disponible",
    color: "emerald",
    href: "https://wa.me/15559876543"
  },
  {
    icon: MapPin,
    title: "Office",
    titleEs: "Oficina",
    value: "Atlanta, Georgia",
    description: "123 Business Ave, Suite 100",
    descriptionEs: "123 Business Ave, Suite 100",
    color: "purple",
    href: "https://maps.google.com"
  }
]

const subjects = [
  { value: "general", label: "General Inquiry", labelEs: "Consulta General" },
  { value: "registration", label: "Business Registration", labelEs: "Registro de Empresas" },
  { value: "pricing", label: "Pricing & Plans", labelEs: "Precios y Planes" },
  { value: "support", label: "Technical Support", labelEs: "Soporte Técnico" },
  { value: "partnership", label: "Partnership Opportunities", labelEs: "Oportunidades de Asociación" },
  { value: "other", label: "Other", labelEs: "Otro" }
]

export default function ContactPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await contactApi.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      })

      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        toast({
          title: language === "es" ? "Error" : "Error",
          description: result.error || (language === "es" ? "No se pudo enviar el mensaje" : "Failed to send message"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Error de conexión" : "Connection error",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
      blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              {language === "es" ? "Contáctenos" : "Contact Us"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "es" ? "¿Cómo Podemos Ayudarte?" : "How Can We Help You?"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "es" 
                ? "Nuestro equipo de expertos está listo para responder sus preguntas y ayudarlo a registrar su negocio en Georgia"
                : "Our team of experts is ready to answer your questions and help you register your business in Georgia"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4 bg-white -mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => {
              const colors = getColorClasses(method.color)
              return (
                <motion.a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="block"
                >
                  <Card className={`h-full border-2 ${colors.border} hover:shadow-lg transition-all cursor-pointer`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <method.icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {language === "es" ? method.titleEs : method.title}
                      </h3>
                      <p className={`${colors.text} font-medium text-sm mb-1`}>{method.value}</p>
                      <p className="text-gray-500 text-xs">
                        {language === "es" ? method.descriptionEs : method.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {language === "es" ? "Envíenos un Mensaje" : "Send Us a Message"}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {language === "es" 
                      ? "Complete el formulario y nos pondremos en contacto en 24 horas"
                      : "Fill out the form and we'll get back to you within 24 hours"}
                  </p>

                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        {language === "es" ? "¡Mensaje Enviado!" : "Message Sent!"}
                      </h3>
                      <p className="text-green-700 mb-6">
                        {language === "es" 
                          ? "Gracias por contactarnos. Responderemos a su consulta lo antes posible."
                          : "Thank you for contacting us. We'll respond to your inquiry as soon as possible."}
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        {language === "es" ? "Enviar Otro Mensaje" : "Send Another Message"}
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            {language === "es" ? "Nombre Completo" : "Full Name"} *
                          </Label>
                          <Input
                            id="name"
                            placeholder={language === "es" ? "Juan García" : "John Smith"}
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            {language === "es" ? "Correo Electrónico" : "Email Address"} *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            {language === "es" ? "Teléfono" : "Phone Number"}
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">
                            {language === "es" ? "Asunto" : "Subject"} *
                          </Label>
                          <Select 
                            value={formData.subject} 
                            onValueChange={(value) => handleInputChange("subject", value)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder={language === "es" ? "Seleccionar asunto" : "Select subject"} />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.value} value={subject.value}>
                                  {language === "es" ? subject.labelEs : subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          {language === "es" ? "Mensaje" : "Message"} *
                        </Label>
                        <Textarea
                          id="message"
                          rows={5}
                          placeholder={language === "es" 
                            ? "Cuéntenos cómo podemos ayudarle..."
                            : "Tell us how we can help you..."}
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          required
                          className="resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-green-600 hover:bg-green-700" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            {language === "es" ? "Enviando..." : "Sending..."}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {language === "es" ? "Enviar Mensaje" : "Send Message"}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Business Hours */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === "es" ? "Horario de Atención" : "Business Hours"}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        {language === "es" ? "Lunes - Viernes" : "Monday - Friday"}
                      </span>
                      <span className="font-medium text-gray-900">9:00 AM - 5:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        {language === "es" ? "Sábado" : "Saturday"}
                      </span>
                      <span className="font-medium text-gray-900">10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">
                        {language === "es" ? "Domingo" : "Sunday"}
                      </span>
                      <span className="font-medium text-gray-500">
                        {language === "es" ? "Cerrado" : "Closed"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {language === "es" 
                        ? "Servicios en línea disponibles 24/7"
                        : "Online services available 24/7"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {language === "es" ? "Enlaces Rápidos" : "Quick Links"}
                  </h3>
                  <div className="space-y-3">
                    <Link 
                      href="/faq" 
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                        {language === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
                      </span>
                    </Link>
                    <Link 
                      href="/services" 
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Calendar className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700 group-hover:text-green-600 transition-colors">
                        {language === "es" ? "Nuestros Servicios" : "Our Services"}
                      </span>
                    </Link>
                    <a 
                      href="https://wa.me/15559876543"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-600 mr-3" />
                      <span className="text-gray-700 group-hover:text-emerald-600 transition-colors">
                        {language === "es" ? "Chat por WhatsApp" : "WhatsApp Chat"}
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {language === "es" ? "Atlanta, Georgia, EE.UU." : "Atlanta, Georgia, USA"}
                    </p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      {language === "es" ? "Ver en Google Maps" : "View on Google Maps"}
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === "es" 
                ? "¿Listo para Comenzar?" 
                : "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === "es" 
                ? "Registre su negocio hoy y únase a miles de emprendedores exitosos en Georgia"
                : "Register your business today and join thousands of successful entrepreneurs in Georgia"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/assisted">
                  {language === "es" ? "Comenzar Registro" : "Start Registration"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-green-700 border-white hover:bg-white/90" asChild>
                <Link href="/services">
                  {language === "es" ? "Ver Servicios" : "View Services"}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
