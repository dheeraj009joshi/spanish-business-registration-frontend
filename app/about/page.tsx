"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle, 
  Users, 
  Award, 
  Clock, 
  Globe, 
  Target, 
  Heart,
  Shield,
  Zap,
  TrendingUp,
  Building2,
  Star
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

const stats = [
  { value: "5,000+", label: "Businesses Registered", labelEs: "Empresas Registradas" },
  { value: "98%", label: "Success Rate", labelEs: "Tasa de Éxito" },
  { value: "15+", label: "Years Experience", labelEs: "Años de Experiencia" },
  { value: "24/7", label: "Support Available", labelEs: "Soporte Disponible" }
]

const values = [
  {
    icon: Users,
    title: "Customer First",
    titleEs: "Cliente Primero",
    description: "We prioritize your needs and provide personalized solutions to ensure your success.",
    descriptionEs: "Priorizamos sus necesidades y proporcionamos soluciones personalizadas para asegurar su éxito.",
    color: "blue"
  },
  {
    icon: Award,
    title: "Excellence",
    titleEs: "Excelencia",
    description: "We strive for excellence in every aspect of our service, from our platform to our support.",
    descriptionEs: "Nos esforzamos por la excelencia en cada aspecto de nuestro servicio, desde nuestra plataforma hasta nuestro soporte.",
    color: "green"
  },
  {
    icon: Clock,
    title: "Efficiency",
    titleEs: "Eficiencia",
    description: "We value your time and work to make the registration process as quick and efficient as possible.",
    descriptionEs: "Valoramos su tiempo y trabajamos para hacer el proceso de registro lo más rápido y eficiente posible.",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Integrity",
    titleEs: "Integridad",
    description: "We operate with transparency and honesty, building trust with our clients and partners.",
    descriptionEs: "Operamos con transparencia y honestidad, construyendo confianza con nuestros clientes y socios.",
    color: "orange"
  }
]

const features = [
  {
    icon: Zap,
    title: "Fast Processing",
    titleEs: "Procesamiento Rápido",
    description: "Get your business registered in as little as 24-48 hours with expedited processing.",
    descriptionEs: "Registre su negocio en tan solo 24-48 horas con procesamiento acelerado."
  },
  {
    icon: Globe,
    title: "Bilingual Support",
    titleEs: "Soporte Bilingüe",
    description: "Full English and Spanish support to serve our diverse community of entrepreneurs.",
    descriptionEs: "Soporte completo en inglés y español para servir a nuestra diversa comunidad de emprendedores."
  },
  {
    icon: TrendingUp,
    title: "Expert Guidance",
    titleEs: "Orientación Experta",
    description: "Our team of specialists guides you through every step of the registration process.",
    descriptionEs: "Nuestro equipo de especialistas le guía a través de cada paso del proceso de registro."
  },
  {
    icon: Building2,
    title: "All Business Types",
    titleEs: "Todos los Tipos de Negocios",
    description: "We handle LLCs, corporations, nonprofits, and more - whatever your business needs.",
    descriptionEs: "Manejamos LLCs, corporaciones, sin fines de lucro y más - lo que su negocio necesite."
  }
]

const team = [
  {
    name: "Sarah Johnson",
    nameEs: "Sarah Johnson",
    role: "CEO & Founder",
    roleEs: "CEO y Fundadora",
    bio: "With over 15 years of experience in business registration and corporate law in Georgia.",
    bioEs: "Con más de 15 años de experiencia en registro de empresas y derecho corporativo en Georgia.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "Michael Chen",
    nameEs: "Michael Chen",
    role: "Chief Legal Officer",
    roleEs: "Director Legal",
    bio: "Former corporate attorney specializing in business formation and compliance.",
    bioEs: "Ex abogado corporativo especializado en formación de empresas y cumplimiento.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "María García",
    nameEs: "María García",
    role: "Customer Success Manager",
    roleEs: "Gerente de Éxito del Cliente",
    bio: "Dedicated to ensuring clients have a smooth and successful registration experience.",
    bioEs: "Dedicada a asegurar que los clientes tengan una experiencia de registro fluida y exitosa.",
    image: "/placeholder-user.jpg"
  }
]

