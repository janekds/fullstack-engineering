"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Bell,
  Settings,
  LogOut,
  BrainCircuit,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  Eye,
  FileText,
  Mic,
  Sparkles,
  Trophy,
  Target,
  Calendar,
  Star,
  ArrowRight,
  Building,
  GraduationCap,
  Database,
  Stethoscope,
  Check,
  Plus,
  EllipsisVertical,
  Play,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import JobDetailsModal from "@/components/JobDetailsModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary_min: number | null;
  salary_max: number | null;
  location: string;
  remote: boolean;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience_level: "entry" | "mid" | "senior" | "executive";
  voice_interview_required: boolean;
  created_at: string;
}

// Mock data similar to Mercor's job listings
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Expert Model Trainer",
    company: "Anthropic",
    description:
      "Join our team to train and fine-tune large language models. Work on cutting-edge AI research and help shape the future of conversational AI.",
    requirements: [
      "PhD in ML/AI",
      "Experience with large-scale training",
      "Python/PyTorch expertise",
    ],
    salary_min: 120,
    salary_max: 180,
    location: "San Francisco",
    remote: true,
    type: "full-time",
    experience_level: "senior",
    voice_interview_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Legal Intelligence Analyst",
    company: "Harvey AI",
    description:
      "Analyze legal documents and case law using AI tools. Help develop intelligent legal research systems for law firms.",
    requirements: [
      "JD degree",
      "Legal research experience",
      "Data analysis skills",
    ],
    salary_min: 80,
    salary_max: 120,
    location: "New York",
    remote: true,
    type: "full-time",
    experience_level: "mid",
    voice_interview_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Medical Intelligence Analyst",
    company: "PathAI",
    description:
      "Work with pathologists to improve diagnostic accuracy using machine learning. Analyze medical imaging data and develop AI-powered diagnostic tools.",
    requirements: [
      "MD or PhD in Medical Sciences",
      "Machine learning experience",
      "Medical imaging knowledge",
    ],
    salary_min: 110,
    salary_max: 160,
    location: "Boston",
    remote: true,
    type: "full-time",
    experience_level: "senior",
    voice_interview_required: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "UX Designer",
    company: "Apple",
    description:
      "Design intuitive user interfaces for iOS and macOS applications. Conduct user research and create design prototypes.",
    requirements: [
      "Design portfolio",
      "Figma/Sketch expertise",
      "User research experience",
    ],
    salary_min: 100,
    salary_max: 140,
    location: "Cupertino",
    remote: false,
    type: "full-time",
    experience_level: "mid",
    voice_interview_required: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Product Manager",
    company: "Meta",
    description:
      "Lead product development for VR/AR experiences. Work with cross-functional teams to define product roadmaps.",
    requirements: [
      "MBA or equivalent",
      "Product management experience",
      "VR/AR knowledge",
    ],
    salary_min: 120,
    salary_max: 180,
    location: "Menlo Park",
    remote: false,
    type: "full-time",
    experience_level: "mid",
    voice_interview_required: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Amazon",
    description:
      "Build and maintain cloud infrastructure for AWS services. Automate deployment and monitoring systems.",
    requirements: [
      "AWS certifications",
      "Docker/Kubernetes",
      "Infrastructure as Code",
    ],
    salary_min: 110,
    salary_max: 150,
    location: "Seattle",
    remote: true,
    type: "full-time",
    experience_level: "mid",
    voice_interview_required: false,
    created_at: new Date().toISOString(),
  },
];

const getJobIcon = (title: string) => {
  if (
    title.toLowerCase().includes("model") ||
    title.toLowerCase().includes("ai")
  )
    return Database;
  if (title.toLowerCase().includes("legal")) return Briefcase;
  if (title.toLowerCase().includes("medical")) return Stethoscope;
  if (title.toLowerCase().includes("research")) return BrainCircuit;
  return TrendingUp;
};

