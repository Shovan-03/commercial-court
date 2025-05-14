import { useState } from "react";
import { useLocation } from "wouter";
import { MobileSidebar } from "@/components/ui/mobile-sidebar";
import LanguageSelector from "@/components/ui/language-selector";
import { Bell, HelpCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Map page routes to their titles
  const pageTitles: Record<string, string> = {
    "/": "AI-Driven Research Engine",
    "/document-upload": "Document Upload",
    "/research-engine": "Research Engine",
    "/court-finder": "Court Jurisdiction Finder",
    "/my-documents": "My Documents",
    "/history": "Activity History",
  };

  const currentTitle = pageTitles[location] || title;

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <MobileSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {/* Page Title */}
        <h1 className="text-xl font-serif font-bold text-navy-900 hidden md:block">
          {currentTitle}
        </h1>
        
        {/* Mobile Logo (Mobile Only) */}
        <div className="flex items-center md:hidden">
          <Building2 className="h-5 w-5 text-gold-500" />
          <span className="ml-2 text-lg font-serif font-bold">LexAI</span>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <LanguageSelector onLanguageChange={(language) => {
            console.log(`Language changed to: ${language.name} (${language.code})`);
            // In a real app, this would trigger a global language change
            // We could store this in global state or context
          }} />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-800">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs p-0">
              2
            </Badge>
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
