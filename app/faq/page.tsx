"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, MessageCircle, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    titleEs: "Preguntas Generales",
    faqs: [
      {
        question: "What is GeorgiaBiz Pro?",
        questionEs: "¿Qué es GeorgiaBiz Pro?",
        answer: "GeorgiaBiz Pro is a professional business registration service that helps entrepreneurs register their businesses in the state of Georgia, USA. We offer both DIY (Do-It-Yourself) and Assisted registration options to meet your needs.",
        answerEs: "GeorgiaBiz Pro es un servicio profesional de registro de empresas que ayuda a los emprendedores a registrar sus negocios en el estado de Georgia, EE.UU. Ofrecemos opciones de registro DIY (Hazlo tú mismo) y Asistido para satisfacer sus necesidades."
      },
      {
        question: "How long does the registration process take?",
        questionEs: "¿Cuánto tiempo toma el proceso de registro?",
        answer: "The standard processing time is 5-7 business days. With our expedited processing service, you can get your business registered in as little as 24-48 hours.",
        answerEs: "El tiempo de procesamiento estándar es de 5-7 días hábiles. Con nuestro servicio de procesamiento acelerado, puede registrar su negocio en tan solo 24-48 horas."
      },
      {
        question: "Do I need to be a US citizen to register a business in Georgia?",
        questionEs: "¿Necesito ser ciudadano estadounidense para registrar un negocio en Georgia?",
        answer: "No, you do not need to be a US citizen to register a business in Georgia. Foreign nationals can form LLCs and corporations in Georgia. However, you will need a registered agent with a physical address in Georgia.",
        answerEs: "No, no necesita ser ciudadano estadounidense para registrar un negocio en Georgia. Los ciudadanos extranjeros pueden formar LLCs y corporaciones en Georgia. Sin embargo, necesitará un agente registrado con una dirección física en Georgia."
      },
      {
        question: "What documents will I receive after registration?",
        questionEs: "¿Qué documentos recibiré después del registro?",
        answer: "After successful registration, you will receive your Certificate of Formation/Incorporation, a copy of your filed Articles, and any additional documents based on your selected services (Operating Agreement, EIN confirmation, etc.).",
        answerEs: "Después del registro exitoso, recibirá su Certificado de Formación/Incorporación, una copia de sus Artículos presentados y cualquier documento adicional según los servicios seleccionados (Acuerdo Operativo, confirmación de EIN, etc.)."
      }
    ]
  },
  {
    id: "llc",
    title: "LLC Formation",
    titleEs: "Formación de LLC",
    faqs: [
      {
        question: "What is an LLC and why should I form one?",
        questionEs: "¿Qué es una LLC y por qué debería formar una?",
        answer: "An LLC (Limited Liability Company) is a business structure that provides personal liability protection while offering flexibility in management and tax treatment. It's the most popular choice for small businesses because it combines the liability protection of a corporation with the tax benefits and simplicity of a partnership.",
        answerEs: "Una LLC (Compañía de Responsabilidad Limitada) es una estructura empresarial que proporciona protección de responsabilidad personal mientras ofrece flexibilidad en la gestión y el tratamiento fiscal. Es la opción más popular para pequeñas empresas porque combina la protección de responsabilidad de una corporación con los beneficios fiscales y la simplicidad de una sociedad."
      },
      {
        question: "How many members can an LLC have?",
        questionEs: "¿Cuántos miembros puede tener una LLC?",
        answer: "An LLC can have one member (single-member LLC) or multiple members. There is no maximum limit on the number of members an LLC can have in Georgia.",
        answerEs: "Una LLC puede tener un miembro (LLC de un solo miembro) o múltiples miembros. No hay límite máximo en el número de miembros que puede tener una LLC en Georgia."
      },
      {
        question: "Do I need an Operating Agreement?",
        questionEs: "¿Necesito un Acuerdo Operativo?",
        answer: "While Georgia does not legally require an Operating Agreement, it is highly recommended. An Operating Agreement outlines the ownership structure, member responsibilities, and operating procedures of your LLC. It helps prevent disputes and provides credibility with banks and vendors.",
        answerEs: "Aunque Georgia no requiere legalmente un Acuerdo Operativo, es altamente recomendado. Un Acuerdo Operativo describe la estructura de propiedad, las responsabilidades de los miembros y los procedimientos operativos de su LLC. Ayuda a prevenir disputas y proporciona credibilidad con bancos y proveedores."
      },
      {
        question: "What is a Registered Agent and do I need one?",
        questionEs: "¿Qué es un Agente Registrado y necesito uno?",
        answer: "A Registered Agent is a person or company designated to receive legal documents and official correspondence on behalf of your business. Yes, all Georgia LLCs must have a Registered Agent with a physical address in Georgia. We offer Registered Agent services as part of our packages.",
        answerEs: "Un Agente Registrado es una persona o empresa designada para recibir documentos legales y correspondencia oficial en nombre de su negocio. Sí, todas las LLCs de Georgia deben tener un Agente Registrado con una dirección física en Georgia. Ofrecemos servicios de Agente Registrado como parte de nuestros paquetes."
      }
    ]
  },
  {
    id: "pricing",
    title: "Pricing & Payment",
    titleEs: "Precios y Pagos",
    faqs: [
      {
        question: "What are the costs involved in registering a business?",
        questionEs: "¿Cuáles son los costos involucrados en registrar un negocio?",
        answer: "Our DIY registration starts at $99, and our Assisted registration is $299. These prices include the state filing fee. Additional services like EIN application ($50), Registered Agent service ($99/year), and Operating Agreement ($150) are available as add-ons.",
        answerEs: "Nuestro registro DIY comienza en $99, y nuestro registro Asistido es de $299. Estos precios incluyen la tarifa de presentación estatal. Servicios adicionales como la solicitud de EIN ($50), servicio de Agente Registrado ($99/año) y Acuerdo Operativo ($150) están disponibles como complementos."
      },
      {
        question: "What payment methods do you accept?",
        questionEs: "¿Qué métodos de pago aceptan?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, and PayPal. All payments are processed securely through our encrypted payment system.",
        answerEs: "Aceptamos todas las tarjetas de crédito principales (Visa, MasterCard, American Express, Discover), tarjetas de débito y PayPal. Todos los pagos se procesan de forma segura a través de nuestro sistema de pago encriptado."
      },
      {
        question: "Is there a money-back guarantee?",
        questionEs: "¿Hay garantía de devolución de dinero?",
        answer: "Yes, we offer a 100% satisfaction guarantee. If we are unable to successfully file your business registration with the state, we will provide a full refund of our service fees. Note that state filing fees are non-refundable once submitted to the state.",
        answerEs: "Sí, ofrecemos una garantía de satisfacción del 100%. Si no podemos presentar exitosamente el registro de su negocio con el estado, proporcionaremos un reembolso completo de nuestras tarifas de servicio. Tenga en cuenta que las tarifas de presentación estatal no son reembolsables una vez enviadas al estado."
      },
      {
        question: "Are there any annual fees or renewals?",
        questionEs: "¿Hay tarifas anuales o renovaciones?",
        answer: "Georgia requires an Annual Registration fee of $50 for LLCs, due each year by April 1st. If you use our Registered Agent service, there is an annual fee of $99. We'll send you reminders before any renewals are due.",
        answerEs: "Georgia requiere una tarifa de Registro Anual de $50 para LLCs, que vence cada año antes del 1 de abril. Si utiliza nuestro servicio de Agente Registrado, hay una tarifa anual de $99. Le enviaremos recordatorios antes de que venzan las renovaciones."
      }
    ]
  },
  {
    id: "process",
    title: "Registration Process",
    titleEs: "Proceso de Registro",
    faqs: [
      {
        question: "What information do I need to register my business?",
        questionEs: "¿Qué información necesito para registrar mi negocio?",
        answer: "You'll need: 1) Desired business name, 2) Business address, 3) Registered Agent information, 4) Member/Owner information including names and addresses, 5) Business purpose description, and 6) Contact information.",
        answerEs: "Necesitará: 1) Nombre comercial deseado, 2) Dirección comercial, 3) Información del Agente Registrado, 4) Información del miembro/propietario incluyendo nombres y direcciones, 5) Descripción del propósito comercial, y 6) Información de contacto."
      },
      {
        question: "How do I check if my business name is available?",
        questionEs: "¿Cómo verifico si mi nombre comercial está disponible?",
        answer: "We perform a complimentary name availability check as part of our registration process. You can also search the Georgia Secretary of State's database directly. Your business name must be distinguishable from existing registered entities.",
        answerEs: "Realizamos una verificación de disponibilidad de nombre de cortesía como parte de nuestro proceso de registro. También puede buscar directamente en la base de datos del Secretario de Estado de Georgia. El nombre de su negocio debe ser distinguible de las entidades registradas existentes."
      },
      {
        question: "Can I make changes after submitting my registration?",
        questionEs: "¿Puedo hacer cambios después de enviar mi registro?",
        answer: "If your registration hasn't been filed with the state yet, we can make changes at no additional cost. After filing, changes require filing amendments with the state, which may incur additional fees.",
        answerEs: "Si su registro aún no se ha presentado ante el estado, podemos hacer cambios sin costo adicional. Después de la presentación, los cambios requieren presentar enmiendas ante el estado, lo que puede incurrir en tarifas adicionales."
      },
      {
        question: "What happens after I submit my registration?",
        questionEs: "¿Qué sucede después de enviar mi registro?",
        answer: "After submission: 1) We review your information for accuracy, 2) File your documents with the Georgia Secretary of State, 3) You receive confirmation and tracking information, 4) Once approved, we send your official documents via email and mail.",
        answerEs: "Después del envío: 1) Revisamos su información para verificar la exactitud, 2) Presentamos sus documentos ante el Secretario de Estado de Georgia, 3) Recibe confirmación e información de seguimiento, 4) Una vez aprobado, enviamos sus documentos oficiales por correo electrónico y correo postal."
      }
    ]
  },
  {
    id: "taxes",
    title: "Taxes & EIN",
    titleEs: "Impuestos y EIN",
    faqs: [
      {
        question: "What is an EIN and do I need one?",
        questionEs: "¿Qué es un EIN y necesito uno?",
        answer: "An EIN (Employer Identification Number) is a federal tax ID number issued by the IRS. You need an EIN if you plan to hire employees, open a business bank account, or file certain tax returns. We recommend all businesses obtain an EIN.",
        answerEs: "Un EIN (Número de Identificación del Empleador) es un número de identificación fiscal federal emitido por el IRS. Necesita un EIN si planea contratar empleados, abrir una cuenta bancaria comercial o presentar ciertas declaraciones de impuestos. Recomendamos que todos los negocios obtengan un EIN."
      },
      {
        question: "How is an LLC taxed?",
        questionEs: "¿Cómo se grava una LLC?",
        answer: "By default, a single-member LLC is taxed as a sole proprietorship (pass-through taxation), and a multi-member LLC is taxed as a partnership. LLCs can also elect to be taxed as an S-Corp or C-Corp. We recommend consulting with a tax professional for your specific situation.",
        answerEs: "Por defecto, una LLC de un solo miembro se grava como propietario único (tributación de transferencia), y una LLC de múltiples miembros se grava como sociedad. Las LLCs también pueden elegir ser gravadas como S-Corp o C-Corp. Recomendamos consultar con un profesional de impuestos para su situación específica."
      },
      {
        question: "Do I need to collect sales tax?",
        questionEs: "¿Necesito cobrar impuesto sobre las ventas?",
        answer: "If you sell taxable goods or services in Georgia, you'll need to register for a Sales Tax Number and collect sales tax. Georgia's state sales tax rate is 4%, with additional local taxes that vary by county.",
        answerEs: "Si vende bienes o servicios gravables en Georgia, deberá registrarse para obtener un Número de Impuesto sobre las Ventas y cobrar el impuesto sobre las ventas. La tasa del impuesto estatal sobre las ventas de Georgia es del 4%, con impuestos locales adicionales que varían según el condado."
      }
    ]
  }
]

