"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, 
  Building2, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  Briefcase,
  FileCheck,
  Scale,
  Heart,
  Landmark,
  Leaf,
  ArrowRight,
  Star,
  MessageCircle,
  Headphones
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

// Registration Methods - The 2 main options
const registrationMethods = [
  {
    icon: Users,
    title: "Assisted Service",
    titleEs: "Servicio Asistido",
    description: "Provide your basic details and our team will handle the registration for you",
    descriptionEs: "Proporcione sus datos básicos y nuestro equipo se encargará del registro por usted",
    features: ["Expert handling", "Quick turnaround", "Full support included", "Document review"],
    featuresEs: ["Manejo experto", "Respuesta rápida", "Soporte completo incluido", "Revisión de documentos"],
    cta: "Get Started",
    ctaEs: "Comenzar",
    href: "/register/assisted",
    popular: true,
    color: "green"
  },
  {
    icon: Headphones,
    title: "WhatsApp Support",
    titleEs: "Soporte WhatsApp",
    description: "Get instant help and guidance through WhatsApp messaging",
    descriptionEs: "Obtenga ayuda instantánea y orientación a través de mensajería WhatsApp",
    features: ["Instant messaging", "Real-time support", "Personalized guidance", "24/7 availability"],
    featuresEs: ["Mensajería instantánea", "Soporte en tiempo real", "Orientación personalizada", "Disponibilidad 24/7"],
    cta: "Get Started",
    ctaEs: "Comenzar",
    href: "https://wa.me/15551234567?text=Hello,%20I%20need%20help%20registering%20my%20business%20in%20Georgia",
    popular: false,
    color: "emerald",
    isExternal: true
  }
]

const businessTypes = [
  {
    icon: Building2,
    title: "Limited Liability Company (LLC)",
    titleEs: "Compañía de Responsabilidad Limitada (LLC)",
    description: "The most popular choice for small businesses. Offers personal liability protection with flexible management and pass-through taxation.",
    descriptionEs: "La opción más popular para pequeñas empresas. Ofrece protección de responsabilidad personal con gestión flexible y tributación de transferencia.",
    features: ["Personal asset protection", "Flexible taxation options", "Easy to maintain", "No ownership restrictions"],
    featuresEs: ["Protección de activos personales", "Opciones de tributación flexibles", "Fácil de mantener", "Sin restricciones de propiedad"],
    popular: true
  },
  {
    icon: Landmark,
    title: "Domestic Profit Corporation",
    titleEs: "Corporación Doméstica con Fines de Lucro",
    description: "Traditional corporate structure ideal for businesses planning to raise capital or go public.",
    descriptionEs: "Estructura corporativa tradicional ideal para empresas que planean recaudar capital o salir a bolsa.",
    features: ["Stock issuance capability", "Established legal structure", "Perpetual existence", "Easier to raise capital"],
    featuresEs: ["Capacidad de emisión de acciones", "Estructura legal establecida", "Existencia perpetua", "Más fácil recaudar capital"],
    popular: false
  },
  {
    icon: Heart,
    title: "Nonprofit Corporation",
    titleEs: "Corporación Sin Fines de Lucro",
    description: "For charitable, religious, educational, or scientific organizations seeking tax-exempt status.",
    descriptionEs: "Para organizaciones benéficas, religiosas, educativas o científicas que buscan estatus de exención de impuestos.",
    features: ["Tax-exempt eligibility", "Grant eligibility", "Public trust", "Donation deductibility"],
    featuresEs: ["Elegibilidad para exención de impuestos", "Elegibilidad para subvenciones", "Confianza pública", "Deducibilidad de donaciones"],
    popular: false
  },
  {
    icon: Briefcase,
    title: "Professional Corporation",
    titleEs: "Corporación Profesional",
    description: "Designed for licensed professionals like doctors, lawyers, accountants, and engineers.",
    descriptionEs: "Diseñada para profesionales con licencia como médicos, abogados, contadores e ingenieros.",
    features: ["Professional liability protection", "Credential recognition", "State compliance", "Professional governance"],
    featuresEs: ["Protección de responsabilidad profesional", "Reconocimiento de credenciales", "Cumplimiento estatal", "Gobernanza profesional"],
    popular: false
  },
  {
    icon: Scale,
    title: "Limited Partnership (LP)",
    titleEs: "Sociedad Limitada (LP)",
    description: "Partnership structure with both general and limited partners, offering flexibility in management and liability.",
    descriptionEs: "Estructura de sociedad con socios generales y limitados, ofreciendo flexibilidad en gestión y responsabilidad.",
    features: ["Limited liability for LPs", "Pass-through taxation", "Flexible profit sharing", "Investment friendly"],
    featuresEs: ["Responsabilidad limitada para LPs", "Tributación de transferencia", "Reparto flexible de ganancias", "Amigable para inversiones"],
    popular: false
  },
  {
    icon: Leaf,
    title: "Benefit Corporation",
    titleEs: "Corporación de Beneficio",
    description: "For businesses committed to creating positive social and environmental impact alongside profit.",
    descriptionEs: "Para empresas comprometidas con crear impacto social y ambiental positivo junto con las ganancias.",
    features: ["Social mission focus", "Stakeholder consideration", "Transparency requirements", "Impact reporting"],
    featuresEs: ["Enfoque en misión social", "Consideración de partes interesadas", "Requisitos de transparencia", "Informes de impacto"],
    popular: false
  }
]

