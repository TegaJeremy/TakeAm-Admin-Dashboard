'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
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
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions about Take-am? We'd love to hear from you. Reach out to us using any of the methods below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="What is this about?"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-blue-600">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@takeam.com</p>
                  <p className="text-muted-foreground">support@takeam.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+234 (0) 123 4567 890</p>
                  <p className="text-muted-foreground">Monday - Friday, 9 AM - 6 PM WAT</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    Take-am Headquarters<br />
                    Victoria Island, Lagos<br />
                    Nigeria
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
                  <p>Saturday: 10:00 AM - 4:00 PM WAT</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do I register as a trader?",
                  a: "Visit the main app and click 'Register.' You'll need to provide basic business information and identity verification."
                },
                {
                  q: "Is there a registration fee?",
                  a: "No registration is free. We only take a small commission on successful transactions."
                },
                {
                  q: "How long does payment take?",
                  a: "Payments are processed within 24-48 hours after delivery confirmation and grading."
                },
                {
                  q: "What if there's a dispute?",
                  a: "Our support team helps resolve disputes through our transparent dispute resolution process."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border bg-card/50">
                  <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
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
