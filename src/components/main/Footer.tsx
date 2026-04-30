"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="bg-white border-t border-gray-200 pt-12 sm:pt-16 lg:pt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a2e435] to-[#5fd10d] flex items-center justify-center">
                <span className="text-black font-black text-sm">F</span>
              </div>
              <span className="text-gray-900 font-bold text-lg tracking-tight">
                Fullstack<span className="text-[#5fd10d]">.</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Mechanical, electrical, and software design from Sri Lanka.
              Production-ready engineering at 10x lower cost, NDA-protected.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Services
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/#services"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      Mechanical Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#services"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      Electrical Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#services"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      Software Development
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Company
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#faq"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hire-experts"
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-1"
                    >
                      Get a Quote
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right order-first lg:order-last">
            <div className="space-y-3 mb-6">
              <Link href="/hire-experts">
                <Button
                  variant="green"
                  className="w-full sm:w-auto lg:w-auto min-h-[44px] px-6 py-3 text-sm sm:text-base font-semibold rounded-2xl touch-manipulation"
                >
                  Get a Free Quote
                </Button>
              </Link>
              <a href="mailto:hello@fullstackengineering.co" className="block">
                <Button
                  variant="white-3d"
                  className="w-full sm:w-auto lg:w-auto min-h-[44px] px-6 py-3 text-sm sm:text-base font-semibold rounded-2xl touch-manipulation"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 sm:pt-8 mt-8 sm:mt-10 lg:mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex space-x-8 sm:space-x-4 order-2 sm:order-1">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors p-3 -m-3 rounded-lg touch-manipulation"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors p-3 -m-3 rounded-lg touch-manipulation"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-6 h-6 sm:w-5 sm:h-5" />
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center sm:text-right order-1 sm:order-2">
              &copy; {new Date().getFullYear()} Fullstack Engineering. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden pt-8 sm:pt-10 lg:pt-12 bg-white">
        <div className="flex items-center justify-center">
          <h2 className="leading-none text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-bold text-transparent bg-gradient-to-b from-transparent to-gray-800/30 bg-clip-text select-none opacity-50 whitespace-nowrap">
            Fullstack.
          </h2>
        </div>
      </div>
    </motion.footer>
  );
}
