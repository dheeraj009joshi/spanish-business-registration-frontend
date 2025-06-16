"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Users, Award, Clock, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About GeorgiaBiz Pro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to making business registration in Georgia simple, fast, and stress-free for entrepreneurs
            and business owners.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At GeorgiaBiz Pro, our mission is to empower entrepreneurs by simplifying the business registration
                process in Georgia. We believe that starting a business should be an exciting journey, not a
                bureaucratic nightmare.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We combine technology with expert knowledge to provide a seamless registration experience, allowing you
                to focus on what matters most – growing your business.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Simplify complex registration processes</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Provide expert guidance and support</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Ensure compliance with Georgia state laws</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Team meeting"
                  className="w-full h-auto"
                  width={600}
                  height={400}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at GeorgiaBiz Pro
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer First</h3>
              <p className="text-gray-600">
                We prioritize your needs and provide personalized solutions to ensure your success.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from our platform to our support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Efficiency</h3>
              <p className="text-gray-600">
                We value your time and work to make the registration process as quick and efficient as possible.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We operate with transparency and honesty, building trust with our clients and partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the experts behind GeorgiaBiz Pro who are dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=160&width=160"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
              <p className="text-blue-600 mb-3">CEO & Founder</p>
              <p className="text-gray-600">
                With over 15 years of experience in business registration and corporate law in Georgia.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=160&width=160"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Michael Chen</h3>
              <p className="text-blue-600 mb-3">Chief Legal Officer</p>
              <p className="text-gray-600">
                Former corporate attorney specializing in business formation and compliance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/placeholder.svg?height=160&width=160"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">David Rodriguez</h3>
              <p className="text-blue-600 mb-3">Customer Success Manager</p>
              <p className="text-gray-600">
                Dedicated to ensuring clients have a smooth and successful registration experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of entrepreneurs who have successfully registered their businesses in Georgia with our help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register/diy">Start Registration</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
