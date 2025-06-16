import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: June 8, 2024</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to GeorgiaBiz Pro. These Terms of Service ("Terms") govern your use of our website, services, and
              applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by
              these Terms.
            </p>

            <h2>2. Definitions</h2>
            <p>
              <strong>"GeorgiaBiz Pro"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>{" "}
              refers to the company operating the Services.
            </p>
            <p>
              <strong>"User"</strong>, <strong>"you"</strong>, or <strong>"your"</strong> refers to the individual or
              entity using our Services.
            </p>
            <p>
              <strong>"Content"</strong> refers to any information, data, text, software, graphics, messages, or other
              materials that are uploaded, posted, or otherwise transmitted through our Services.
            </p>

            <h2>3. Account Registration</h2>
            <p>
              To access certain features of our Services, you may be required to register for an account. You agree to
              provide accurate, current, and complete information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2>4. Services and Fees</h2>
            <p>
              GeorgiaBiz Pro offers business registration services in the state of Georgia. Our fees are clearly
              displayed before you complete any transaction. By proceeding with a transaction, you agree to pay all fees
              associated with the selected service.
            </p>
            <p>
              We reserve the right to modify our fees at any time. Any fee changes will not apply to services already
              purchased.
            </p>

            <h2>5. User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our Services for any illegal purpose or in violation of any local, state, or federal law</li>
              <li>Violate or infringe other people's intellectual property, privacy, or other rights</li>
              <li>
                Interfere with or disrupt the integrity or performance of our Services or the data contained therein
              </li>
              <li>Attempt to gain unauthorized access to our Services or related systems or networks</li>
              <li>Use our Services to transmit any viruses, malware, or other harmful computer code</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Services, including but not limited to text, graphics,
              logos, icons, and software, are owned by GeorgiaBiz Pro or its licensors and are protected by United
              States and international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, GeorgiaBiz Pro shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
              or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your use of or inability to use our Services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from our Services</li>
              <li>Any bugs, viruses, or other harmful code that may be transmitted through our Services</li>
            </ul>

            <h2>8. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless GeorgiaBiz Pro and its officers, directors, employees,
              and agents from and against any claims, liabilities, damages, losses, and expenses, including, without
              limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access
              to or use of the Services or your violation of these Terms.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our Services immediately, without prior notice or
              liability, for any reason, including, without limitation, if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Services will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Services.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Georgia,
              without regard to its conflict of law provisions.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@georgiabizpro.com">legal@georgiabizpro.com</a>.
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              By using our Services, you acknowledge that you have read and understood these Terms and agree to be bound
              by them.
            </p>
            <p className="mt-4">
              <Link href="/privacy" className="text-blue-600 hover:underline">
                View our Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
