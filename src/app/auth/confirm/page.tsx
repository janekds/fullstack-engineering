"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get search params client-side only
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email and try again.');
        return;
      }

      try {
        // Verify the token with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
          email: decodeURIComponent(email),
        });

        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage('Your email has been confirmed successfully!');
        
        // Redirect to onboarding after a short delay
        setTimeout(() => {
          router.push('/dashboard/onboarding');
        }, 2000);

      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to confirm email. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  const getIcon = () => {
    switch (status) {
      case 'loading': return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
      case 'success': return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error': return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading': return 'Confirming your email...';
      case 'success': return 'Email confirmed!';
      case 'error': return 'Confirmation failed';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Durdle</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              {getIcon()}
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{getTitle()}</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>

              {status === 'success' && (
                <div className="text-sm text-muted-foreground">
                  Redirecting to onboarding in 2 seconds...
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-3 mt-6">
                  <Button asChild className="w-full">
                    <Link href="/sign-up">Try Again</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in">Go to Login</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