const getExperienceColor = (level: string) => {
  switch (level) {
    case "entry":
      return "bg-green-100 text-green-700";
    case "mid":
      return "bg-blue-100 text-blue-700";
    case "senior":
      return "bg-purple-100 text-purple-700";
    case "executive":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getJobNumber = (uuid: string) => {
  // Create a simple hash from the UUID and convert to a readable number
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Return absolute value and limit to 4-5 digits
  return Math.abs(hash % 99999) + 1000;
};

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<Array<any>>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }

    if (user) {
      loadProfile();
      loadJobs();
      loadApplications();
      loadInterviews();
    }
  }, [user, loading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5); // Limit to 5 jobs to match homepage

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      // Fallback to first 5 mock jobs if database fails
      setJobs(mockJobs.slice(0, 5));
    }
  };

  const loadApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("job_id, mock_interview_completed")
        .eq("user_id", user.id);

      if (error) throw error;

      const appliedJobs =
        data?.map((app: any) => ({
          job_id: app.job_id,
          mock_interview_completed: app.mock_interview_completed,
        })) || [];

      setAppliedJobs(appliedJobs);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadInterviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error('Error loading interviews:', error);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user) return;

    console.log("Applying to job with ID:", jobId);
    console.log("Current appliedJobs state:", appliedJobs);

    // Find the job to check if voice interview is required
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      console.error("Job not found with ID:", jobId);
      return;
    }

    // Check if user has completed interview for jobs that require it
    if (job.voice_interview_required && !profile?.interview_completed) {
      // Store the job they want to apply to in localStorage for after interview
      localStorage.setItem("pendingJobApplication", jobId);
      toast.info("Complete your AI interview first to apply to jobs!");
      router.push("/dashboard/interview");
      return;
    }

    try {
      // Check if already applied to prevent duplicates
      const { data: existingApplication, error: checkError } = await supabase
        .from("job_applications")
        .select("id, job_id")
        .eq("user_id", user.id)
        .eq("job_id", jobId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing application:", checkError);
        throw checkError;
      }

      if (existingApplication) {
        console.log("Already applied to job:", existingApplication);
        toast.info("You have already applied to this job!");
        return;
      }

      console.log("Inserting job application:", {
        user_id: user.id,
        job_id: jobId,
        status: "applied"
      });

      const { data: insertResult, error } = await supabase
        .from("job_applications")
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: "applied",
        })
        .select("id, job_id");

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      console.log("Successfully inserted application:", insertResult);

      // Reload applications from database to ensure consistency
      await loadApplications();

      // Send confirmation email
      if (user?.email) {
        try {
          await fetch("/api/send-job-application-confirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: profile?.first_name || "there",
              jobTitle: job?.title || "your application",
              company: job?.company || "the employer",
            }),
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the application if email fails
        }
      }

      toast.success("Successfully applied to job! Check your email for confirmation.");
    } catch (error: any) {
      console.error("Error applying to job:", error);
      toast.error(error.message || "Failed to apply to job");
    }
  };


  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApplyFromModal = (jobId: string) => {
    handleApplyToJob(jobId);
    handleCloseModal();
  };

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader activeTab="dashboard" />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.first_name || "User"}!</h1>
          <p className="text-gray-500 mt-1">Here's your dashboard overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#8FFF0020' }}>
                    <Briefcase className="h-6 w-6" style={{ color: '#8FFF00' }} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{jobs.length}</h3>
                <p className="text-sm text-gray-500 mt-1">Available Jobs</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{appliedJobs.length}</h3>
                <p className="text-sm text-gray-500 mt-1">Applications Sent</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{interviews.length}</h3>
                <p className="text-sm text-gray-500 mt-1">Interviews Scheduled</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="rounded-3xl border border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {profile?.interview_completed ? "Complete" : "Pending"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Profile Status</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Job Listings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Open Roles</h2>
            <span className="text-sm text-gray-500">{jobs.length} jobs found</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {currentJobs.map((job, index) => {
              const isApplied = appliedJobs.some((app) => app.job_id === job.id);
              console.log(`Job ${job.id} (${job.title}): isApplied = ${isApplied}`);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="bg-white border-0 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleJobClick(job)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-black">{job.title}</h3>
                          <span className="text-xs text-gray-400 font-mono">#{getJobNumber(job.id)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">{job.description}</p>

                      <div className="flex items-center gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" style={{ color: '#74ce00' }} />
                          <span className="text-gray-700">{job.remote ? "Remote" : job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: '#74ce00' }} />
                          <span className="text-gray-700">{job.type}</span>
                        </div>
                        {job.salary_min && job.salary_max && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" style={{ color: '#74ce00' }} />
                            <span className="text-gray-700">${job.salary_min}-${job.salary_max}/hr</span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700 px-4 py-2 h-auto font-medium text-sm rounded-[25px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyToJob(job.id);
                        }}
                        disabled={isApplied}
                      >
                        {isApplied ? "Applied" : "Apply Now"}
                        {!isApplied && <ArrowRight className="ml-1 w-4 h-4" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={goToPrevPage}
                      className={`
                        rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer
                        ${currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                      `}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => goToPage(page)}
                            isActive={currentPage === page}
                            className={`
                              rounded-full border transition-colors cursor-pointer min-w-[40px] h-10
                              ${currentPage === page
                                ? 'bg-purple-100 border-purple-200 text-purple-700'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                              }
                            `}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis className="text-gray-400" />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={goToNextPage}
                      className={`
                        rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer
                        ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                      `}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyFromModal}
        isApplied={selectedJob ? appliedJobs.some((app) => app.job_id === selectedJob.id) : false}
      />
    </div>
  );
}
