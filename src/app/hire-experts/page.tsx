"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowRight, Cog, Cpu, Code2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";

export default function GetQuotePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sales-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit inquiry");
      }

      setIsSubmitted(true);
      toast.success("Thank you! We'll be in touch within 24 hours.");
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <Card className="w-full max-w-md border border-gray-200 bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, #8FFF00, #6fc200)",
                }}
              >
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Quote Request Received!
              </h2>
              <p className="text-gray-600 mb-6">
                Our engineering team will review your project and get back to
                you within 24 hours with a detailed scope, timeline, and
                fixed-price quote.
              </p>
              <Link href="/">
                <Button
                  variant="green"
                  className="px-6 py-3 rounded-2xl font-semibold"
                >
                  Return to Homepage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="relative">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#8FFF00]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get a Free Quote
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tell us about your project and get a fixed-price quote within 24
              hours. No commitment, no hidden fees.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left side - Why choose us */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                What you&apos;ll get:
              </h3>
              <div className="space-y-5">
                {[
                  {
                    icon: Cog,
                    title: "Detailed Scope Document",
                    description:
                      "A clear breakdown of exactly what we'll deliver, with milestones and timelines.",
                  },
                  {
                    icon: Cpu,
                    title: "Fixed-Price Quote",
                    description:
                      "No hourly billing. You'll know the exact cost before we start.",
                  },
                  {
                    icon: Code2,
                    title: "Engineer Match",
                    description:
                      "We'll assign a dedicated engineer with the right expertise for your project.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mt-8">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">Quick response guaranteed.</span>{" "}
                  Our team reviews every inquiry within 24 hours. For urgent
                  projects, mention it in your message and we&apos;ll prioritize
                  your quote.
                </p>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-3">
              <Card className="border border-gray-200 bg-white shadow-xl">
                <CardHeader className="border-b border-gray-100 p-6">
                  <CardTitle className="text-gray-900 text-xl">
                    Tell us about your project
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    The more detail you provide, the more accurate our quote will
                    be.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Jane"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@startup.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company / Startup Name</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your startup name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectType">
                        What do you need help with?
                      </Label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a service</option>
                        <option value="mechanical">Mechanical Design</option>
                        <option value="electrical">Electrical Design</option>
                        <option value="software">Software Development</option>
                        <option value="full-product">
                          Full Product (Mechanical + Electrical + Software)
                        </option>
                        <option value="other">Other / Not sure yet</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Project Description</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe your project: What are you building? What stage are you at? What deliverables do you need? Any timeline constraints?"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="green"
                      className="w-full py-3 h-auto text-base font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Get My Free Quote
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
