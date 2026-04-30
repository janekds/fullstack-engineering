"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, Sparkles, Trophy } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";

export default function SignupPage() {
  const { signUp, signInWithGoogle, signInWithLinkedIn, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Redirect is handled by OAuth flow
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignup = async () => {
    try {
      setLoading(true);
      await signInWithLinkedIn();
      // Redirect is handled by OAuth flow
    } catch (error: any) {
      console.error("LinkedIn signup error:", error);
      toast.error(error.message || "Failed to sign up with LinkedIn");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      
      // Send welcome email
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            name: formData.firstName 
          }),
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the signup if email fails
      }
      
      toast.success("🎉 Welcome to Durdle! Check your email for a beautiful confirmation message.");
      router.push("/dashboard/onboarding");
    } catch (error: any) {
      console.error("Email signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });

    // Show/hide full form based on first name field
    if (id === "firstName") {
      if (value.length > 0 && !showFullForm) {
        setShowFullForm(true);
      } else if (value.length === 0 && showFullForm) {
        setShowFullForm(false);
      }
    }
  };

  // Show loading state while checking auth or redirecting
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {user ? "Redirecting to dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(circle at 20% 80%, #8FFF00 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #8FFF00 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, #8FFF00 0%, transparent 50%)`,
              filter: 'blur(120px)'
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <Link href="/">
              <img src="/logo.png" alt="Durdle Logo" className="h-12 w-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              Join research projects with leading AI labs.
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Durdle connects PhD students to remote research roles at top AI labs, paying an average of $80/hour.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5" style={{ color: '#8FFF00' }} />
              <span className="text-gray-300">Do exciting work</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5" style={{ color: '#8FFF00' }} />
              <span className="text-gray-300">Get paid to share your expertise</span>
            </div>
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5" style={{ color: '#8FFF00' }} />
              <span className="text-gray-300">Build skills for the future</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#8FFF00' }}>
                Sign in
              </Link>
            </div>

            <div>
              <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img src="/logo.png" alt="Durdle Logo" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2"> </p>
          </div>

          {/* Social Signup Buttons - Hide when form is being filled */}
          <AnimatePresence>
            {!showFullForm && (
              <motion.div
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="white-3d"
                    className="flex-1 py-3 h-auto text-sm"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>

                  <Button
                    variant="white-3d"
                    className="flex-1 py-3 h-auto text-sm"
                    onClick={handleLinkedInSignup}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="#0077B5" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-3 text-gray-500 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {showFullForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                      required={showFullForm}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                      required={showFullForm}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                      required={showFullForm}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <Label htmlFor="termsAccepted" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Button variant="link" className="px-0 text-sm text-gray-600 hover:text-gray-900">
                        Terms of Service
                      </Button>
                      {" "}and{" "}
                      <Button variant="link" className="px-0 text-sm text-gray-600 hover:text-gray-900">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    variant="green"
                    className="w-full py-3 h-auto text-base font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

        </div>
      </div>
    </div>
  );
} 
