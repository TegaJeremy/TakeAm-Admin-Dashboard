'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
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
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How Take-am Works</h1>
            <p className="text-lg text-muted-foreground">
              A comprehensive platform connecting traders with food waste to buyers and logistics providers in Lagos.
            </p>
          </div>

          {/* For Traders Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8">For Traders</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Register Your Business",
                  description: "Create an account and register your trading business on the Take-am platform. Verify your identity and business details."
                },
                {
                  step: 2,
                  title: "Post Your Inventory",
                  description: "List available food items with quantities, quality grade (A, B, C, D), and pricing. Update inventory as stock changes."
                },
                {
                  step: 3,
                  title: "Receive Requests",
                  description: "Get pickup requests from assigned agents or direct buyers interested in your food items."
                },
                {
                  step: 4,
                  title: "Arrange Pickup",
                  description: "Coordinate with logistics partners or buyers to arrange convenient pickup times and delivery."
                },
                {
                  step: 5,
                  title: "Get Paid",
                  description: "Receive payment through your verified bank account after items are graded and delivered."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10">
                      <span className="text-accent font-semibold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* For Agents Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8">For Logistics Agents</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Get Certified",
                  description: "Apply as a logistics agent with proper identity verification and business documentation."
                },
                {
                  step: 2,
                  title: "Manage Territory",
                  description: "You're assigned a market area to manage traders and oversee pickup requests in your zone."
                },
                {
                  step: 3,
                  title: "Process Requests",
                  description: "View and manage trader pickup requests, coordinate logistics, and track deliveries."
                },
                {
                  step: 4,
                  title: "Grade & Report",
                  description: "Inspect and grade food items upon delivery, report findings on the platform."
                },
                {
                  step: 5,
                  title: "Earn Commissions",
                  description: "Earn fixed commissions on each successful pickup and delivery you facilitate."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10">
                      <span className="text-blue-500 font-semibold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* For Buyers Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8">For Buyers</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Browse Inventory",
                  description: "Search and browse food items available from traders across Lagos markets."
                },
                {
                  step: 2,
                  title: "Check Quality & Price",
                  description: "View quality grades, photos, availability, and pricing for all items."
                },
                {
                  step: 3,
                  title: "Place Order",
                  description: "Select items and quantities, place your order through the platform."
                },
                {
                  step: 4,
                  title: "Arrange Delivery",
                  description: "Coordinate pickup time or arrange delivery through our logistics partners."
                },
                {
                  step: 5,
                  title: "Receive & Pay",
                  description: "Receive your items and pay securely through the platform. Receive invoice and receipt."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/10">
                      <span className="text-emerald-500 font-semibold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">Key Platform Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Real-time inventory updates",
                "Secure payment processing",
                "Quality grading system",
                "Logistics coordination",
                "Audit trail for transparency",
                "Mobile-friendly interface",
                "Analytics dashboard",
                "Support team assistance"
              ].map((feature) => (
                <div key={feature} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
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
