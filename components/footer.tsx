import Link from "next/link"

export function Footer() {
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
              Your trusted partner for business registration in Georgia. We make the process simple, fast, and
              affordable.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">📍 123 Business Ave, Atlanta, GA</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">📞 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">✉️ info@georgiabizpro.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/register/assisted" className="text-gray-400 hover:text-white transition-colors">
                  Assisted Registration
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/1234567890?text=Hello, I need help registering my business in Georgia"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Business Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Document Preparation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Legal Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Business Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Legal Requirements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  State Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} GeorgiaBiz Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
