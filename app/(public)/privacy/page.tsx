'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Back Button */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Take-am ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Business name and registration details</li>
                  <li>Bank account information for payments</li>
                  <li>Identity verification documents</li>
                  <li>Address and location information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transaction Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Details of products and services purchased or sold</li>
                  <li>Payment information and transaction history</li>
                  <li>Delivery and pickup details</li>
                  <li>Grading and quality assessment records</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>IP address and device information</li>
                  <li>Browsing history and interaction data</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Platform usage patterns and preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Providing and improving our platform services</li>
              <li>Processing transactions and payments</li>
              <li>Verifying user identity and preventing fraud</li>
              <li>Communicating with you about your account and transactions</li>
              <li>Analyzing platform usage and improving user experience</li>
              <li>Complying with legal obligations</li>
              <li>Protecting the rights and safety of our users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Sharing Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Other users necessary for transaction completion</li>
              <li>Payment processors and financial institutions</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Port your data to another service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform uses cookies to enhance your experience. You can control cookie settings through your browser. Disabling cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Take-am is not intended for children under 18. We do not knowingly collect information from children. If we become aware that a child has provided us with personal information, we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our platform and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:<br />
              Email: privacy@takeam.com<br />
              Address: Victoria Island, Lagos, Nigeria
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Take-am. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
