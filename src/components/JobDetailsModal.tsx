"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Check,
  Plus,
  FileText,
  Mic,
  Briefcase,
  Database,
  Stethoscope,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

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

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  isApplied: boolean;
}

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
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "mid":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "senior":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case "executive":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  onApply,
  isApplied,
}: JobDetailsModalProps) {
  if (!job) return null;

  const IconComponent = getJobIcon(job.title);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {job.title}
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground mb-4">
                {job.company}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-6" />

        <div className="space-y-6">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {job.remote ? "Remote" : job.location}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
              </span>
            </div>
            {job.salary_min && job.salary_max && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  ${job.salary_min} - ${job.salary_max}/hour
                </span>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* Application Status */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Application Status</h4>
                <p className="text-sm text-muted-foreground">
                  {isApplied
                    ? "You have already applied to this position"
                    : "Ready to apply to this position"}
                </p>
              </div>
              <Button
                onClick={() => onApply(job.id)}
                disabled={isApplied}
                variant={isApplied ? "white-3d" : "green"}
                className="min-w-[120px]"
              >
                {isApplied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Applied
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
