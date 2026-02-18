'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { apiCall } from '@/lib/api';
import { toast } from 'sonner';
import { Leaf, AlertCircle } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
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

      // Call login API - FIX: use "identifier" instead of "email"
      const response = await apiCall<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: email,  
          password 
        }),
      });

      // Store token and redirect - FIX: use accessToken and user.email
      login(response.accessToken, response.user.email);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[LOGIN] Login error:', err);
      
      const errorMessage = err?.data?.message || 
                          err?.message || 
                          'Login failed. Please check your credentials and try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 border-r border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <Leaf className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold text-foreground">Take-am</span>
        </Link>

        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Welcome Back
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access the Take-am admin dashboard to manage your food waste recovery operations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">✓</span>
              </div>
              <p className="text-muted-foreground">Real-time operational analytics</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">✓</span>
              </div>
              <p className="text-muted-foreground">Comprehensive user management</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">✓</span>
              </div>
              <p className="text-muted-foreground">Secure payment processing</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; 2024 Take-am. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
            <p className="text-muted-foreground">
              Sign in to your admin account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@takeam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-blue-600"
              size="lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Demo Credentials:</strong><br />
              Email: admin@takeam.com<br />
              Password: Demo@123456
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-accent hover:text-blue-400 transition-colors">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}