'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Animate ONLY main content
      gsap.from('main', {
        opacity: 0,
        duration: 1,
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

      // Fade sections
      gsap.utils.toArray<HTMLElement>('.fade-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Magnetic button
      const button = magneticRef.current;
      if (button) {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(button, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, { x: 0, y: 0, duration: 0.4 });
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col min-h-screen bg-white text-black overflow-x-hidden"
    >

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[60]">
        <div className="progress-bar origin-left scale-x-0 h-full bg-black"></div>
      </div>

      {/* HEADER WITH BACKGROUND IMAGE - STATIC */}
      <header
        className="fixed top-0 left-0 w-full z-50 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="bg-black/60">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Take-am
            </Link>

            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 pt-32 px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-28">

          <section className="fade-section">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforming Food Waste Into Value
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              Take-am is building the infrastructure layer that connects traders,
              logistics providers, and buyers — reducing waste while creating
              sustainable economic growth.
            </p>
          </section>

          <section className="fade-section relative h-[420px] overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1506806732259-39c2d0268443"
              alt="Urban agriculture"
              className="w-full h-full object-cover"
            />
          </section>

          <section className="fade-section grid md:grid-cols-3 gap-8">
            {['Transparent', 'Data-Driven', 'Impact Focused'].map((title, i) => (
              <div
                key={i}
                className="p-8 border rounded-2xl transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="font-semibold text-lg mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We combine technology, transparency, and sustainability
                  into a seamless experience built for long-term impact.
                </p>
              </div>
            ))}
          </section>

          <section className="fade-section text-center">
            <h2 className="text-3xl font-semibold mb-8">
              Join the Movement
            </h2>
            <button
              ref={magneticRef}
              className="px-8 py-4 bg-black text-white rounded-full font-medium"
            >
              Get Started
            </button>
          </section>

        </div>
      </main>

      {/* FOOTER WITH BACKGROUND IMAGE - STATIC */}
      <footer
        className="text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-black/70 px-6 py-10 text-center text-sm">
          © 2024 Take-am. All rights reserved.
        </div>
      </footer>

    </div>
  );
}