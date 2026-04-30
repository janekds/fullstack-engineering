"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[1350px] transition-all duration-300 ${
        isScrolled ? "w-[95%] top-2" : ""
      }`}
    >
      <nav
        className={`bg-black/95 backdrop-blur-md rounded-[25px] px-4 sm:px-6 py-3 shadow-2xl border border-gray-800/50 transition-all duration-300 ${
          isScrolled ? "bg-black/98" : ""
        }`}
      >
        <div className="flex items-center justify-between min-w-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a2e435] to-[#5fd10d] flex items-center justify-center">
              <span className="text-black font-black text-sm">F</span>
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              Fullstack<span className="text-[#a2e435]">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollTo("services")}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("why-us")}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollTo("careers")}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Careers
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/hire-experts">
              <Button
                variant="green"
                className="rounded-[18px] font-semibold px-5 py-2 h-auto text-sm shadow-lg transition-all"
              >
                Get a Free Quote
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link href="/hire-experts">
              <Button
                variant="green"
                className="rounded-[18px] font-semibold px-4 py-2 h-auto text-xs shadow-lg transition-all"
              >
                Get Quote
              </Button>
            </Link>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-2xl hover:bg-white/10 h-10 w-10 border border-white/20"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(280px,calc(100vw-2rem))] sm:w-80 px-0 bg-black/95 border-gray-800/50 max-w-sm"
              >
                <SheetHeader className="px-6 pb-4 border-b border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#a2e435] to-[#5fd10d] flex items-center justify-center">
                          <span className="text-black font-black text-xs">
                            F
                          </span>
                        </div>
                        <span className="text-white font-bold text-base tracking-tight">
                          Fullstack<span className="text-[#a2e435]">.</span>
                        </span>
                      </div>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex flex-col h-full bg-black/95">
                  <nav className="flex-1 px-6 py-6">
                    <div className="space-y-4">
                      <button
                        className="block w-full text-left text-white/90 text-base font-medium hover:text-white transition-colors py-3 border-b border-gray-800/30"
                        onClick={() => {
                          handleMobileLinkClick();
                          scrollTo("services");
                        }}
                      >
                        Services
                      </button>
                      <button
                        className="block w-full text-left text-white/90 text-base font-medium hover:text-white transition-colors py-3 border-b border-gray-800/30"
                        onClick={() => {
                          handleMobileLinkClick();
                          scrollTo("how-it-works");
                        }}
                      >
                        How It Works
                      </button>
                      <button
                        className="block w-full text-left text-white/90 text-base font-medium hover:text-white transition-colors py-3 border-b border-gray-800/30"
                        onClick={() => {
                          handleMobileLinkClick();
                          scrollTo("why-us");
                        }}
                      >
                        Why Us
                      </button>
                      <button
                        className="block w-full text-left text-white/90 text-base font-medium hover:text-white transition-colors py-3 border-b border-gray-800/30"
                        onClick={() => {
                          handleMobileLinkClick();
                          scrollTo("careers");
                        }}
                      >
                        Careers
                      </button>
                      <button
                        className="block w-full text-left text-white/90 text-base font-medium hover:text-white transition-colors py-3 border-b border-gray-800/30"
                        onClick={() => {
                          handleMobileLinkClick();
                          scrollTo("faq");
                        }}
                      >
                        FAQ
                      </button>

                      <div className="space-y-3 pt-4">
                        <Link
                          href="/hire-experts"
                          onClick={handleMobileLinkClick}
                        >
                          <Button
                            variant="green"
                            className="w-full rounded-[18px] font-semibold h-12 text-base shadow-lg transition-all"
                          >
                            Get a Free Quote
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
