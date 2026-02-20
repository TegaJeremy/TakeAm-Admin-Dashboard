'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { apiCall } from '@/lib/api';
import { toast } from 'sonner';
import { Leaf, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    phoneNumber: string | null;
    fullName: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
  // Simple clean fade only (no movement)
  gsap.from('.branding-panel', {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.from('.login-panel', {
    opacity: 0,
    duration: 0.8,
    delay: 0.1,
    ease: 'power2.out'
  });

  gsap.from('.form-item', {
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    delay: 0.2,
    ease: 'power2.out'
  });

}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const response = await apiCall<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password
        }),
      });

      login(response.accessToken, response.user.email, response.user);
      toast.success('Login successful!');
      router.push('/dashboard');

    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials and try again.';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="relative flex min-h-screen bg-[#F6F4EF]">

    {/* ================= LEFT PANEL ================= */}
    <div className="branding-panel relative hidden lg:flex lg:w-1/2 overflow-hidden">

      {/* Static Market Image */}
      <img
         src="https://www.shutterstock.com/shutterstock/photos/2631288983/display_1500/stock-photo-close-up-local-african-open-space-market-with-stalls-of-food-items-for-sales-2631288983.jpg"
        alt="African food market"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Solid Overlay (NOT gradient) */}
      <div className="absolute inset-0 bg-[#0F3D2E]/80"></div>

      <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white">

        <Link href="/" className="flex items-center gap-3">
          <Leaf className="w-9 h-9 text-[#E67E22]" />
          <span className="text-2xl font-semibold tracking-wide">
            Take-am
          </span>
        </Link>

        <div className="space-y-10 max-w-md">

          <div>
            <h2 className="text-4xl font-light mb-6 tracking-wide">
              Welcome Back
            </h2>

            <p className="text-lg text-white/90 leading-relaxed">
              Access the Take-am admin dashboard to manage your food waste recovery operations.
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Real-time operational analytics",
              "Comprehensive user management",
              "Secure payment processing"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-[#E67E22]/20 flex items-center justify-center">
                  <span className="text-[#E67E22] text-sm font-bold">✓</span>
                </div>
                <p className="text-white/95 text-base">{text}</p>
              </div>
            ))}
          </div>

        </div>

        <p className="text-xs text-white/60">
          &copy; 2024 Take-am. All rights reserved.
        </p>

      </div>
    </div>

    {/* ================= RIGHT PANEL ================= */}
    <div className="login-panel flex w-full lg:w-1/2 flex-col justify-center p-10 sm:p-16 bg-[#F6F4EF]">

      <div className="w-full max-w-md mx-auto">

        <div className="mb-10 form-item text-center">
          <h1 className="text-3xl font-semibold text-[#0F3D2E] mb-3">
            Admin Login
          </h1>
          <p className="text-[#6B7D6E]">
            Sign in to your admin account to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 form-item">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">

          <div className="form-item">
            <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="admin@takeam.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-white border-[#E5E1D8] text-[#0F3D2E] placeholder:text-gray-400 focus:border-[#0F3D2E] focus:ring-[#0F3D2E]"
            />
          </div>

          <div className="form-item">
            <label className="block text-sm font-medium text-[#0F3D2E] mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-white border-[#E5E1D8] text-[#0F3D2E] placeholder:text-gray-400 focus:border-[#0F3D2E] focus:ring-[#0F3D2E]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-[#0F3D2E] hover:bg-[#0c3024] text-white flex items-center justify-center"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

        </form>

        <div className="mt-8 text-center form-item">
          <p className="text-sm text-[#6B7D6E]">
            Need help?{' '}
            <Link href="/contact" className="text-[#0F3D2E] hover:underline font-medium">
              Contact support
            </Link>
          </p>
        </div>

      </div>
    </div>

  </div>
);


}