const additionalServices = [
  {
    icon: FileText,
    title: "EIN Application",
    titleEs: "Solicitud de EIN",
    description: "Federal Tax ID number required for hiring employees and opening business bank accounts.",
    descriptionEs: "Número de identificación fiscal federal requerido para contratar empleados y abrir cuentas bancarias comerciales.",
    price: "$50"
  },
  {
    icon: Users,
    title: "Registered Agent Service",
    titleEs: "Servicio de Agente Registrado",
    description: "Professional registered agent to receive legal documents on behalf of your business.",
    descriptionEs: "Agente registrado profesional para recibir documentos legales en nombre de su negocio.",
    price: "$99/year"
  },
  {
    icon: FileCheck,
    title: "Operating Agreement",
    titleEs: "Acuerdo Operativo",
    description: "Custom operating agreement outlining ownership, responsibilities, and procedures.",
    descriptionEs: "Acuerdo operativo personalizado que describe la propiedad, responsabilidades y procedimientos.",
    price: "$150"
  },
  {
    icon: Shield,
    title: "Business License Research",
    titleEs: "Investigación de Licencias Comerciales",
    description: "Research and guidance on required licenses and permits for your specific business.",
    descriptionEs: "Investigación y orientación sobre licencias y permisos requeridos para su negocio específico.",
    price: "$75"
  },
  {
    icon: Clock,
    title: "Expedited Processing",
    titleEs: "Procesamiento Acelerado",
    description: "Rush processing to get your business registered in 24-48 hours.",
    descriptionEs: "Procesamiento urgente para registrar su negocio en 24-48 horas.",
    price: "$100"
  },
  {
    icon: FileText,
    title: "Document Review",
    titleEs: "Revisión de Documentos",
    description: "Professional review and consultation on your business documents.",
    descriptionEs: "Revisión profesional y consulta sobre sus documentos comerciales.",
    price: "$50"
  }
]

const pricingPlans = [
  {
    name: "DIY",
    nameEs: "Hazlo Tú Mismo",
    price: "$99",
    description: "Complete your registration yourself with our guided platform",
    descriptionEs: "Complete su registro usted mismo con nuestra plataforma guiada",
    features: [
      "Step-by-step guidance",
      "Name availability check",
      "Document preparation",
      "State filing",
      "Digital copies of documents",
      "Email support"
    ],
    featuresEs: [
      "Guía paso a paso",
      "Verificación de disponibilidad de nombre",
      "Preparación de documentos",
      "Presentación estatal",
      "Copias digitales de documentos",
      "Soporte por correo electrónico"
    ],
    cta: "Start DIY Registration",
    ctaEs: "Iniciar Registro DIY",
    href: "/register/diy",
    popular: false
  },
  {
    name: "Assisted",
    nameEs: "Asistido",
    price: "$299",
    description: "Let our experts handle everything for you",
    descriptionEs: "Deje que nuestros expertos manejen todo por usted",
    features: [
      "Everything in DIY",
      "Dedicated specialist",
      "Priority processing",
      "Document review",
      "Phone & WhatsApp support",
      "1-year registered agent",
      "Operating agreement template"
    ],
    featuresEs: [
      "Todo lo del DIY",
      "Especialista dedicado",
      "Procesamiento prioritario",
      "Revisión de documentos",
      "Soporte por teléfono y WhatsApp",
      "Agente registrado por 1 año",
      "Plantilla de acuerdo operativo"
    ],
    cta: "Get Started",
    ctaEs: "Comenzar",
    href: "/register/assisted",
    popular: true
  }
]

