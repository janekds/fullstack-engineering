"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Upload,
  Download,
  Settings,
  Bell,
  Lock,
  Globe,
  Trash2,
  Save,
  Edit3,
  Eye,
  EyeOff,
  Calendar,
  Award,
  BookOpen,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    job_title: "",
    company: "",
    experience_years: "",
    linkedin_url: "",
    github_url: "",
    website_url: "",
    cv_url: "",
    skills: [] as string[],
    avatar_url: ""
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    job_alerts: true,
    interview_reminders: true,
    marketing_emails: false,
    profile_visibility: "public"
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
      return;
    }

    if (user) {
      loadProfile();
      loadInterviews();
      loadApplications();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: user.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          job_title: data.job_title || "",
          company: data.company || "",
          experience_years: data.experience_years?.toString() || "",
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          website_url: data.portfolio_url || "",
          cv_url: data.cv_url || "",
          skills: data.skills || [],
          avatar_url: data.avatar_url || ""
        });

        setPreferences({
          email_notifications: data.email_notifications ?? true,
          job_alerts: data.job_alerts ?? true,
          interview_reminders: data.interview_reminders ?? true,
          marketing_emails: data.marketing_emails ?? false,
          profile_visibility: data.profile_visibility || "public"
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadInterviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        // Silently handle common expected errors
        setInterviews([]);
        return;
      }

      setInterviews(data || []);
    } catch (error: any) {
      // Silently handle all errors for interviews table
      setInterviews([]);
    }
  };

  const loadApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Silently handle common expected errors
        setApplications([]);
        return;
      }

      setApplications(data || []);
    } catch (error: any) {
      // Silently handle all errors for applications table
      setApplications([]);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const profileUpdate = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        job_title: formData.job_title,
        company: formData.company,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.website_url,
        cv_url: formData.cv_url,
        skills: formData.skills,
        avatar_url: formData.avatar_url,
        ...preferences
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profileUpdate });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // Note: This would typically require backend implementation
      toast.error('Account deletion requires contacting support');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "activity", label: "Activity", icon: Award },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader activeTab="profile" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "green"}
              className="rounded-full"
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View Mode
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                          activeTab === tab.id
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* Profile Overview */}
                <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and professional details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.avatar_url || user?.user_metadata?.avatar_url} />
                        <AvatarFallback
                          style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }}
                          className="text-black font-semibold text-lg"
                        >
                          {formData.first_name?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div>
                          <Button variant="outline" className="mb-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                          <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          disabled={true}
                          className="rounded-xl bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                          rows={3}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="job_title">Job Title</Label>
                          <Input
                            id="job_title"
                            value={formData.job_title}
                            onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience_years">Years of Experience</Label>
                          <Input
                            id="experience_years"
                            type="number"
                            value={formData.experience_years}
                            onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                          <Input
                            id="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github_url">GitHub URL</Label>
                          <Input
                            id="github_url"
                            value={formData.github_url}
                            onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website_url">Portfolio URL</Label>
                          <Input
                            id="website_url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                            disabled={!isEditing}
                            className="rounded-xl"
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CV Section */}
                    {formData.cv_url && (
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4">Documents</h3>
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                              <Download className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">CV/Resume</p>
                              <p className="text-sm text-gray-500">Uploaded document</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(formData.cv_url, '_blank')}
                            className="rounded-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            loadProfile(); // Reset form data
                          }}
                          className="rounded-full"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          variant="green"
                          className="rounded-full"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                {/* Interview History */}
                <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Interview History
                    </CardTitle>
                    <CardDescription>
                      Your completed interviews and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {interviews.length > 0 ? (
                      <div className="space-y-4">
                        {interviews.map((interview) => (
                          <div key={interview.id} className="p-4 border border-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {interview.type === 'job-specific-mock' ? 'Job Interview' : 'Practice Interview'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Completed on {new Date(interview.completed_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="mb-1">
                                  Score: {interview.score || 'N/A'}
                                </Badge>
                                <p className="text-xs text-gray-500">
                                  Duration: {Math.round((interview.duration || 0) / 60)}m
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No interviews completed yet</p>
                        <Link href="/dashboard/interview">
                          <Button variant="green" className="mt-4 rounded-full">
                            Start Your First Interview
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Application History */}
                <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Job Applications
                    </CardTitle>
                    <CardDescription>
                      Track your job application status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div key={application.id} className="p-4 border border-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Job Application #{application.id}</h4>
                                <p className="text-sm text-gray-600">
                                  Applied on {new Date(application.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                variant={application.status === 'applied' ? 'default' : 'outline'}
                                className="capitalize"
                              >
                                {application.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No job applications yet</p>
                        <Link href="/dashboard">
                          <Button variant="green" className="mt-4 rounded-full">
                            Browse Jobs
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Password Change */}
                <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                    <Button
                      onClick={handlePasswordChange}
                      variant="green"
                      className="rounded-full"
                    >
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="rounded-3xl border border-red-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Trash2 className="h-5 w-5 mr-2" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                      <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-600 mb-4">
                        Once you delete your account, there is no going back. This will permanently delete your profile, interviews, and applications.
                      </p>
                      <Button
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        className="rounded-full"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "preferences" && (
              <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your notification preferences and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email_notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive email updates about your account</p>
                        </div>
                        <Switch
                          id="email_notifications"
                          checked={preferences.email_notifications}
                          onCheckedChange={(checked) =>
                            setPreferences({...preferences, email_notifications: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="job_alerts">Job Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about new job opportunities</p>
                        </div>
                        <Switch
                          id="job_alerts"
                          checked={preferences.job_alerts}
                          onCheckedChange={(checked) =>
                            setPreferences({...preferences, job_alerts: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="interview_reminders">Interview Reminders</Label>
                          <p className="text-sm text-gray-500">Reminders about upcoming interviews</p>
                        </div>
                        <Switch
                          id="interview_reminders"
                          checked={preferences.interview_reminders}
                          onCheckedChange={(checked) =>
                            setPreferences({...preferences, interview_reminders: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing_emails">Marketing Emails</Label>
                          <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                        </div>
                        <Switch
                          id="marketing_emails"
                          checked={preferences.marketing_emails}
                          onCheckedChange={(checked) =>
                            setPreferences({...preferences, marketing_emails: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Privacy</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile_visibility">Profile Visibility</Label>
                        <p className="text-sm text-gray-500 mb-2">Control who can see your profile</p>
                        <select
                          id="profile_visibility"
                          value={preferences.profile_visibility}
                          onChange={(e) =>
                            setPreferences({...preferences, profile_visibility: e.target.value})
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="companies">Companies Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      variant="green"
                      className="rounded-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}