'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Leaf,
  Users,
  TrendingUp,
  Truck,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headlines = [
        "Turning Food Waste into Structured Income",
        "Building Lagos' Food Recovery Infrastructure",
        "Reducing Waste. Increasing Market Stability."
      ];

      const subtexts = [
        "Connecting traders, agents, buyers and processors in one verified ecosystem.",
        "Deploying on-ground verification with digital coordination tools.",
        "Creating structured redistribution channels for excess produce."
      ];

      const images = gsap.utils.toArray<HTMLElement>(".hero-image");
      const headline = document.querySelector(".hero-headline");
      const subtext = document.querySelector(".hero-subtext");

      let index = 0;

      gsap.set(images, { opacity: 0, scale: 1.1 });
      gsap.set(images[0], { opacity: 1, scale: 1 });

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
      });

      timeline.to({}, { duration: 4 }).add(() => {
        index = (index + 1) % images.length;

        gsap.to(images, { opacity: 0, duration: 1 });
        gsap.to(images[index], {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out"
        });

        gsap.to([headline, subtext], {
          opacity: 0,
          y: 30,
          duration: 0.6,
          onComplete: () => {
            if (headline) headline.textContent = headlines[index];
            if (subtext) subtext.textContent = subtexts[index];

            gsap.to([headline, subtext], {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            });
          }
        });
      });

      gsap.from(".hero-content", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF] text-[#0F3D2E]" ref={heroRef}>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E1D8] bg-[#F6F4EF]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-[#E67E22]" />
            <span className="text-xl font-bold tracking-tight">
              TakeAm
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-[#6B7D6E] hover:text-[#0F3D2E] transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm text-[#6B7D6E] hover:text-[#0F3D2E] transition-colors">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm text-[#6B7D6E] hover:text-[#0F3D2E] transition-colors">
              Contact
            </Link>
            <Link href="/auth/login">
              <Button
                size="sm"
                variant="outline"
                className="border-[#0F3D2E] text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-[90vh] w-full overflow-hidden">

        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854" className="hero-image absolute inset-0 w-full h-full object-cover" />
          <img src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d" className="hero-image absolute inset-0 w-full h-full object-cover" />
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399" className="hero-image absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="absolute inset-0 bg-[#0F3D2E]/50" />

        <div className="hero-content relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <div className="w-24 h-[2px] bg-[#E67E22] mb-6"></div>

          <h1 className="hero-headline text-4xl md:text-6xl font-light tracking-wide max-w-4xl leading-tight">
            Turning Food Waste into Structured Income
          </h1>

          <div className="w-24 h-[2px] bg-[#E67E22] mt-6"></div>

          <p className="hero-subtext mt-8 max-w-2xl text-lg text-white/90">
            Connecting traders, agents, buyers and processors in one verified ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
            <Link href="/auth/login">
              <Button size="lg" className="bg-[#E67E22] hover:bg-[#cf6f1f] text-white shadow-md">
                Access Admin Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0F3D2E]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="px-6 py-24 border-t border-[#E5E1D8] bg-[#F6F4EF] text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">
            A Structured Recovery System for Lagos Markets
          </h2>
          <p className="text-lg text-[#6B7D6E] leading-relaxed">
            TakeAm deploys trained agents to verify, grade, weigh, and record excess produce.
            Every batch is transparently classified and redistributed to buyers,
            feed processors, or compost partners — reducing loss and increasing income stability.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24 border-t border-[#E5E1D8] bg-[#FBF9F3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Platform Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Users className="w-6 h-6 text-[#E67E22]" />,
                title: 'Trader & Agent Management',
                desc: 'Manage market traders and recovery agents with structured verification workflows.',
              },
              {
                icon: <Truck className="w-6 h-6 text-[#E67E22]" />,
                title: 'Logistics Coordination',
                desc: 'Coordinate pickup, redistribution, and delivery across markets.',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-[#E67E22]" />,
                title: 'Recovery Analytics',
                desc: 'Track graded volumes, recovery rates, and operational efficiency.',
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-[#E67E22]" />,
                title: 'Transparent Financial Tracking',
                desc: 'Monitor trader payments and redistribution revenue clearly.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#E67E22]" />,
                title: 'Operational Accountability',
                desc: 'Every grading action and payment record is documented.',
              },
              {
                icon: <Leaf className="w-6 h-6 text-[#E67E22]" />,
                title: 'Circular Food Recovery',
                desc: 'Redirect lower-grade produce to feed and compost partners.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-xl border border-[#E5E1D8] bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-[#0F3D2E]/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#6B7D6E] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-[#E5E1D8] text-center bg-[#F6F4EF]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">
            Strengthening Market Stability Through Recovery
          </h2>
          <p className="text-lg text-[#6B7D6E]">
            Access the TakeAm dashboard to coordinate recovery operations,
            manage agents, and track real impact.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-[#E67E22] hover:bg-[#cf6f1f] text-white">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E1D8] bg-[#FBF9F3] px-6 py-12 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#6B7D6E]">
          © 2024 TakeAm. Lagos Food Recovery Infrastructure.
        </div>
      </footer>

    </div>
  );
}