export default function FAQPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => {
      const question = language === "es" ? faq.questionEs : faq.question
      const answer = language === "es" ? faq.answerEs : faq.answer
      return question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             answer.toLowerCase().includes(searchQuery.toLowerCase())
    })
  })).filter(category => category.faqs.length > 0)

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
              {language === "es" ? "Centro de Ayuda" : "Help Center"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {language === "es" 
                ? "Encuentre respuestas a las preguntas más comunes sobre el registro de empresas en Georgia"
                : "Find answers to the most common questions about business registration in Georgia"}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === "es" ? "Buscar preguntas..." : "Search questions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="sticky top-24 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {language === "es" ? "Categorías" : "Categories"}
                </h3>
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {language === "es" ? category.titleEs : category.title}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1"
            >
              {(searchQuery ? filteredFaqs : faqCategories.filter(c => c.id === activeCategory)).map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "es" ? category.titleEs : category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className="border border-gray-200 rounded-xl px-6 data-[state=open]:bg-blue-50/50"
                      >
                        <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-5">
                          {language === "es" ? faq.questionEs : faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                          {language === "es" ? faq.answerEs : faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              {language === "es" ? "¿Todavía tienes preguntas?" : "Still have questions?"}
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {language === "es" 
                ? "Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta que tengas"
                : "Our support team is here to help you with any questions you may have"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  {language === "es" ? "Contáctanos" : "Contact Us"}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white text-white hover:bg-white/20"
                asChild
              >
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

