"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  HelpCircle,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { getVapiClient, startVapiCall, stopVapiCall } from "@/lib/vapiClient";

// Allow TSX to use the custom element <vapi-widget>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vapi-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "assistant-id": string;
        "public-key": string;
      };
    }
  }
}

function MeetFridayPageContent() {
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
  const fridayId = process.env.NEXT_PUBLIC_VAPI_FRIDAY_ASSISTANT_ID!;

  const [callStatus, setCallStatus] = useState<
    "waiting" | "connecting" | "active" | "completed" | "error"
  >("waiting");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<"good" | "poor" | "disconnected">("good");
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const client = getVapiClient();
    if (!client) return;

    const handleCallStart = () => {
      console.log("Call started");
      setCallStatus("active");
      setConnectionQuality("good");
      setErrorMessage("");
      setIsMuted(false);
      startTimer();
      toast.success("Connected to Friday successfully!");
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallStatus("completed");
      setIsAssistantSpeaking(false);
      setIsMuted(false);
      stopTimer();
      toast.success("Call with Friday ended");
    };

    const handleSpeechStart = () => {
      console.log("Assistant started speaking");
      setIsAssistantSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("Assistant stopped speaking");
      setIsAssistantSpeaking(false);
    };

    const handleVolumeLevel = (level: number) => {
      setVolumeLevel(Math.min(100, Math.max(0, level * 100)));
    };

    const handleError = (error: any) => {
      console.error("VAPI Error:", error);
      setCallStatus("error");
      setConnectionQuality("disconnected");

      const errorMsg = error?.message || "Connection failed";
      setErrorMessage(errorMsg);

      if (error?.code === "NETWORK_ERROR") {
        setConnectionQuality("poor");
        toast.error("Network connection issue. Please check your internet.");
      } else if (error?.code === "PERMISSION_DENIED") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else {
        toast.error(`${errorMsg}. Please try again.`);
      }
    };

    client.on("call-start", handleCallStart);
    client.on("call-end", handleCallEnd);
    client.on("speech-start", handleSpeechStart);
    client.on("speech-end", handleSpeechEnd);
    client.on("volume-level", handleVolumeLevel);
    client.on("error", handleError);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const startCall = async () => {
    try {
      setCallStatus("connecting");
      setErrorMessage("");
      setRetryCount(0);

      // Check for microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      console.log("Starting call with Friday:", fridayId);
      await startVapiCall(fridayId);

    } catch (error: any) {
      console.error("Failed to start call:", error);
      setCallStatus("error");

      if (error.name === "NotAllowedError") {
        setErrorMessage("Microphone permission denied");
        toast.error("Please allow microphone access to talk with Friday.");
      } else {
        setErrorMessage(error.message || "Failed to connect to Friday");
        toast.error("Failed to connect to Friday. Please try again.");
      }

      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  const endCall = async () => {
    try {
      console.log("Ending call...");
      await stopVapiCall();
      setIsMuted(false);
      setCallStatus("waiting");
      toast.success("Call ended successfully");
    } catch (error: any) {
      console.error("Error ending call:", error);
      toast.error(`Failed to end call: ${error.message || 'Please try again'}`);
      setCallStatus("waiting");
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const client = getVapiClient();
    if (!client) {
      toast.error("Friday is not ready");
      return;
    }

    if (callStatus !== "active") {
      toast.error("No active call to mute");
      return;
    }

    try {
      const newMuteState = !isMuted;
      if (typeof client.setMuted === 'function') {
        client.setMuted(newMuteState);
        setIsMuted(newMuteState);
        toast.success(newMuteState ? "Microphone muted" : "Microphone unmuted");
      } else {
        toast.error("Mute functionality not available");
      }
    } catch (error: any) {
      console.error("Error toggling mute:", error);
      toast.error(`Failed to toggle mute: ${error.message || 'Unknown error'}`);
    }
  };

  // Enhanced voice indicator with volume level
  const VoiceIndicator = ({ isActive, level = 0 }: { isActive: boolean; level?: number }) => (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-2 rounded-full transition-all duration-150 ${
            isActive
              ? "bg-white"
              : "bg-white/30"
          }`}
          style={{
            animationDelay: `${i * 0.05}s`,
            height: isActive
              ? `${Math.max(12, Math.min(40, (level / 100) * 40 + Math.random() * 10))}px`
              : "12px",
            opacity: isActive ? 1 : 0.5
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

  return (
    <div className="min-h-screen bg-black relative">
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes neural-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.4); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.4); }
        }
        .neural-pulse {
          animation: neural-pulse 2s infinite;
        }

        /* Force Tailwind responsive classes to work properly */
        @media (min-width: 768px) {
          .md\:flex {
            display: flex !important;
          }
          .md\:hidden {
            display: none !important;
          }
        }

        /* Prevent external CSS from overriding responsive behavior */
        .header-desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .header-desktop {
            display: flex !important;
          }
          .header-mobile {
            display: none !important;
          }
        }
      `}</style>
      <Header />

      {/* Main Content Container with overflow hidden */}
      <div className="relative overflow-hidden">
        {/* Purple Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-black to-black"></div>

        {/* Advanced Animated Background Effects */}
        <div className="absolute top-32 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-48 h-48 bg-purple-600/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Floating particles */}
        <div className="absolute top-40 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
        <div className="absolute top-60 right-32 w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-bounce" style={{animationDelay: '1.2s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-purple-500/60 rounded-full animate-bounce" style={{animationDelay: '2.1s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-1/3 right-20 w-2.5 h-2.5 bg-purple-200/60 rounded-full animate-bounce" style={{animationDelay: '0.8s', animationDuration: '2.8s'}}></div>

        {/* Matrix-style vertical lines */}
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent animate-pulse" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse" style={{animationDelay: '1.1s'}}></div>
        <div className="absolute right-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-300/30 to-transparent animate-pulse" style={{animationDelay: '1.8s'}}></div>

      {/* Hero Section */}
      <div className="relative z-10 pt-40 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              Meet Friday
            </h1>

            <div className="flex items-center justify-center mb-6">
              <p className="text-xl sm:text-2xl text-gray-300 font-light">
                Durdle’s AI Recruitment Agent
              </p>
            </div>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Want to learn more about Durdle or the type of research projects you will be a part of? Just ask Friday.
            </p>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-center">
            <div className="w-full">

            <Card className="rounded-3xl border border-purple-500/30 bg-black/70 backdrop-blur-xl shadow-2xl shadow-purple-500/20 overflow-hidden relative">
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-purple-500/20 to-purple-300/20 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative z-10 bg-black/80 rounded-3xl">

              <CardContent className="p-8 bg-black/60 relative">
                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10"
                     style={{
                       backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(147,51,234,0.3) 1px, transparent 0)',
                       backgroundSize: '40px 40px'
                     }}></div>
                <div className="relative z-10">
                {/* Main Interface */}
                <div className="flex flex-col items-center space-y-8">
                  {/* Futuristic AI Visual */}
                  <div className="relative w-48 h-48">
                    {/* Animated glow border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-purple-500/20 to-purple-300/20 rounded-lg blur-xl animate-pulse"></div>
                    {/* Main holographic container */}
                    <div className="relative w-full h-full z-10">
                      {/* Holographic frame */}
                      <div className="absolute inset-0 rounded-lg border border-purple-400/50 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-800/20 backdrop-blur-sm"
                           style={{
                             clipPath: 'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)'
                           }}>

                        {/* Inner glow effect */}
                        <div className="absolute inset-2 rounded bg-gradient-to-br from-purple-500/10 via-purple-600/10 to-transparent"
                             style={{
                               clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)'
                             }}></div>
                      </div>

                      {/* Central AI core */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`relative transition-all duration-700 ${
                          callStatus === "active"
                            ? "scale-110"
                            : callStatus === "connecting"
                              ? "scale-105 animate-pulse"
                              : "scale-100"
                        }`}>
                          {/* Core orb */}
                          <button
                            onClick={callStatus === "waiting" || callStatus === "error" || callStatus === "completed" ? startCall : undefined}
                            disabled={callStatus === "connecting" || callStatus === "active"}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                              callStatus === "active"
                                ? "bg-gradient-to-r from-purple-400 to-purple-500 shadow-[0_0_50px_rgba(147,51,234,0.6)] cursor-default"
                                : callStatus === "connecting"
                                  ? "bg-gradient-to-r from-purple-400 to-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.6)] animate-pulse cursor-wait"
                                  : "bg-gradient-to-r from-purple-600/70 to-purple-700/70 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:from-purple-500/80 hover:to-purple-600/80 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] hover:scale-105 cursor-pointer"
                            }`}
                          >
                            {callStatus === "active" ? (
                              <div className="text-white">
                                <VoiceIndicator isActive={isAssistantSpeaking} level={volumeLevel} />
                              </div>
                            ) : callStatus === "connecting" ? (
                              <div className="animate-spin">
                                <Bot className="h-8 w-8 text-white" />
                              </div>
                            ) : (
                              <Bot className="h-8 w-8 text-white/90 group-hover:text-white transition-colors" />
                            )}
                          </button>

                          {/* Rotating energy rings */}
                          {callStatus === "active" && (
                            <>
                              <div className="absolute inset-0 rounded-full border-2 border-purple-400/60 animate-spin" style={{animationDuration: '3s'}}></div>
                              <div className="absolute -inset-3 rounded-full border border-purple-300/40 animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
                              <div className="absolute -inset-6 rounded-full border border-purple-500/30 animate-spin" style={{animationDuration: '6s'}}></div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Corner accent lights */}
                      <div className="absolute top-0 left-0 w-6 h-6 bg-purple-400/60 rounded-full blur-sm animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 bg-purple-300/60 rounded-full blur-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 bg-purple-500/60 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-200/60 rounded-full blur-sm animate-pulse" style={{animationDelay: '1.5s'}}></div>

                      {/* Scanning lines effect for active state */}
                      {callStatus === "active" && (
                        <div className="absolute inset-0 overflow-hidden"
                             style={{
                               clipPath: 'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)'
                             }}>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/20 to-transparent h-full w-full animate-pulse"
                               style={{
                                 background: 'linear-gradient(0deg, transparent 0%, rgba(147,51,234,0.3) 50%, transparent 100%)',
                                 animation: 'scan 2s infinite linear'
                               }}></div>
                        </div>
                      )}

                      {/* Data streams */}
                      {callStatus === "active" && (
                        <>
                          <div className="absolute left-0 top-1/4 w-16 h-px bg-gradient-to-r from-purple-400/60 to-transparent animate-pulse"></div>
                          <div className="absolute right-0 top-1/2 w-20 h-px bg-gradient-to-l from-purple-300/60 to-transparent animate-pulse" style={{animationDelay: '0.3s'}}></div>
                          <div className="absolute left-0 bottom-1/4 w-12 h-px bg-gradient-to-r from-purple-500/60 to-transparent animate-pulse" style={{animationDelay: '0.7s'}}></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-center space-y-2">
                    {callStatus === "waiting" && (
                      <>
                        <h3 className="text-xl font-semibold text-white">
                          Friday is Online
                        </h3>
                        <p className="text-purple-200/80 max-w-md">
                          
                        </p>
                      </>
                    )}

                    {callStatus === "connecting" && (
                      <>
                        <h3 className="text-xl font-semibold text-purple-300 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Connecting to Friday...
                        </h3>
                        <p className="text-purple-200/90">
                          Setting up voice connection. This may take a moment.
                        </p>
                        <div className="flex items-center justify-center mt-4">
                          <Progress className="w-48 bg-purple-900/50" value={33} />
                        </div>
                      </>
                    )}

                    {callStatus === "active" && (
                      <>
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
                          🎙️ Live Conversation
                        </h3>
                        <p className="text-purple-200/90">
                          Friday is listening. Speak naturally about RLHF, AI, or anything you'd like to explore.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full border border-purple-500/30 animate-pulse">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                            <span>Live • {formatDuration(callDuration)}</span>
                          </div>
                          <ConnectionStatus />
                        </div>
                      </>
                    )}

                    {callStatus === "error" && (
                      <>
                        <h3 className="text-xl font-semibold text-red-400">
                          Connection Error
                        </h3>
                        {errorMessage && (
                          <Alert className="max-w-md mx-auto bg-red-900/20 border-red-500/30 text-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                          </Alert>
                        )}
                        <p className="text-purple-200">
                          {retryCount > 0 && retryCount < 3
                            ? `Retry attempt ${retryCount}/3. Please try again.`
                            : "Please check your connection and try again."}
                        </p>
                      </>
                    )}

                    {callStatus === "completed" && (
                      <>
                        <h3 className="text-xl font-semibold text-white">
                          Conversation Complete
                        </h3>
                        <p className="text-purple-200/90">
                          Conversation complete. Thanks for talking with Friday!
                        </p>
                      </>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-col items-center space-y-4">
                    {(callStatus === "waiting" || callStatus === "error" || callStatus === "completed") && (
                      <Button
                        size="lg"
                        variant="default"
                        onClick={startCall}
                        className="w-full px-8 py-3 font-semibold rounded-full bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 border-2 border-purple-400/50 shadow-[0_8px_16px_-4px_rgba(147,51,234,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(147,51,234,0.6)] active:transform active:scale-95 transition-all duration-200 text-white"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          boxShadow: '0 8px 16px -4px rgba(147,51,234,0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)'
                        }}
                      >
                        <PhoneCall className="w-5 h-5 mr-2" />
                        Start Talking
                      </Button>
                    )}

                    {callStatus === "active" && (
                      <div className="flex items-center space-x-4 w-full justify-center">
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
                          onClick={endCall}
                          className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <PhoneOff className="w-4 h-4 mr-2" />
                          End Call
                        </Button>
                      </div>
                    )}
                  </div>

                </div>
                </div>
              </CardContent>
              </div>
            </Card>

            {/* Tips Help - Subtle placement */}
            <div className="flex items-center justify-center mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-purple-300/60 hover:text-purple-200 hover:bg-purple-500/10 text-sm px-4 py-2 h-auto">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Need help getting started?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-purple-600" />
                      What can Friday help you with?
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="text-sm text-gray-600">
                        <div className="space-y-4 mt-4">
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Want to learn more about Durdle or the type of research projects you will be a part of?</h4>
                            <p className="text-purple-700">ust talk to Friday! Friday is equipped with deep knowledge about the type of AI research projects you can work on, as well as Durdle's innovative approach to connect you with the best research opportunities.</p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-800">Tips for the best experience:</h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              <li>Find a quiet environment with good internet connection</li>
                              <li>Feel free to ask Friday any specific questions you have</li>
                              <li>Feel free to dive deep into technical discussions!</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Load the widget script */}
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

// Loading component for Suspense fallback
function MeetFridayPageLoading() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex items-center justify-center pt-32 pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-300 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Friday...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Main component
export default function MeetFridayPage() {
  return <MeetFridayPageContent />;
}