export default function AboutPage() {
  const { language } = useLanguage()

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      green: { bg: "bg-green-100", text: "text-green-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
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
              {language === "es" ? "Sobre Nosotros" : "About Us"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "es" ? "Sobre GeorgiaBiz Pro" : "About GeorgiaBiz Pro"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "es"
                ? "Estamos dedicados a hacer que el registro de empresas en Georgia sea simple, rápido y sin estrés para emprendedores y dueños de negocios."
                : "We're dedicated to making business registration in Georgia simple, fast, and stress-free for entrepreneurs and business owners."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white -mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600 text-sm">
                      {language === "es" ? stat.labelEs : stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-green-100 text-green-800">
                {language === "es" ? "Nuestra Misión" : "Our Mission"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {language === "es" 
                  ? "Empoderando Emprendedores en Georgia"
                  : "Empowering Entrepreneurs in Georgia"}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {language === "es"
                  ? "En GeorgiaBiz Pro, nuestra misión es empoderar a los emprendedores simplificando el proceso de registro de empresas en Georgia. Creemos que iniciar un negocio debe ser un viaje emocionante, no una pesadilla burocrática."
                  : "At GeorgiaBiz Pro, our mission is to empower entrepreneurs by simplifying the business registration process in Georgia. We believe that starting a business should be an exciting journey, not a bureaucratic nightmare."}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {language === "es"
                  ? "Combinamos tecnología con conocimiento experto para proporcionar una experiencia de registro perfecta, permitiéndole enfocarse en lo que más importa: hacer crecer su negocio."
                  : "We combine technology with expert knowledge to provide a seamless registration experience, allowing you to focus on what matters most – growing your business."}
              </p>
              <div className="space-y-4">
                {[
                  { en: "Simplify complex registration processes", es: "Simplificar procesos de registro complejos" },
                  { en: "Provide expert guidance and support", es: "Proporcionar orientación y soporte experto" },
                  { en: "Ensure compliance with Georgia state laws", es: "Asegurar cumplimiento con las leyes de Georgia" },
                  { en: "Serve the Hispanic community with bilingual support", es: "Servir a la comunidad hispana con soporte bilingüe" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="mr-4 bg-green-100 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">{language === "es" ? item.es : item.en}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white">
                <div className="text-center">
                  <Target className="w-16 h-16 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">
                    {language === "es" ? "Nuestra Visión" : "Our Vision"}
                  </h3>
                  <p className="text-lg opacity-90">
                    {language === "es"
                      ? "Ser el servicio de registro de empresas más confiable y accesible para emprendedores hispanos en los Estados Unidos."
                      : "To be the most trusted and accessible business registration service for Hispanic entrepreneurs in the United States."}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              {language === "es" ? "Nuestros Valores" : "Our Values"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Lo Que Nos Define" : "What Defines Us"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es"
                ? "Estos principios fundamentales guían todo lo que hacemos en GeorgiaBiz Pro"
                : "These core principles guide everything we do at GeorgiaBiz Pro"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const colors = getColorClasses(value.color)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <value.icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {language === "es" ? value.titleEs : value.title}
                      </h3>
                      <p className="text-gray-600">
                        {language === "es" ? value.descriptionEs : value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-orange-100 text-orange-800">
              {language === "es" ? "Por Qué Elegirnos" : "Why Choose Us"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Lo Que Nos Hace Diferentes" : "What Makes Us Different"}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {language === "es" ? feature.titleEs : feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {language === "es" ? feature.descriptionEs : feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              {language === "es" ? "Nuestro Equipo" : "Our Team"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Conozca a los Expertos" : "Meet the Experts"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "es"
                ? "Profesionales dedicados a su éxito empresarial"
                : "Professionals dedicated to your business success"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg text-center overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                      <Users className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-gray-900">
                      {language === "es" ? member.nameEs : member.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">
                      {language === "es" ? member.roleEs : member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === "es" ? member.bioEs : member.bio}
                    </p>
                  </CardContent>
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
                ? "¿Listo para Comenzar Su Negocio?" 
                : "Ready to Start Your Business?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {language === "es"
                ? "Únase a miles de emprendedores que han registrado exitosamente sus negocios en Georgia con nuestra ayuda."
                : "Join thousands of entrepreneurs who have successfully registered their businesses in Georgia with our help."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/assisted">
                  {language === "es" ? "Comenzar Registro" : "Start Registration"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-green-700 border-white hover:bg-white/90" asChild>
                <Link href="/contact">
                  {language === "es" ? "Contáctenos" : "Contact Us"}
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
