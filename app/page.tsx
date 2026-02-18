'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, TrendingUp, Truck, ShieldCheck, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-foreground">Take-am</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/auth/login">
              <Button size="sm" variant="outline">
                Admin Login
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/auth/login">
              <Button size="sm" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Turning Food Waste into <span className="text-accent">Opportunity</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take-am connects food traders with logistics partners and buyers, recovering valuable food waste across Lagos while creating economic opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/login">
              <Button size="lg" className="bg-primary hover:bg-blue-600">
                Access Admin Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Network Management</h3>
              <p className="text-muted-foreground">
                Manage traders, agents, and buyers all in one platform with real-time status tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Track recovery metrics, payment flows, and operational efficiency with detailed dashboards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with audit logs and role-based access control for all operations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Logistics Coordination</h3>
              <p className="text-muted-foreground">
                Manage pickup requests, delivery tracking, and agent assignments with ease.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Financial Management</h3>
              <p className="text-muted-foreground">
                Track payments, manage grading systems, and monitor financial flows transparently.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground">
                Track food recovery metrics and measure your positive environmental impact daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to optimize your operations?
          </h2>
          <p className="text-lg text-muted-foreground">
            Access the Take-am admin dashboard to manage all aspects of your food waste recovery network.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-primary hover:bg-blue-600">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-4 sm:px-6 lg:px-8 py-12 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-accent" />
              <span className="font-bold text-foreground">Take-am</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforming food waste recovery for Lagos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: info@takeam.com<br />
              Lagos, Nigeria
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Take-am. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
