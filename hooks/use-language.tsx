"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: any
}

const translations = {
  en: {
    hero: {
      badge: "Trusted Business Registration Service",
      title: "Register Your Business in Georgia with Confidence",
      subtitle:
        "Fast, secure, and professional business registration services. We help entrepreneurs and businesses get started in Georgia with expert guidance and support.",
      cta: "Start Registration",
      signup: "Create Account",
      features: [
        "Step-by-step guidance through the entire process",
        "Expert support from business registration specialists",
        "Secure and compliant with Georgia state laws",
      ],
    },
    features: {
      title: "Why Choose Us?",
      subtitle: "We make business registration simple, fast, and affordable",
      fast: {
        title: "Fast Processing",
        description: "Get your business registered quickly with our streamlined process",
      },
      secure: {
        title: "Secure & Legal",
        description: "All registrations are handled securely and comply with Georgia state laws",
      },
      support: {
        title: "Expert Support",
        description: "Our team of experts is here to help you every step of the way",
      },
    },
    process: {
      title: "Simple Registration Process",
      subtitle: "We've simplified the business registration process into three easy steps",
      step1: {
        title: "Choose Your Method",
        description: "Select the registration option that works best for your needs and budget",
      },
      step2: {
        title: "Provide Information",
        description: "Fill out the necessary details about your business and preferences",
      },
      step3: {
        title: "Get Registered",
        description: "Receive your official business registration documents and start operating",
      },
    },
    services: {
      title: "Choose Your Registration Method",
      subtitle: "Select the option that best fits your needs and budget",
      popular: "Most Popular",
      assisted: {
        title: "Assisted Service",
        description: "Provide your basic details and our team will handle the registration for you",
        features: ["Expert handling", "Quick turnaround", "Full support included", "Document review"],
        cta: "Get Started",
      },
      whatsapp: {
        title: "WhatsApp Support",
        description: "Get instant help and guidance through WhatsApp messaging",
        features: ["Instant messaging", "Real-time support", "Personalized guidance", "24/7 availability"],
        cta: "Get Started",
      },
    },
    testimonials: {
      title: "What Our Clients Say",
      items: [
        {
          text: "GeorgiaBiz Pro made registering my LLC so easy. The assisted service was perfect and I had my business registered in just 2 days!",
          name: "Maria Rodriguez",
          business: "Rodriguez Consulting LLC",
        },
        {
          text: "The assisted service was worth every penny. They handled everything while I focused on my business plan. Highly recommended!",
          name: "John Smith",
          business: "Smith Tech Solutions",
        },
        {
          text: "Great WhatsApp support! They answered all my questions quickly and helped me choose the right business structure.",
          name: "Sarah Johnson",
          business: "Johnson Marketing Agency",
        },
      ],
    },
    cta: {
      title: "Ready to Start Your Business?",
      subtitle: "Join thousands of entrepreneurs who have successfully registered their businesses in Georgia",
      button: "Start Registration",
      signin: "Sign In",
    },
    form: {
      businessType: "Business Type",
      businessInfo: "Business Information",
      personalAddress: "Personal Address",
      additionalInfo: "Additional Information",
      fields: {
        businessName: "Desired Business Name",
        businessEmail: "Business Email",
        phoneNumber: "Phone Number",
        industry: "Industry",
        businessDescription: "Brief Business Description",
        addressLine1: "Street Address",
        addressLine2: "Apt, Suite, etc. (optional)",
        city: "City",
        state: "State",
        zipCode: "ZIP Code",
        county: "County",
        currentLocation: "Current Location",
        preferredContactMethod: "Preferred Contact Method",
        bestTimeToContact: "Best Time to Contact",
        additionalNotes: "Additional Notes or Questions",
      },
      placeholders: {
        currentLocation: "City, State or Country",
        preferredContactMethod: "Email, Phone, etc.",
        bestTimeToContact: "Morning, Afternoon, etc.",
      },
      agreement:
        "I agree to the terms and conditions and authorize GeorgiaBiz Pro to register my business on my behalf. I understand that the registration fee is $299 and will be charged upon submission.",
      buttons: {
        needHelp: "Need Help?",
        submit: "Submit Registration Request",
        submitting: "Submitting...",
        backToHome: "Back to Home",
      },
    },
    businessTypes: {
      "domestic-llc": {
        title: "Limited Liability Company (LLC)",
        description: "Most popular choice for small businesses",
      },
      "domestic-profit": {
        title: "Domestic Profit Corporation",
        description: "Traditional corporation structure",
      },
      "domestic-nonprofit": {
        title: "Nonprofit Corporation",
        description: "For charitable and social causes",
      },
      "domestic-professional": {
        title: "Professional Corporation",
        description: "For licensed professionals",
      },
      "domestic-lp": {
        title: "Domestic Limited Partnership",
        description: "For businesses with limited partners",
      },
      "domestic-benefit": {
        title: "Domestic Benefit Corporation",
        description: "For social and environmental impact",
      },
    },
  },
  es: {
    hero: {
      badge: "Servicio Confiable de Registro de Empresas",
      title: "Registra Tu Empresa en Georgia con Confianza",
      subtitle:
        "Servicios de registro empresarial rápidos, seguros y profesionales. Ayudamos a emprendedores y empresas a comenzar en Georgia con orientación y apoyo experto.",
      cta: "Iniciar Registro",
      signup: "Crear Cuenta",
      features: [
        "Guía paso a paso a través de todo el proceso",
        "Soporte experto de especialistas en registro de empresas",
        "Seguro y conforme con las leyes del estado de Georgia",
      ],
    },
    features: {
      title: "¿Por Qué Elegirnos?",
      subtitle: "Hacemos que el registro empresarial sea simple, rápido y asequible",
      fast: {
        title: "Procesamiento Rápido",
        description: "Registra tu empresa rápidamente con nuestro proceso optimizado",
      },
      secure: {
        title: "Seguro y Legal",
        description: "Todos los registros se manejan de forma segura y cumplen con las leyes de Georgia",
      },
      support: {
        title: "Soporte Experto",
        description: "Nuestro equipo de expertos está aquí para ayudarte en cada paso",
      },
    },
    process: {
      title: "Proceso de Registro Simple",
      subtitle: "Hemos simplificado el proceso de registro empresarial en tres pasos fáciles",
      step1: {
        title: "Elige Tu Método",
        description: "Selecciona la opción de registro que mejor se adapte a tus necesidades y presupuesto",
      },
      step2: {
        title: "Proporciona Información",
        description: "Completa los detalles necesarios sobre tu empresa y preferencias",
      },
      step3: {
        title: "Regístrate",
        description: "Recibe tus documentos oficiales de registro empresarial y comienza a operar",
      },
    },
    services: {
      title: "Elige Tu Método de Registro",
      subtitle: "Selecciona la opción que mejor se adapte a tus necesidades y presupuesto",
      popular: "Más Popular",
      assisted: {
        title: "Servicio Asistido",
        description: "Proporciona tus datos básicos y nuestro equipo se encargará del registro por ti",
        features: ["Manejo experto", "Respuesta rápida", "Soporte completo incluido", "Revisión de documentos"],
        cta: "Comenzar",
      },
      whatsapp: {
        title: "Soporte WhatsApp",
        description: "Obtén ayuda instantánea y orientación a través de mensajería WhatsApp",
        features: [
          "Mensajería instantánea",
          "Soporte en tiempo real",
          "Orientación personalizada",
          "Disponibilidad 24/7",
        ],
        cta: "Comenzar",
      },
    },
    testimonials: {
      title: "Lo Que Dicen Nuestros Clientes",
      items: [
        {
          text: "GeorgiaBiz Pro hizo que registrar mi LLC fuera muy fácil. El servicio asistido fue perfecto y tuve mi empresa registrada en solo 2 días!",
          name: "María Rodríguez",
          business: "Rodriguez Consulting LLC",
        },
        {
          text: "El servicio asistido valió cada centavo. Se encargaron de todo mientras yo me enfocaba en mi plan de negocios. ¡Muy recomendado!",
          name: "Juan Smith",
          business: "Smith Tech Solutions",
        },
        {
          text: "¡Excelente soporte por WhatsApp! Respondieron todas mis preguntas rápidamente y me ayudaron a elegir la estructura empresarial correcta.",
          name: "Sara Johnson",
          business: "Johnson Marketing Agency",
        },
      ],
    },
    cta: {
      title: "¿Listo para Comenzar Tu Empresa?",
      subtitle: "Únete a miles de emprendedores que han registrado exitosamente sus empresas en Georgia",
      button: "Iniciar Registro",
      signin: "Iniciar Sesión",
    },
    form: {
      businessType: "Tipo de Empresa",
      businessInfo: "Información de la Empresa",
      personalAddress: "Dirección Personal",
      additionalInfo: "Información Adicional",
      fields: {
        businessName: "Nombre Deseado de la Empresa",
        businessEmail: "Correo Electrónico de la Empresa",
        phoneNumber: "Número de Teléfono",
        industry: "Industria",
        businessDescription: "Breve Descripción de la Empresa",
        addressLine1: "Dirección",
        addressLine2: "Apt, Suite, etc. (opcional)",
        city: "Ciudad",
        state: "Estado",
        zipCode: "Código Postal",
        county: "Condado",
        currentLocation: "Ubicación Actual",
        preferredContactMethod: "Método de Contacto Preferido",
        bestTimeToContact: "Mejor Hora para Contactar",
        additionalNotes: "Notas o Preguntas Adicionales",
      },
      placeholders: {
        currentLocation: "Ciudad, Estado o País",
        preferredContactMethod: "Correo, Teléfono, etc.",
        bestTimeToContact: "Mañana, Tarde, etc.",
      },
      agreement:
        "Acepto los términos y condiciones y autorizo a GeorgiaBiz Pro a registrar mi empresa en mi nombre. Entiendo que la tarifa de registro es de $299 y se cobrará al enviar.",
      buttons: {
        needHelp: "¿Necesitas Ayuda?",
        submit: "Enviar Solicitud de Registro",
        submitting: "Enviando...",
        backToHome: "Volver al Inicio",
      },
    },
    businessTypes: {
      "domestic-llc": {
        title: "Compañía de Responsabilidad Limitada (LLC)",
        description: "Opción más popular para pequeñas empresas",
      },
      "domestic-profit": {
        title: "Corporación Doméstica con Fines de Lucro",
        description: "Estructura corporativa tradicional",
      },
      "domestic-nonprofit": {
        title: "Corporación Sin Fines de Lucro",
        description: "Para causas benéficas y sociales",
      },
      "domestic-professional": {
        title: "Corporación Profesional",
        description: "Para profesionales con licencia",
      },
      "domestic-lp": {
        title: "Sociedad Limitada Doméstica",
        description: "Para empresas con socios limitados",
      },
      "domestic-benefit": {
        title: "Corporación de Beneficio Doméstica",
        description: "Para impacto social y ambiental",
      },
    },
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es") // Changed default to Spanish
  const [mounted, setMounted] = useState(false)

  // Hydration fix
  useEffect(() => {
    setMounted(true)

    // Check for saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    } else {
      // Set default to Spanish if no saved preference
      setLanguage("es")
    }
  }, [])

  // Save language preference
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