export default function ServicesPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-green-100 text-green-800">
              {language === "es" ? "Nuestros Servicios" : "Our Services"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "es" 
                ? "Servicios Completos de Registro de Empresas" 
                : "Complete Business Registration Services"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {language === "es" 
                ? "Desde la formación de LLC hasta servicios corporativos completos, tenemos todo lo que necesita para iniciar su negocio en Georgia"
                : "From LLC formation to complete corporate services, we have everything you need to start your business in Georgia"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register/assisted">
                  {language === "es" ? "Comenzar Ahora" : "Get Started Now"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  {language === "es" ? "Hablar con un Experto" : "Talk to an Expert"}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Methods Section - The 2 Main Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-green-100 text-green-800">
              {language === "es" ? "Métodos de Registro" : "Registration Methods"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Elija Su Método de Registro" : "Choose Your Registration Method"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es" 
                ? "Seleccione la opción que mejor se adapte a sus necesidades y presupuesto"
                : "Select the option that best fits your needs and budget"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {registrationMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full relative hover:shadow-xl transition-all ${method.popular ? 'border-green-500 border-2' : 'border-gray-200'}`}>
                  {method.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        {language === "es" ? "Más Popular" : "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <div className={`w-14 h-14 ${method.color === 'green' ? 'bg-green-100' : 'bg-emerald-100'} rounded-xl flex items-center justify-center mb-4`}>
                      <method.icon className={`w-7 h-7 ${method.color === 'green' ? 'text-green-600' : 'text-emerald-600'}`} />
                    </div>
                    <CardTitle className="text-2xl">
                      {language === "es" ? method.titleEs : method.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {language === "es" ? method.descriptionEs : method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {(language === "es" ? method.featuresEs : method.features).map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <CheckCircle className={`w-5 h-5 ${method.color === 'green' ? 'text-green-500' : 'text-emerald-500'} mr-3 flex-shrink-0`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${method.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      size="lg"
                      asChild
                    >
                      {method.isExternal ? (
                        <a href={method.href} target="_blank" rel="noopener noreferrer">
                          {language === "es" ? method.ctaEs : method.cta}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                      ) : (
                        <Link href={method.href}>
                          {language === "es" ? method.ctaEs : method.cta}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              {language === "es" ? "Tipos de Entidades" : "Entity Types"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Elija la Estructura Correcta" : "Choose the Right Structure"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es" 
                ? "Cada estructura empresarial tiene sus propias ventajas. Le ayudamos a elegir la mejor para sus necesidades."
                : "Each business structure has its own advantages. We help you choose the best one for your needs."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-lg transition-shadow relative ${type.popular ? 'border-green-500 border-2' : ''}`}>
                  {type.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        {language === "es" ? "Más Popular" : "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <type.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">
                      {language === "es" ? type.titleEs : type.title}
                    </CardTitle>
                    <CardDescription>
                      {language === "es" ? type.descriptionEs : type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(language === "es" ? type.featuresEs : type.features).map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              {language === "es" ? "Precios" : "Pricing"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Planes Simples y Transparentes" : "Simple, Transparent Pricing"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es" 
                ? "Elija el plan que mejor se adapte a sus necesidades. Sin tarifas ocultas."
                : "Choose the plan that best fits your needs. No hidden fees."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-green-500 border-2 shadow-xl' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        {language === "es" ? "Recomendado" : "Recommended"}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">
                      {language === "es" ? plan.nameEs : plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-2">+ state fees</span>
                    </div>
                    <CardDescription className="mt-4">
                      {language === "es" ? plan.descriptionEs : plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-8">
                      {(language === "es" ? plan.featuresEs : plan.features).map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link href={plan.href}>
                        {language === "es" ? plan.ctaEs : plan.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-orange-100 text-orange-800">
              {language === "es" ? "Servicios Adicionales" : "Add-On Services"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Mejore Su Registro" : "Enhance Your Registration"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es" 
                ? "Agregue estos servicios para obtener una solución comercial completa"
                : "Add these services for a complete business solution"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-2xl font-bold text-green-600">{service.price}</span>
                    </div>
                    <CardTitle className="text-lg mt-4">
                      {language === "es" ? service.titleEs : service.title}
                    </CardTitle>
                    <CardDescription>
                      {language === "es" ? service.descriptionEs : service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === "es" 
                ? "¿Listo para Registrar Su Negocio?" 
                : "Ready to Register Your Business?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === "es" 
                ? "Únase a miles de emprendedores que han registrado exitosamente sus negocios con nosotros"
                : "Join thousands of entrepreneurs who have successfully registered their businesses with us"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/assisted">
                  {language === "es" ? "Comenzar Registro" : "Start Registration"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-green-700 border-white hover:bg-white/90" asChild>
                <Link href="/faq">
                  {language === "es" ? "Ver Preguntas Frecuentes" : "View FAQ"}
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

