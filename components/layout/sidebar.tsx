import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Icons
import {
  LayoutDashboard,
  FileUp,
  Search,
  Building2,
  FileText,
  History,
  Settings
} from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/document-upload", label: "Document Upload", icon: FileUp },
    { href: "/research-engine", label: "Research Engine", icon: Search },
    { href: "/court-finder", label: "Court Finder", icon: Building2 },
    { href: "/my-documents", label: "My Documents", icon: FileText },
    { href: "/history", label: "History", icon: History },
  ];

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="flex flex-col h-full bg-navy-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-gold-500" />
          <h1 className="text-xl font-serif font-bold">LexAI</h1>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClick}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-navy-800 text-white"
                  : "text-navy-100 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-navy-400 flex items-center justify-center text-white">
              <span className="text-sm font-semibold">JD</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-navy-300">Legal Researcher</p>
          </div>
          <div className="ml-auto">
            <button className="text-navy-300 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
