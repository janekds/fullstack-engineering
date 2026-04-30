"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Cpu,
  Cog,
  Code2,
  Clock,
  DollarSign,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Rocket,
  FileText,
  Wrench,
  Package,
  Globe,
  FileCheck,
} from "lucide-react";

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const services = [
    {
      title: "Mechanical Design",
      description:
        "From concept sketches to production-ready CAD models. We deliver full mechanical design packages including 3D modeling, FEA analysis, tolerance studies, and manufacturing drawings.",
      icon: Cog,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "3D CAD modeling (SolidWorks, Fusion 360)",
        "Finite Element Analysis (FEA)",
        "Design for Manufacturing (DFM)",
        "GD&T and manufacturing drawings",
        "Prototyping support",
      ],
    },
    {
      title: "Electrical Design",
      description:
        "Complete electrical engineering from schematic capture to PCB layout. We handle power systems, embedded hardware, and full board bring-up.",
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        "Schematic design & PCB layout",
        "Power supply & battery management",
        "Embedded systems & microcontrollers",
        "Sensor integration & signal conditioning",
        "EMC/EMI compliance design",
      ],
    },
    {
      title: "Software Development",
      description:
        "Firmware, embedded software, web apps, and mobile interfaces. We build the full software stack to bring your hardware to life.",
      icon: Code2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Firmware & RTOS development",
        "IoT platforms & cloud connectivity",
        "Web dashboards & APIs",
        "Mobile apps (React Native, Flutter)",
        "CI/CD and DevOps pipelines",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Share Your Brief",
      description:
        "Tell us about your project. A napkin sketch, a spec doc, or just an idea — we'll work with whatever you have.",
    },
    {
      number: "02",
      icon: Wrench,
      title: "We Scope & Design",
      description:
        "Our engineering team creates a detailed scope, timeline, and fixed-price quote. Design work begins within days of approval.",
    },
    {
      number: "03",
      icon: Rocket,
      title: "Review & Iterate",
      description:
        "You get regular design reviews with your dedicated engineer. Feedback loops are fast — typically 24-48 hour turnaround.",
    },
    {
      number: "04",
      icon: Package,
      title: "Deliver Production-Ready Files",
      description:
        "Receive complete deliverables: CAD files, PCB Gerbers, firmware repos, BOMs, and manufacturing documentation.",
    },
  ];

  const benefits = [
    {
      title: "10x Lower Cost",
      description:
        "Our offshore engineering team delivers the same quality as a $150/hr US engineer — at a fraction of the price. Fixed-price projects mean no surprises.",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Fast Turnaround",
      description:
        "Most projects kick off within 48 hours. Our team works across time zones so your project moves forward around the clock.",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Production Quality",
      description:
        "Every deliverable is DFM-reviewed and manufacturing-ready. We use industry-standard tools and follow best practices so your designs go straight to production.",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Dedicated Engineer",
      description:
        "You get a named engineer who knows your project inside-out. Direct communication, no middlemen, no agency overhead.",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "NDA-Protected",
      description:
        "We sign NDAs before any project begins. Your IP, designs, and trade secrets stay fully protected throughout the engagement.",
      icon: FileCheck,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "English-Speaking Team",
      description:
        "Our engineering team is based in Sri Lanka, with all consulting calls, design reviews, and documentation delivered in fluent English.",
      icon: Globe,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ];

  const faqs = [
    {
      question: "What types of startups do you work with?",
      answer:
        "We work with hardware startups, IoT companies, consumer electronics brands, medtech, robotics, and any team building a physical or connected product. Whether you're pre-seed or Series B, we scale to your needs.",
    },
    {
      question: "How does pricing work?",
      answer:
        "We offer fixed-price project quotes so you know the cost upfront. No hourly billing surprises. A typical mechanical or electrical design project starts around $2,000–$5,000, which would cost $20,000–$50,000 with a US-based hire.",
    },
    {
      question: "What's the typical turnaround time?",
      answer:
        "Simple designs can be completed in 1–2 weeks. Full product designs (mechanical + electrical + firmware) typically take 4–8 weeks. We'll give you a precise timeline in our quote.",
    },
    {
      question: "How do you ensure quality?",
      answer:
        "Every project goes through our internal design review process. We use industry-standard tools (SolidWorks, Altium, KiCad) and follow DFM/DFA best practices. All deliverables are production-ready.",
    },
    {
      question: "Can you help with manufacturing?",
      answer:
        "Yes. We provide full manufacturing packages including BOMs, assembly drawings, Gerber files, and can connect you with vetted manufacturing partners in Asia for prototyping and production.",
    },
    {
      question: "What if I only need one discipline (e.g., just PCB design)?",
      answer:
        "Absolutely. You can engage us for mechanical only, electrical only, or software only. Many clients start with one service and expand as their product evolves.",
    },
    {
      question: "How do we communicate during a project?",
      answer:
        "You'll have a dedicated engineer and direct access via Slack, email, or video calls. All communication, design reviews, and documentation are in English. We provide weekly progress updates and design review sessions.",
    },
    {
      question: "Where is the engineering team based?",
      answer:
        "Our engineering team is based in Sri Lanka. This allows us to offer world-class engineering at significantly lower cost while working across time zones — so your project moves forward around the clock.",
    },
    {
      question: "Can you sign an NDA?",
      answer:
        "Absolutely. We sign NDAs before any project begins and before we review any proprietary information. Your IP, designs, and trade secrets are fully protected throughout the engagement.",
    },
  ];

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-[11rem] pb-16 md:pb-24 overflow-hidden bg-white">
        <div className="absolute top-32 right-20 w-[600px] h-[600px] bg-[#74ce00] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-[600px] left-20 w-[600px] h-[600px] bg-[#74ce00] opacity-10 rounded-full blur-3xl"></div>

        <div
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(116, 206, 0, 0.08) 0%,
              rgba(116, 206, 0, 0.04) 20%,
              rgba(116, 206, 0, 0.02) 40%,
              rgba(116, 206, 0, 0.01) 70%,
              transparent 100%)`,
          }}
        ></div>

        <div className="relative z-10 w-full flex items-center justify-center px-10 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-md sm:max-w-5xl mx-auto px-4 sm:px-0"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-[2.25rem] sm:text-[3.7rem] font-bold mb-6 leading-[1.15] sm:leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gray-900 block">
                World-class engineering.
              </span>
              <span className="text-[#74ce00] block">
                10x lower cost.
              </span>
            </motion.h1>

            <motion.p
              className="text-[1.05rem] sm:text-xl text-gray-700 mb-8 mx-auto px-4 sm:px-0 leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Mechanical, electrical, and software design from our Sri Lanka-based
              engineering team — production-ready results, fast turnaround, all
              consulting in English, and NDA-protected from day one.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 items-center px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
                <Link href="/hire-experts" className="w-[80%] sm:w-auto">
                  <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      variant="green"
                      size="lg"
                      className="text-base w-full sm:w-auto min-w-[200px] h-12 sm:h-auto"
                    >
                      Get a Free Quote
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>

                <Link href="#services" className="w-[80%] sm:w-auto">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      variant="white-3d"
                      size="lg"
                      className="text-base w-full sm:w-auto min-w-[200px] h-12 sm:h-auto"
                    >
                      View Our Services
                    </Button>
                  </motion.div>
                </Link>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              End-to-end engineering services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to go from idea to production — under one
              roof.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card className="bg-white border-0 rounded-2xl shadow-sm h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-8">
                      <div
                        className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6`}
                      >
                        <Icon className={`w-7 h-7 ${service.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2.5">
                        {service.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-gray-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#74ce00] mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              How it works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From first contact to delivered files in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative bg-gray-50 rounded-2xl p-8 flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="absolute top-4 right-4 bg-[#8FFF00]/15 rounded-xl px-3 py-1 text-sm font-bold text-[#74ce00]">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Cost Comparison Section */}
      <motion.section
        className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#74ce00] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[#74ce00] opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Why pay $150/hr when you don&apos;t have to?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Hiring a full-time engineer in the US costs $120K–$200K/year. A
              contract engineer runs $100–$200/hr. Our Sri Lanka-based team
              delivers the same quality at a fixed price you can actually budget
              for — with NDAs signed before we start.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-red-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                Traditional Route
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full mechanical design package", price: "$15,000–$30,000" },
                  { label: "PCB + schematic design", price: "$8,000–$20,000" },
                  { label: "Firmware development", price: "$10,000–$25,000" },
                  { label: "Full product (mech + elec + SW)", price: "$50,000–$100,000" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                  >
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-sm line-through decoration-red-400/60">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#74ce00]/20 to-[#8FFF00]/10 rounded-2xl p-8 border border-[#74ce00]/30">
              <div className="text-[#8FFF00] text-sm font-semibold mb-4 uppercase tracking-wider">
                With Fullstack Engineering
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full mechanical design package", price: "$2,000–$5,000" },
                  { label: "PCB + schematic design", price: "$1,500–$4,000" },
                  { label: "Firmware development", price: "$1,500–$5,000" },
                  { label: "Full product (mech + elec + SW)", price: "$5,000–$15,000" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-[#74ce00]/20 last:border-0"
                  >
                    <span className="text-gray-200 text-sm">{item.label}</span>
                    <span className="text-[#8FFF00] font-bold text-sm">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/hire-experts">
              <Button
                variant="green"
                size="lg"
                className="text-base px-8 py-4 h-auto"
              >
                Get Your Custom Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Us Section */}
      <motion.section
        id="why-us"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Why startups choose Fullstack
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We&apos;re built for startups who move fast and need results — not
              overhead.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className={`w-14 h-14 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="py-[7rem] px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently asked questions
          </motion.h2>

          <motion.div
            className="space-y-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: expandedFaq === index ? "auto" : 0,
                    opacity: expandedFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-black py-[7rem] px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Stop overpaying for engineering.
            <br />
            <span className="text-[#8FFF00]">Start building.</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Get a detailed quote within 24 hours. No commitment, no fluff — just
            a clear scope, timeline, and price for your project.
          </p>
          <Link href="/hire-experts">
            <Button variant="green" className="text-lg px-8 py-4 h-auto">
              Get Your Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      <Footer />
    </motion.div>
  );
}
