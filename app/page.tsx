"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { ServiceCard } from "@/components/service-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { FeatureCard } from "@/components/feature-card"
import { StatsCounter } from "@/components/stats-counter"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const { translations } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-screen"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCounter value={5000} label="Businesses Registered" />
            <StatsCounter value={98} label="Success Rate %" />
            <StatsCounter value={24} label="Hour Support" />
            <StatsCounter value={15} label="Years Experience" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">{translations.features.title}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Streamlined Business Registration</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{translations.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="clock"
              title={translations.features.fast.title}
              description={translations.features.fast.description}
              color="blue"
            />
            <FeatureCard
              icon="shield"
              title={translations.features.secure.title}
              description={translations.features.secure.description}
              color="green"
            />
            <FeatureCard
              icon="users"
              title={translations.features.support.title}
              description={translations.features.support.description}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Process Section - Keep all 3 steps */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{translations.process.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{translations.process.subtitle}</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white">
                  <span className="text-blue-600 text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{translations.process.step1.title}</h3>
                <p className="text-gray-600">{translations.process.step1.description}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white">
                  <span className="text-green-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{translations.process.step2.title}</h3>
                <p className="text-gray-600">{translations.process.step2.description}</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white">
                  <span className="text-purple-600 text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{translations.process.step3.title}</h3>
                <p className="text-gray-600">{translations.process.step3.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options - Only 2 Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{translations.services.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{translations.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 max-w-4xl mx-auto">
            {/* Assisted Option */}
            <ServiceCard
              icon="users"
              title={translations.services.assisted.title}
              description={translations.services.assisted.description}
              features={translations.services.assisted.features}
              ctaText={translations.services.assisted.cta}
              ctaLink="/register/assisted"
              color="green"
              popular={true}
              popularText={translations.services.popular}
            />

            {/* WhatsApp Option */}
            <ServiceCard
              icon="message-circle"
              title={translations.services.whatsapp.title}
              description={translations.services.whatsapp.description}
              features={translations.services.whatsapp.features}
              ctaText={translations.services.whatsapp.cta}
              ctaLink="https://wa.me/1234567890?text=Hello, I need help registering my business in Georgia"
              color="emerald"
              isExternal={true}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{translations.testimonials.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from entrepreneurs who successfully registered their businesses with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {translations.testimonials.items.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.text}
                author={testimonial.name}
                company={testimonial.business}
                rating={5}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed button text */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{translations.cta.title}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{translations.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register/assisted">Start Registration</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
