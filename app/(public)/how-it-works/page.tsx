'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Page fade in
      gsap.from('.page', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Scroll progress bar
      gsap.to('.progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // Section animation
      gsap.utils.toArray<HTMLElement>('.fade-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.animate-item'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const StepCard = ({ step, title, description, color }: any) => (
    <div className="animate-item group relative pl-12">
      <div className={`absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full ${color} text-white text-sm font-semibold`}>
        {step}
      </div>
      <div className="p-6 border rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="page relative flex flex-col min-h-screen bg-white text-black">

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div className="progress-bar origin-left scale-x-0 h-full bg-black"></div>
      </div>

      {/* HEADER with Background Image */}
      <div
        className="relative px-6 py-6 border-b bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2070&q=80')"
        }}
      >
        {/* Light overlay so text stays visible */}
        <div className="absolute inset-0 bg-white/85"></div>

        <div className="relative max-w-6xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-black">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <main className="flex-1 px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-28">

          {/* HERO TEXT (Just text now, no hero section) */}
          <section className="fade-section space-y-6">
            <h1 className="animate-item text-5xl font-bold">
              How Take-am Works
            </h1>
            <p className="animate-item text-xl text-gray-600 max-w-3xl">
              A structured ecosystem connecting traders, logistics agents,
              and buyers — powered by transparency and technology.
            </p>
          </section>

          {/* Traders */}
          <section className="fade-section space-y-10">
            <h2 className="animate-item text-3xl font-semibold">For Traders</h2>
            <div className="space-y-8">
              <StepCard step={1} title="Register Your Business" description="Create and verify your trading business account securely." color="bg-black" />
              <StepCard step={2} title="Post Inventory" description="Upload available stock with grading and pricing." color="bg-black" />
              <StepCard step={3} title="Receive Requests" description="Buyers and agents connect with you instantly." color="bg-black" />
              <StepCard step={4} title="Arrange Pickup" description="Coordinate convenient pickup times." color="bg-black" />
              <StepCard step={5} title="Get Paid" description="Secure payments processed after grading." color="bg-black" />
            </div>
          </section>

          {/* Logistics */}
          <section className="fade-section space-y-10">
            <h2 className="animate-item text-3xl font-semibold">For Logistics Agents</h2>
            <div className="space-y-8">
              <StepCard step={1} title="Get Certified" description="Complete identity and compliance verification." color="bg-blue-600" />
              <StepCard step={2} title="Manage Territory" description="Oversee your assigned market zone." color="bg-blue-600" />
              <StepCard step={3} title="Process Requests" description="Handle pickups and deliveries efficiently." color="bg-blue-600" />
              <StepCard step={4} title="Grade & Report" description="Inspect and submit grading reports digitally." color="bg-blue-600" />
              <StepCard step={5} title="Earn Commissions" description="Receive commissions for completed transactions." color="bg-blue-600" />
            </div>
          </section>

          {/* Buyers */}
          <section className="fade-section space-y-10">
            <h2 className="animate-item text-3xl font-semibold">For Buyers</h2>
            <div className="space-y-8">
              <StepCard step={1} title="Browse Inventory" description="Discover affordable stock in real time." color="bg-emerald-600" />
              <StepCard step={2} title="Check Quality & Price" description="Review grading, pricing, and availability." color="bg-emerald-600" />
              <StepCard step={3} title="Place Order" description="Select quantities and confirm purchase." color="bg-emerald-600" />
              <StepCard step={4} title="Arrange Delivery" description="Choose pickup or delivery options." color="bg-emerald-600" />
              <StepCard step={5} title="Receive & Pay" description="Secure digital payments with invoices." color="bg-emerald-600" />
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER with Background Image */}
      <footer
        className="relative border-t px-6 py-8 text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2070&q=80')"
        }}
      >
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-white/90"></div>

        <div className="relative text-sm text-gray-700">
          © 2024 Take-am. All rights reserved.
        </div>
      </footer>

    </div>
  );
}