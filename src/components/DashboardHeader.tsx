"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Building, Mic, Users, Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardHeaderProps {
  activeTab?: "dashboard" | "interview" | "profile";
}

export default function DashboardHeader({ activeTab = "dashboard" }: DashboardHeaderProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for mobile
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/sign-in");
    } catch (error: any) {
      toast.error("Error signing out");
    }
  };

  const getButtonClass = (tab: string) => {
    return activeTab === tab
      ? "rounded-2xl text-gray-900 font-medium bg-gray-100 hover:bg-gray-200"
      : "rounded-2xl text-gray-600 font-medium hover:bg-gray-100";
  };

  const getMobileButtonClass = (tab: string) => {
    return activeTab === tab
      ? "w-full justify-start rounded-2xl text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 h-12 px-4"
      : "w-full justify-start rounded-2xl text-gray-600 font-medium hover:bg-gray-100 h-12 px-4";
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-200 w-full ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Durdle Logo" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard">
                <Button variant="ghost" className={getButtonClass("dashboard")}>
                  <Building className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/interview">
                <Button variant="ghost" className={getButtonClass("interview")}>
                  <Mic className="h-4 w-4 mr-2" />
                  AI Interview
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="ghost" className={getButtonClass("profile")}>
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden relative rounded-2xl hover:bg-gray-100 h-10 w-10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(280px,calc(100vw-2rem))] sm:w-80 px-0 max-w-sm">
                <SheetHeader className="px-6 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-left">
                      <img src="/logo.png" alt="Durdle Logo" className="h-8 w-auto" />
                    </SheetTitle>
                  </div>
                </SheetHeader>

                {/* Mobile Navigation */}
                <div className="flex flex-col h-full">
                  <nav className="flex-1 px-6 py-6">
                    <div className="space-y-3">
                      <Link href="/dashboard" onClick={handleMobileLinkClick}>
                        <Button variant="ghost" className={getMobileButtonClass("dashboard")}>
                          <Building className="h-5 w-5 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/dashboard/interview" onClick={handleMobileLinkClick}>
                        <Button variant="ghost" className={getMobileButtonClass("interview")}>
                          <Mic className="h-5 w-5 mr-3" />
                          AI Interview
                        </Button>
                      </Link>
                      <Link href="/dashboard/profile" onClick={handleMobileLinkClick}>
                        <Button variant="ghost" className={getMobileButtonClass("profile")}>
                          <Users className="h-5 w-5 mr-3" />
                          Profile
                        </Button>
                      </Link>
                    </div>
                  </nav>

                  {/* Mobile User Section */}
                  <div className="border-t px-6 py-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }} className="text-black font-semibold text-lg">
                          {profile?.first_name?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.first_name} {profile?.last_name || ""}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start h-12 px-4 rounded-2xl hover:bg-gray-100">
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={signOut}
                        className="w-full justify-start h-12 px-4 rounded-2xl hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Notifications */}
            <Button variant="ghost" size="icon" className="hidden md:flex relative rounded-2xl hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Mobile Notifications */}
            <Button variant="ghost" size="icon" className="md:hidden relative rounded-2xl hover:bg-gray-100 h-10 w-10">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Desktop User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center space-x-2 px-2 rounded-3xl hover:bg-gray-100">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }} className="text-black font-semibold">
                      {profile?.first_name?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.first_name || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl" align="end">
                <div className="flex items-center space-x-2 p-3 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }} className="text-black font-semibold">
                      {profile?.first_name?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name || ""}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuItem className="rounded-xl h-10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-red-600 focus:text-red-600 rounded-xl h-10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Avatar Only */}
            <div className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback style={{ background: 'linear-gradient(135deg, #8FFF00, #6fc200)' }} className="text-black font-semibold">
                  {profile?.first_name?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}