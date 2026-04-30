"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Cog, Cpu, Code2, Mail } from "lucide-react";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { motion } from "framer-motion";

const EMAIL = "engineering@full-stack-engineering.com";

function buildMailto(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function GetQuotePage() {
  const quoteMailto = buildMailto(
    "Project Inquiry — Free Quote Request",
    `Hi Fullstack Engineering,

I'd like to get a quote for a project. Here are the details:

Company/Startup: 
Project type (Mechanical / Electrical / Software / Full Product): 
Brief description: 


Timeline / deadlines: 

Looking forward to hearing from you.

Best regards,
`
  );

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <div className="relative">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#8FFF00]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get a Free Quote
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Tell us about your project and get a fixed-price quote within 24
              hours. No commitment, no hidden fees.
            </p>
            <a href={quoteMailto}>
              <Button
                variant="green"
                size="lg"
                className="text-lg px-10 py-5 h-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us Your Project Brief
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Or email us directly at{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-[#74ce00] font-semibold hover:underline"
              >
                {EMAIL}
              </a>
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: Cog,
                title: "Detailed Scope Document",
                description:
                  "A clear breakdown of exactly what we'll deliver, with milestones and timelines.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: Cpu,
                title: "Fixed-Price Quote",
                description:
                  "No hourly billing. You'll know the exact cost before we start.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: Code2,
                title: "Dedicated Engineer",
                description:
                  "We'll assign a named engineer with the right expertise for your project.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-50 border-0 rounded-2xl shadow-sm"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center mb-5 mx-auto`}
                    >
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <motion.div
            className="bg-gray-50 rounded-2xl p-8 mt-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">Quick response guaranteed.</span>{" "}
              Our team reviews every inquiry within 24 hours. For urgent
              projects, mention it in your email and we&apos;ll prioritize your
              quote. NDAs signed before any proprietary information is shared.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
