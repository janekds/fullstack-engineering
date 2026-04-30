"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, ArrowRight, Briefcase, Loader2, Globe, Mic, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    linkedinUrl: "",
    portfolioUrl: "",
    cv: null as File | null,
    cvUrl: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      // Pre-fill form with existing data
      setFormData(prev => ({
        ...prev,
        linkedinUrl: data.linkedin_url || "",
        portfolioUrl: data.portfolio_url || "",
        cvUrl: data.cv_url || "",
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!(file.type === "application/pdf" || file.type.includes("document"))) {
      toast.error("Please upload a PDF or DOC file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cv.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      setFormData({ ...formData, cv: file, cvUrl: urlData.publicUrl });
      toast.success("CV uploaded successfully!");
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          linkedin_url: formData.linkedinUrl || null,
          portfolio_url: formData.portfolioUrl || null,
          cv_url: formData.cvUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || "Failed to save profile");
      return false;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const success = await saveProfile();
      if (success) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  // Calculate dynamic progress
  const calculateProgress = () => {
    let completedSteps = 0;
    let totalSteps = 3;

    // Basic Information (always completed if user exists)
    completedSteps += 1;

    // Profile Details (check if any profile info is filled)
    if (formData.linkedinUrl || formData.portfolioUrl || formData.cvUrl) {
      completedSteps += 1;
    }

    // AI Assessment
    if (profile?.interview_completed) {
      completedSteps += 1;
    }

    return Math.round((completedSteps / totalSteps) * 100);
  };

  const progressPercentage = calculateProgress();


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header with Logo and Welcome */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Durdle Logo" className="h-8 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {profile?.first_name || user?.user_metadata?.first_name || 'there'}!
                </h1>
                <p className="text-gray-600 text-sm">Complete your profile to get started</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-500 mt-1">Add your professional links and CV to get better job matches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Professional Information</CardTitle>
                <CardDescription>
                  All fields are optional, but completing them helps us match you with better opportunities
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Professional Links Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                    />
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="portfolio" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Portfolio Website
                    </Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="rounded-xl border-gray-200 h-12 px-4 focus:border-gray-400 focus:ring-0"
                    />
                  </div>
                </div>

                {/* CV Upload Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    CV/Resume
                  </Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Uploading...
                      </div>
                    ) : formData.cvUrl ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        CV uploaded successfully
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload your CV/Resume
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleComplete}
                    disabled={loading}
                    variant="green"
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="white-3d"
                  >
                    Skip for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Profile Progress */}
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: '#8FFF00'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Basic Information</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile Details</span>
                      {(formData.linkedinUrl || formData.portfolioUrl || formData.cvUrl) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Assessment</span>
                      {profile?.interview_completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Link href="/dashboard/interview">
                          <Button size="sm" variant="green" className="h-6 text-xs px-2">
                            Start
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Only show if there are actions available */}
            {!profile?.interview_completed && (
              <Card className="rounded-3xl border border-gray-100 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/interview" className="block">
                    <Button variant="green" className="w-full justify-start">
                      <Mic className="h-4 w-4 mr-2" />
                      Take AI Interview
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}