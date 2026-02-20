'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF]">

      {/* ================= NAV WITH IMAGE ================= */}
      <div className="relative border-b border-[#E5E1D8] overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2070&auto=format&fit=crop"
          alt="African farm landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay (solid, not gradient) */}
        <div className="absolute inset-0 bg-[#0F3D2E]/85"></div>

        <div className="relative z-10 px-6 py-6 max-w-5xl mx-auto">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-16">

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#0F3D2E] mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-[#6B7D6E] leading-relaxed">
              Have questions about Take-am? We'd love to hear from you.
              Reach out to us using any of the methods below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">

            {/* FORM */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-[#0F3D2E]">
                Send us a Message
              </h2>

              <form className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    className="bg-white border-[#E5E1D8] text-[#0F3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white border-[#E5E1D8] text-[#0F3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="What is this about?"
                    className="bg-white border-[#E5E1D8] text-[#0F3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    className="w-full px-3 py-2 bg-white border border-[#E5E1D8] rounded-md text-[#0F3D2E] focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                  />
                </div>

                <Button className="w-full bg-[#0F3D2E] hover:bg-[#0c3024] text-white">
                  Send Message
                </Button>

              </form>
            </div>

            {/* INFO */}
            <div className="space-y-10">
              <h2 className="text-2xl font-semibold text-[#0F3D2E]">
                Contact Information
              </h2>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-[#E67E22] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0F3D2E] mb-1">Email</h3>
                  <p className="text-[#6B7D6E]">info@takeam.com</p>
                  <p className="text-[#6B7D6E]">support@takeam.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-[#E67E22] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0F3D2E] mb-1">Phone</h3>
                  <p className="text-[#6B7D6E]">+234 (0) 123 4567 890</p>
                  <p className="text-[#6B7D6E]">Monday - Friday, 9 AM - 6 PM WAT</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#E67E22] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0F3D2E] mb-1">Address</h3>
                  <p className="text-[#6B7D6E]">
                    Take-am Headquarters<br />
                    Victoria Island, Lagos<br />
                    Nigeria
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ================= FOOTER WITH IMAGE ================= */}
      <footer className="relative overflow-hidden mt-auto">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=2070&auto=format&fit=crop"
          alt="Fresh produce market"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0F3D2E]/90"></div>

        <div className="relative z-10 py-10 text-center text-white">
          <p className="text-sm">
            &copy; 2024 Take-am. All rights reserved.
          </p>
        </div>

      </footer>

    </div>
  );
}
