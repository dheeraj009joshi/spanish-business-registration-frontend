"use client"

import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="GeorgiaBiz Pro Logo"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="text-xl font-bold">GeorgiaBiz Pro</h3>
            </div>
            <p className="text-gray-400 mb-6">
              {language === "es"
                ? "Su socio de confianza para el registro de empresas en Georgia. Hacemos el proceso simple, rápido y asequible."
                : "Your trusted partner for business registration in Georgia. We make the process simple, fast, and affordable."}
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Atlanta, Georgia, USA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">business@registrarnegocio.com</span>
              </div>
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === "es" ? "Servicios" : "Services"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Todos los Servicios" : "All Services"}
                </Link>
              </li>
              <li>
                <Link href="/register/assisted" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Registro Asistido" : "Assisted Registration"}
                </Link>
              </li>
              <li>
                <Link href="/register/diy" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Registro DIY" : "DIY Registration"}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {language === "es" ? "Soporte WhatsApp" : "WhatsApp Support"}
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Consulta de Negocios" : "Business Consultation"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === "es" ? "Recursos" : "Resources"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Preguntas Frecuentes" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Guía de Negocios" : "Business Guide"}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Tipos de Entidades" : "Entity Types"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Precios" : "Pricing"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Centro de Ayuda" : "Help Center"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === "es" ? "Empresa" : "Company"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Sobre Nosotros" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Contacto" : "Contact"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Política de Privacidad" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {language === "es" ? "Términos de Servicio" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} GeorgiaBiz Pro. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-green-500">🇺🇸</span>
            <span>{language === "es" ? "Sirviendo a Georgia, EE.UU." : "Serving Georgia, USA"}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
