import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Last updated: June 8, 2024</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At GeorgiaBiz Pro, we respect your privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website or use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the site or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Data</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Submit a business registration form</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us through our website</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>The personal information we collect may include:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Business information</li>
              <li>Payment information</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Referring URLs</li>
              <li>Access times</li>
              <li>Pages viewed</li>
            </ul>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain
              information. Cookies are files with a small amount of data that may include an anonymous unique
              identifier.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our services</li>
              <li>Process and complete transactions</li>
              <li>Send administrative information, such as updates or changes to our policies</li>
              <li>Respond to inquiries and offer support</li>
              <li>Send promotional communications, such as special offers or newsletters</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Improve our website and services</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>We may share your information in the following situations:</p>
            <ul>
              <li>
                <strong>Business Partners:</strong> We may share your information with our business partners to offer
                you certain products, services, or promotions.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors, service
                providers, and other third parties who perform services for us.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or
                in response to valid requests by public authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                portion of our business.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may disclose your information for any other purpose with your
                consent.
              </li>
            </ul>

            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information.
              While we have taken reasonable steps to secure the information you provide to us, please be aware that no
              security measures are perfect or impenetrable, and we cannot guarantee the security of your information.
            </p>

            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
            <ul>
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this page. You are advised
              to review this Privacy Policy periodically for any changes.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@georgiabizpro.com">privacy@georgiabizpro.com</a>.
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              By using our Services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <p className="mt-4">
              <Link href="/terms" className="text-blue-600 hover:underline">
                View our Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
