'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Take-am</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Take-am is a revolutionary food waste recovery platform designed to address the critical challenges of food waste in Lagos while creating economic opportunities for traders, logistics partners, and buyers.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To transform food waste into value by connecting market traders with logistics partners and buyers, creating a sustainable ecosystem that reduces waste, supports livelihoods, and builds a more resilient food system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Lagos where food waste is minimized, resources are efficiently recovered, and all stakeholders in the food chain benefit from fair and transparent transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every day, significant quantities of usable food are wasted in Lagos markets. This waste represents lost economic value for traders, missed opportunities for buyers seeking affordable stock, and environmental challenges. The lack of coordination between traders, logistics, and buyers makes food recovery inefficient.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Solution</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Take-am provides a comprehensive digital platform that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Connects traders with food waste to interested buyers and logistics providers</li>
                <li>Provides transparent pricing and payment systems</li>
                <li>Tracks food recovery metrics and environmental impact</li>
                <li>Manages logistics coordination and delivery</li>
                <li>Ensures quality control through grading systems</li>
                <li>Provides analytics for all stakeholders</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How We're Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Transparent & Fair</h3>
                <p className="text-sm text-muted-foreground">
                  All pricing, fees, and transactions are transparent and agreed upon by all parties.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Data-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time analytics help stakeholders make informed decisions.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">Impact-Focused</h3>
                <p className="text-sm text-muted-foreground">
                  Every transaction tracked includes its environmental and economic impact.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-2">User-Centric</h3>
                <p className="text-sm text-muted-foreground">
                  Designed with input from actual traders, logistics partners, and buyers.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Impact</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">1000+</div>
                <p className="text-muted-foreground">Traders Connected</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">5000 tons</div>
                <p className="text-muted-foreground">Food Recovered</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-2">₦50M</div>
                <p className="text-muted-foreground">In Transactions</p>
              </div>
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
