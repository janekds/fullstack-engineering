"use client";

import { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  PhoneOff,
  CheckCircle,
  Volume2,
  VolumeX,
  AlertCircle,
  Loader2,
  Info,
  Clock,
  MessageSquare,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";
import Vapi from "@vapi-ai/web";
import CallDetailsModal from "@/components/CallDetailsModal";
import DashboardHeader from "@/components/DashboardHeader";

function InterviewPageContent() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();
  const [interviewStatus, setInterviewStatus] = useState<
    "waiting" | "connecting" | "active" | "completed" | "error"
  >("waiting");
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vapiClient, setVapiClient] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<any>(null); // Store the active call object
  const [transcript, setTranscript] = useState<
    { role: string; content: string; timestamp?: string }[]
  >([]);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<"good" | "poor" | "disconnected">("good");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [vapiCallData, setVapiCallData] = useState<any>(null);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const callRecordRef = useRef<any>(null);
  const [callDetailsOpen, setCallDetailsOpen] = useState(false);
  const [callDetailsLoading, setCallDetailsLoading] = useState(false);
  const [callDetails, setCallDetails] = useState<object | null>(null);
  const [callDetailsError, setCallDetailsError] = useState<string>("");
  const [jobDetails, setJobDetails] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id") || null;
  const mockInterviewCompleted =
    searchParams.get("mock_interview_completed") || "false";

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  useLayoutEffect(() => {
    if (!user) return;
    const fetchJob = async () => {
      if (!jobId) return;
      // fetch job from jobs table in supabase
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) {
        throw new Error(jobError.message || "Failed to fetch job");
      }
      return jobData;
    };
    // fetch interview from interviews table in supabase
    const fetchInterview = async ({
      jobId,
      userId,
    }: {
      jobId: string;
      userId: string | undefined;
    }) => {
      if (!jobId && userId === undefined) return;
      console.log({ jobId, userId });
      const { data: interviewData, error: interviewError } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", userId)
        .eq("job_id", jobId)
        .eq("type", "job-specific-mock")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (interviewError) {
        throw new Error(interviewError.message || "Failed to fetch interview");
      }
      console.log("interviewData fetchInterview()", interviewData);
      return interviewData;
    };

    if (jobId && mockInterviewCompleted === "false") {
      fetchInterview({ jobId, userId: user?.id }).then((interviewData) => {
        if (interviewData) {
          setInterviewCompleted(true);
          setInterviewStatus("completed");
        } else {
          fetchJob().then((jobData) => {
            setInterviewCompleted(false);
            setInterviewStatus("waiting");
            setJobDetails(jobData);
          });
        }
      });
    } else if (profile?.interview_completed && !jobId) {
      setInterviewCompleted(true);
      setInterviewStatus("completed");
    } else if (jobId && mockInterviewCompleted === "true") {
      fetchJob().then((jobData) => {
        setJobDetails(jobData);
        setInterviewCompleted(true);
        setInterviewStatus("completed");
      });
    }
  }, [profile?.interview_completed, jobId, mockInterviewCompleted, user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
      return;
    }

    // Initialize VAPI client
    if (typeof window !== "undefined") {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

      if (publicKey) {
        const client = new Vapi(publicKey);
        setVapiClient(client);

        // Set up comprehensive event listeners
        client.on("call-start", () => {
          console.log("Call started");
          setInterviewStatus("active");
          setConnectionQuality("good");
          setErrorMessage("");
          setIsMuted(false); // Reset mute state when call starts
          startTimer();
          toast.success("Interview started successfully!");
        });

        client.on("call-end", () => {
          console.log("Call ended");
          setInterviewStatus("completed");
          setIsAssistantSpeaking(false);
          setActiveCall(null); // Clear the active call
          setIsMuted(false); // Reset mute state
          stopTimer();
          handleInterviewComplete("completed");
        });

        client.on("speech-start", () => {
          console.log("Assistant started speaking");
          setIsAssistantSpeaking(true);
        });

        client.on("speech-end", () => {
          console.log("Assistant stopped speaking");
          setIsAssistantSpeaking(false);
        });

        client.on("volume-level", (level: number) => {
          setVolumeLevel(Math.min(100, Math.max(0, level * 100)));
        });

        client.on("message", (message: any) => {
          console.log("Message:", message);

          if (message.type === "conversation-update") {
            const conversation = message?.conversation || [];
            // Add timestamps to messages
            const conversationWithTimestamps = conversation.map((msg: any) => ({
              ...msg,
              timestamp: new Date().toLocaleTimeString()
            }));
            setTranscript(conversationWithTimestamps);
          } else if (message.type === "function-call") {
            console.log("Function called:", message.functionCall.name);
          } else if (message.type === "transcript") {
            // Handle real-time transcripts
            const newMessage = {
              role: message.transcript.role,
              content: message.transcript.text,
              timestamp: new Date().toLocaleTimeString()
            };
            setTranscript(prev => [...prev, newMessage]);
          }
        });

        client.on("error", (error: any) => {
          console.error("VAPI Error:", error);
          setInterviewStatus("error");
          setConnectionQuality("disconnected");

          const errorMsg = error?.message || "Interview connection failed";
          setErrorMessage(errorMsg);

          if (error?.code === "NETWORK_ERROR") {
            setConnectionQuality("poor");
            toast.error("Network connection issue. Please check your internet.");
          } else if (error?.code === "PERMISSION_DENIED") {
            toast.error("Microphone permission denied. Please allow microphone access.");
          } else {
            toast.error(`${errorMsg}. Please try again.`);
          }
        });
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, loading, router]);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const createOrGetInterviewAssistant = async () => {
    if (jobId) {
      console.log("jobId:", jobId);
      console.log("jobDetails:", jobDetails);

      // Check if jobDetails exists and has the data we need
      if (!jobDetails) {
        console.error("No jobDetails found for jobId:", jobId);
        toast.error("Job details not found. Please try refreshing the page.");
        throw new Error("Job details not found");
      }

      if (jobDetails?.assistant_id) {
        return jobDetails.assistant_id;
      }

      const response = await fetch("/api/vapi/create-assistant", {
        method: "POST",
        body: JSON.stringify({ jobDetails }),
      });
      const data = await response.json();
      console.log("data from create-assistant", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error);
      }

      if (data?.assistant_id) {
        // First, verify the job exists before updating
        const { data: existingJob, error: checkError } = await supabase
          .from("jobs")
          .select("id")
          .eq("id", jobId)
          .single();

        if (checkError || !existingJob) {
          console.error("Job not found when trying to update assistant_id:", {
            jobId,
            checkError,
            existingJob,
          });
          toast.error("Job not found in database. Please contact support.");
          // Still return the assistant_id even if we can't update the job
          return data.assistant_id;
        }

        // Now try to update since we confirmed the job exists
        const {
          data: updatedJob,
          error: updateError,
          status,
        } = await supabase
          .from("jobs")
          .update({ assistant_id: data?.assistant_id })
          .eq("id", jobId)
          .select()
          .single();

        if (updateError || !updatedJob) {
          console.error(
            "Failed to update assistant_id in jobs table:",
            updateError,
            "Status:",
            status,
            "Updated job:",
            updatedJob
          );
          toast.error("Failed to update job with assistant info.");
        } else {
          console.log(
            "assistant_id updated in jobs table",
            updatedJob.assistant_id,
            "Full row:",
            updatedJob
          );
        }
      }
      return data.assistant_id;
    }
    // this id refers to a Test Assistant for completing profile mock interviews
    const mockInterviewAssistantId = "772a5bce-28a8-41cd-b61f-fa3a50d0cf7f";
    return mockInterviewAssistantId;
  };

  const startInterview = async () => {
    if (!vapiClient) {
      toast.error("Interview system not ready. Please refresh the page.");
      return;
    }

    // Check for microphone permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
    } catch (permissionError) {
      console.error("Microphone permission error:", permissionError);
      toast.error("Please allow microphone access to start the interview.");
      setInterviewStatus("error");
      setErrorMessage("Microphone permission denied");
      return;
    }

    try {
      setInterviewStatus("connecting");
      setErrorMessage("");
      setRetryCount(0);

      const assistantId = await createOrGetInterviewAssistant();
      console.log("Starting interview with assistant:", assistantId);

      // Add timeout for connection
      const startCallWithTimeout = async () => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 30000)
        );

        const callPromise = vapiClient.start(assistantId);

        return Promise.race([callPromise, timeoutPromise]);
      };

      const call = await startCallWithTimeout();
      callRecordRef.current = call;
      setActiveCall(call); // Store the call object for mute/unmute and stop
      console.log("Call started successfully:", call);

    } catch (error: any) {
      console.error("Failed to start interview:", error);
      setInterviewStatus("error");

      // Handle specific error types
      if (error.message === "Connection timeout") {
        setErrorMessage("Connection timeout. Please check your internet and try again.");
        toast.error("Connection timeout. Please try again.");
      } else if (error.message?.includes("assistant")) {
        setErrorMessage("Failed to load interview assistant. Please refresh and try again.");
        toast.error("Failed to load interview assistant.");
      } else {
        setErrorMessage(error.message || "Failed to start interview");
        toast.error("Failed to start interview. Please try again.");
      }

      // Offer retry for certain errors
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  const endInterview = async () => {
    if (!vapiClient) {
      console.error("VAPI client not initialized");
      toast.error("Interview system not ready");
      return;
    }

    if (interviewStatus !== "active") {
      console.error("No active interview to end");
      toast.error("No active interview to end");
      return;
    }

    try {
      console.log("Ending interview...");
      await vapiClient.stop();

      // Reset states immediately
      setActiveCall(null);
      setIsMuted(false);
      setInterviewStatus("completed");

      toast.success("Interview ended successfully");
    } catch (error: any) {
      console.error("Error ending call:", error);
      toast.error(`Failed to end interview: ${error.message || 'Please try again'}`);

      // Force status change even if stop fails
      setInterviewStatus("completed");
      setActiveCall(null);
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    debugVapiClient(); // Add debugging info

    if (!vapiClient) {
      console.error("VAPI client not initialized");
      toast.error("Interview system not ready");
      return;
    }

    if (interviewStatus !== "active") {
      console.error("Cannot toggle mute - interview not active");
      toast.error("No active interview to mute");
      return;
    }

    if (typeof vapiClient.setMuted !== 'function') {
      console.error("setMuted method not available on VAPI client");
      toast.error("Mute functionality not available");
      return;
    }

    try {
      // Check if we can get current mute status first
      const currentMuteStatus = vapiClient.isMuted ? vapiClient.isMuted() : isMuted;
      const newMuteState = !currentMuteStatus;

      console.log("Toggling mute from", currentMuteStatus, "to", newMuteState);

      vapiClient.setMuted(newMuteState);
      setIsMuted(newMuteState);

      // Show feedback to user
      toast.success(newMuteState ? "Microphone muted" : "Microphone unmuted");
    } catch (error: any) {
      console.error("Error toggling mute:", error);
      debugVapiClient(); // Debug again on error
      toast.error(`Failed to toggle mute: ${error.message || 'Unknown error'}`);
    }
  };

  const handleInterviewComplete = async (currentInterviewStatus: string) => {
    if (!user) return;
    if (currentInterviewStatus !== "completed") {
      toast.error("Interview not completed. Please complete the interview.");
      return;
    }
    setSaving(true);
    try {
      // Save interview to database
      console.log("transcript before saving to supabase", transcript);
      const transcriptText = transcript?.length
        ? JSON.stringify(transcript)
        : "Interview completed via voice call";

      const { error } = await supabase.from("interviews").insert({
        user_id: user.id,
        transcript: transcriptText,
        completed_at: new Date().toISOString(),
        score: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
        feedback:
          "Great conversation! Your responses showed strong communication skills and relevant experience.",
        duration: callDuration,
        vapi_call_id: callRecordRef.current?.id ?? null,
        type: jobId ? "job-specific-mock" : "profile-test-mock",
        job_id: jobId || null,
      });

      if (error) throw error;

      if (jobId) {
        // if there's job id then update the application status to mock interview completed
        await supabase
          .from("job_applications")
          .update({ mock_interview_completed: true })
          .eq("user_id", user.id)
          .eq("job_id", jobId);
      } else {
        // if there's no job id it means it is a test mock interview therefore update the profile to mark interview as completed
        await supabase
          .from("profiles")
          .update({ interview_completed: true })
          .eq("id", user.id);
      }

      // Check if there's a pending job application
      const pendingJobId = localStorage.getItem("pendingJobApplication");
      if (pendingJobId) {
        // Apply to the job they wanted to apply to
        try {
          const { error: applyError } = await supabase
            .from("job_applications")
            .insert({
              user_id: user.id,
              job_id: pendingJobId,
              status: "applied",
            });

          if (applyError) throw applyError;
          // NEW: send confirmation email for this first application
if (user?.email) {
  fetch("/api/send-job-application-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email }),
    keepalive: true,
  }).catch((e) => console.error("Email after interview failed:", e));
}
          localStorage.removeItem("pendingJobApplication");
          toast.success("Interview completed and job application submitted!");
        } catch (applyError: any) {
          console.error("Error applying to job after interview:", applyError);
          toast.warning(
            "Interview completed successfully, but couldn't apply to job. Please try again from the dashboard."
          );
        }
      } else {
        toast.success("Interview completed successfully!");
      }

      setInterviewCompleted(true);
    } catch (error: any) {
      console.error("Error saving interview:", error);
      toast.error(error.message || "Failed to save interview");
    } finally {
      setSaving(false);
    }
  };

  const fetchCallDetails = async () => {
    if (!user) return;
    setCallDetailsLoading(true);
    setCallDetailsError("");
    let interviewData: any;
    let interviewError: any;
    try {
      if (!jobId) {
        // Fetch the most recent mock interview for the user from Supabase
        const { data, error } = await supabase
          .from("interviews")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "profile-test-mock")
          .order("completed_at", { ascending: false })
          .limit(1)
          .single();
        interviewData = data;
        interviewError = error;
      } else {
        // Fetch the most recent mock interview for the user from Supabase
        const { data, error } = await supabase
          .from("interviews")
          .select("*")
          .eq("user_id", user.id)
          .eq("job_id", jobId)
          .eq("type", "job-specific-mock")
          .order("completed_at", { ascending: false })
          .limit(1)
          .single();
        interviewData = data;
        interviewError = error;
      }

      if (interviewError) {
        throw new Error(interviewError.message || "Failed to fetch interview");
      }
      // interviewData now contains the first (most recent) record or null
      console.log("interviewData", interviewData);
      if (!interviewData?.vapi_call_id) {
        throw new Error("No interview data found");
      }
      const res = await fetch("/api/vapi/call-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vapiCallId: interviewData?.vapi_call_id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to fetch call details");
      }
      console.log("data from vapi", data);
      if (data?.success) {
        setCallDetails(data?.data);
      } else {
        throw new Error(data?.error || "Failed to fetch call details");
      }
    } catch (err: any) {
      setCallDetailsError(err.message || "Failed to fetch call details");
    } finally {
      setCallDetailsLoading(false);
    }
  };

  // Debug function to check VAPI client state
  const debugVapiClient = () => {
    console.log("VAPI Client Debug:", {
      vapiClient: !!vapiClient,
      activeCall: !!activeCall,
      interviewStatus,
      isMuted,
      clientMethods: vapiClient ? Object.getOwnPropertyNames(Object.getPrototypeOf(vapiClient)) : null,
      hasSetMuted: vapiClient && typeof vapiClient.setMuted === 'function',
      hasIsMuted: vapiClient && typeof vapiClient.isMuted === 'function',
      hasStop: vapiClient && typeof vapiClient.stop === 'function'
    });
  };

  // Enhanced voice indicator with volume level
  const VoiceIndicator = ({ isActive, level = 0 }: { isActive: boolean; level?: number }) => (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-150 ${
            isActive
              ? "bg-gradient-to-t from-green-500 to-green-400"
              : "bg-gray-300"
          }`}
          style={{
            animationDelay: `${i * 0.05}s`,
            height: isActive
              ? `${Math.max(8, Math.min(32, (level / 100) * 32 + Math.random() * 8))}px`
              : "8px",
            opacity: isActive ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {connectionQuality === "good" ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-xs text-green-600">Connected</span>
        </>
      ) : connectionQuality === "poor" ? (
        <>
          <Wifi className="h-4 w-4 text-yellow-500" />
          <span className="text-xs text-yellow-600">Poor connection</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600">Disconnected</span>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing interview...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }


  if (interviewCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader activeTab="interview" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl text-center">
            <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="p-10">
              <div className="flex flex-col items-center space-y-8">
                {/* Success Icon */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }}>
                    <CheckCircle className="h-14 w-14 text-black drop-shadow-lg" />
                  </div>
                  <div className="absolute -inset-3 rounded-full opacity-20 animate-ping" style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }}></div>
                </div>
                {/* Headline and message */}
                <div className="space-y-3">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    Mock Interview Completed!
                  </h2>
                  <div className="flex flex-col items-center space-y-2">
                    {jobId ? (
                      <>
                        <h3 className="text-lg font-semibold">For Position</h3>
                        <p className="inline-flex items-center rounded-md px-2 py-1 text-md font-medium text-black border" style={{ backgroundColor: '#8FFF00/10', borderColor: '#8FFF00/30' }}>
                          {jobDetails?.title} at {jobDetails?.company}
                        </p>
                      </>
                    ) : null}
                  </div>
                  <p className="text-gray-600 text-center max-w-md mx-auto text-lg">
                    Fantastic job! You've completed your mock interview.
                    <br />
                    Ready to put your skills to the test or try again for an
                    even better performance?
                  </p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                  <Button
                    onClick={() => {
                      // Reset interview state to try another one
                      setInterviewCompleted(false);
                      setInterviewStatus("waiting");
                      setTranscript([]);
                      setCallDuration(0);
                      setVapiCallData(null);
                      setCurrentInterviewId(null);
                      setActiveCall(null);
                      setIsMuted(false);
                      setErrorMessage("");
                      setRetryCount(0);
                    }}
                    variant="white-3d"
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    Try Another Interview
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      variant="green"
                      className="px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  You can review your results in the dashboard or try another
                  mock interview.
                </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <CallDetailsModal
          callDetails={callDetails}
          callDetailsLoading={callDetailsLoading}
          callDetailsError={callDetailsError}
          callDetailsOpen={callDetailsOpen}
          setCallDetailsOpen={setCallDetailsOpen}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader activeTab="interview" />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl">
            {/* Interview Tips */}
            {interviewStatus === "waiting" && (
              <Alert className="mb-6 rounded-2xl border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Interview Tips:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Find a quiet environment with good internet connection</li>
                    <li>Be concise but thorough in your answers</li>
                    <li>This interview typically takes approximately 5 minutes</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Card className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">AI Voice Interview</h1>
                  <p className="text-gray-600">
                    This interview is optional but recommended as it helps us get to know you better. Your application will still be reviewed if you choose to skip it.
                  </p>
                  {jobDetails && (
                    <>
                      <p>Test Interview for</p>
                      <p className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-md font-medium text-purple-400 inset-ring inset-ring-purple-400/30">
                        <span className="font-semibold text-indigo-700">
                          {jobDetails.title}
                        </span>
                        <span className="text-slate-400">&nbsp;at&nbsp;</span>
                        <span className="font-semibold text-indigo-700">
                          {jobDetails.company}
                        </span>
                      </p>
                    </>
                  )}
                  {interviewStatus === "active" && (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live • {formatDuration(callDuration)}</span>
                      </div>
                      <ConnectionStatus />
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-8">
                {/* Main Interview Interface */}
                <div className="flex flex-col items-center space-y-8">
                  {/* Futuristic AI Visual */}
                  <div className="relative flex items-center justify-center">
                    {/* Main hexagonal container */}
                    <div className="relative w-40 h-40">
                      {/* Hexagon shape */}
                      <div
                        className={`absolute inset-0 transition-all duration-700 ${
                          interviewStatus === "active"
                            ? "opacity-100 scale-110"
                            : interviewStatus === "connecting"
                              ? "opacity-80 scale-105"
                              : "opacity-70 scale-100"
                        }`}
                        style={{
                          clipPath: "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)"
                        }}
                      >
                        <div
                          className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
                            interviewStatus === "active"
                              ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/30"
                              : interviewStatus === "connecting"
                                ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl shadow-orange-500/30"
                                : "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 shadow-xl shadow-slate-500/20"
                          }`}
                        >
                          {/* Inner content */}
                          <div className="relative flex items-center justify-center">
                            {interviewStatus === "active" ? (
                              <div className="text-white relative">
                                {/* AI brain-like pattern */}
                                <div className="relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-2 border-white/30 rounded-full animate-pulse"></div>
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 border border-white/50 rounded-full animate-ping"></div>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                                  </div>
                                  {/* Neural network lines */}
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-16 h-16">
                                      <svg className="w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                                        <circle cx="32" cy="8" r="1" fill="white" opacity="0.6">
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="8" cy="24" r="1" fill="white" opacity="0.6">
                                          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="56" cy="24" r="1" fill="white" opacity="0.6">
                                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                                        </circle>
                                        <circle cx="32" cy="56" r="1" fill="white" opacity="0.6">
                                          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" begin="1s" />
                                        </circle>
                                        <line x1="32" y1="32" x2="32" y2="8" stroke="white" strokeWidth="0.5" opacity="0.4">
                                          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                                        </line>
                                        <line x1="32" y1="32" x2="8" y2="24" stroke="white" strokeWidth="0.5" opacity="0.4">
                                          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                                        </line>
                                        <line x1="32" y1="32" x2="56" y2="24" stroke="white" strokeWidth="0.5" opacity="0.4">
                                          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
                                        </line>
                                        <line x1="32" y1="32" x2="32" y2="56" stroke="white" strokeWidth="0.5" opacity="0.4">
                                          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" begin="1.5s" />
                                        </line>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <VoiceIndicator isActive={isAssistantSpeaking} level={volumeLevel} />
                              </div>
                            ) : interviewStatus === "connecting" ? (
                              <div className="text-white relative">
                                <div className="animate-spin">
                                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32">
                                      <animate attributeName="stroke-dasharray" values="0 32;16 16;0 32;0 32" dur="2s" repeatCount="indefinite" />
                                      <animate attributeName="stroke-dashoffset" values="0;-16;-32;-32" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                  </svg>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Phone className="h-6 w-6 text-white animate-pulse" />
                                </div>
                              </div>
                            ) : (
                              <div className="text-white relative">
                                <div className="flex flex-col items-center space-y-2">
                                  <Mic className="h-8 w-8 text-white/80" />
                                  <div className="w-8 h-0.5 bg-white/40 rounded-full"></div>
                                  <div className="w-4 h-0.5 bg-white/40 rounded-full"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rotating outer ring for active state */}
                      {interviewStatus === "active" && (
                        <div className="absolute -inset-4">
                          <div
                            className="w-full h-full border-2 border-cyan-400/30 animate-spin"
                            style={{
                              clipPath: "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                              animationDuration: "10s"
                            }}
                          ></div>
                        </div>
                      )}

                      {/* Pulsing glow effect */}
                      {(interviewStatus === "active" || interviewStatus === "connecting") && (
                        <div className="absolute -inset-8 opacity-30">
                          <div
                            className={`w-full h-full rounded-full animate-pulse ${
                              interviewStatus === "active"
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                                : "bg-gradient-to-r from-orange-500/20 to-red-500/20"
                            }`}
                            style={{
                              filter: 'blur(20px)',
                              animationDuration: '2s'
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-center space-y-2">
                    {interviewStatus === "waiting" && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Ready to Start Your Interview
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Click the button below to begin your interview with Friday.
                          through the process.
                        </p>
                      </>
                    )}

                    {interviewStatus === "connecting" && (
                      <>
                        <h3 className="text-xl font-semibold text-yellow-600 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Connecting...
                        </h3>
                        <p className="text-gray-600">
                          Setting up your interview session. This may take a moment.
                        </p>
                        <div className="flex items-center justify-center mt-4">
                          <Progress className="w-48" value={33} />
                        </div>
                      </>
                    )}

                    {interviewStatus === "active" && (
                      <>
                        <h3 className="text-xl font-semibold text-green-600">
                          Interview in Progress
                        </h3>
                        <p className="text-gray-600">
                          Speak clearly and naturally. The AI is listening and
                          will respond.
                        </p>
                      </>
                    )}

                    {interviewStatus === "error" && (
                      <>
                        <h3 className="text-xl font-semibold text-red-600">
                          Connection Error
                        </h3>
                        {errorMessage && (
                          <Alert className="max-w-md mx-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                          </Alert>
                        )}
                        <p className="text-gray-600">
                          {retryCount > 0 && retryCount < 3
                            ? `Retry attempt ${retryCount}/3. Please try again.`
                            : "Please check your connection and try again."}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center space-x-4">
                    {interviewStatus === "waiting" ||
                    interviewStatus === "error" ? (
                      <Button
                        size="lg"
                        variant="green"
                        onClick={startInterview}
                        className="px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        <PhoneCall className="w-5 h-5 mr-2" />
                        Start Interview
                      </Button>
                    ) : null}

                    {interviewStatus === "active" && (
                      <>
                        <Button
                          variant={isMuted ? "destructive" : "outline"}
                          onClick={toggleMute}
                          className="rounded-full px-4 py-2 transition-all"
                          title={isMuted ? "Unmute microphone" : "Mute microphone"}
                        >
                          {isMuted ? (
                            <>
                              <MicOff className="w-4 h-4 mr-2" />
                              <span className="text-sm">Muted</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 mr-2" />
                              <span className="text-sm">Mute</span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={endInterview}
                          className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <PhoneOff className="w-4 h-4 mr-2" />
                          End Interview
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function InterviewPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading interview...</p>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function InterviewPage() {
  return (
    <Suspense fallback={<InterviewPageLoading />}>
      <InterviewPageContent />
    </Suspense>
  );
}
