import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down (after 100px)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/buy", label: "Buy" },
    { to: "/sell", label: "Sell" },
    { to: "/service", label: "Service" },
    { to: "/parts", label: "Spare Parts" },
    { to: "/about", label: "About Us" },
  ];

  // Show nav links when authenticated; add Admin link for admin role.
  const visibleNavLinks = isAuthenticated
    ? (() => {
        const base = [...navLinks];
        if (user && user.role === "admin") {
          base.push({ to: "/admin", label: "Admin" });
        }
        return base;
      })()
    : [];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
      style={{ background: 'transparent' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center relative">
          {/* Left: Logo */}
          <div className="flex-shrink-0 z-10">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <span className="text-4xl font-bold">
                <span className="text-[#DC2626]">Bike</span>
                <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-black'}>-Lo</span>
              </span>
            </Link>
          </div>
          
          {/* Center: Navigation Links */}
          {visibleNavLinks.length > 0 && (
            <div className="flex-1 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-0">
              <NavigationMenu>
                <NavigationMenuList>
                  {visibleNavLinks.map((link) => (
                    <NavigationMenuItem key={link.to}>
                      <Link
                        to={link.to}
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-[15px] font-bold transition-colors hover:text-[#f7931e] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive(link.to)
                            ? "text-[#f7931e]"
                            : resolvedTheme === 'dark' ? "text-white" : "text-black"
                        )}
                        style={{ fontFamily: "'Noto Serif', serif" }}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
          
          {/* Right: Auth Buttons / Profile / Theme Toggle */}
          <div className="flex-shrink-0 flex items-center gap-3 ml-auto z-10">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="flex items-center">
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-[15px] font-bold h-9 px-4",
                      resolvedTheme === 'dark' ? "text-white hover:text-[#f7931e]" : "text-black hover:text-[#f7931e]"
                    )}
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="flex items-center">
                  <Button
                    className="text-[15px] font-bold h-9 px-4"
                    style={{ 
                      backgroundColor: '#f7931e',
                      fontFamily: "'Noto Serif', serif"
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/profile" className="flex items-center">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-[15px] font-bold h-9 px-4 flex items-center gap-2",
                    isActive('/profile')
                      ? "text-[#f7931e]"
                      : resolvedTheme === 'dark' ? "text-white hover:text-[#f7931e]" : "text-black hover:text-[#f7931e]"
                  )}
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  <User className="w-4 h-4" />
                  {user?.name?.split(' ')[0] || 'Profile'}
                </Button>
              </Link>
            )}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center w-9 h-9",
                resolvedTheme === 'dark' 
                  ? "bg-neutral-800 text-yellow-400 hover:bg-neutral-700" 
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              )}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

