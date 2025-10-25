"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NAVIGATION } from "../lib/constants";
import { scrollToElement } from "../lib/dom";
import { useAuth } from "../lib/useAuth";
import { authService } from "../lib/auth";

const Navbar: React.FC = () => {
  const sections = useMemo(() => ["Home", "About", "Partners", "Events", "Solutions", "Team"], []);
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const isScrolling = useRef(false);
  const navRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Check if we're on the team page or event page
  const isTeamPage = pathname === '/team';
  const isEventPage = pathname.startsWith('/events/');
  const isNotHomePage = isTeamPage || isEventPage;

  // Function to update slider position
  const updateSliderPosition = (sectionName: string) => {
    const activeButton = buttonRefs.current[sectionName];
    const nav = navRef.current;

    if (activeButton && nav) {
      const navRect = nav.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setSliderStyle({
        width: buttonRect.width,
        left: buttonRect.left - navRect.left,
      });
    }
  };

  useEffect(() => {
    // Initial slider position
    updateSliderPosition(activeSection);

    // Update slider position on window resize
    const handleResize = () => {
      updateSliderPosition(activeSection);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [activeSection]);

  useEffect(() => {
    // Only set up scroll listener on home page
    if (isNotHomePage) {
      if (isTeamPage) {
        setActiveSection("Team");
      } else if (isEventPage) {
        setActiveSection("Events");
      }
      return;
    }

    const handleScroll = () => {
      if (isScrolling.current) return;
      if (typeof window === 'undefined') return;

      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        if (typeof document === 'undefined') return;
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop - NAVIGATION.SECTION_DETECTION_OFFSET &&
            scrollPosition < offsetTop + offsetHeight - NAVIGATION.SECTION_DETECTION_OFFSET
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sections, isNotHomePage, isTeamPage, isEventPage]);

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push('/')
    } catch (error) {
      // Logout failed
      void error
    }
  }

  const scrollToSection = (sectionId: string) => {
    // If we're on a non-home page and clicking any section, navigate to home first
    if (isNotHomePage) {
      if (sectionId === "Home") {
        router.push('/');
      } else {
        // Navigate to home and scroll to section after a short delay
        router.push('/');
        setTimeout(() => {
          scrollToElement(sectionId);
        }, 100);
      }
      setMenuOpen(false);
      return;
    }

    // On home page, just scroll normally
    const success = scrollToElement(sectionId);

    if (success) {
      isScrolling.current = true;
      setActiveSection(sectionId);
      setMenuOpen(false);

      setTimeout(() => {
        isScrolling.current = false;
        setActiveSection(sectionId);
      }, NAVIGATION.SCROLL_ANIMATION_DURATION);
    }
  };

  const HamburgerIcon = () => (
    <svg width="23" height="23" viewBox="0 0 23 23">
      <path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="white"
        d="M 2 2.5 L 20 2.5"
      />
      <path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="white"
        d="M 2 9.423 L 20 9.423"
      />
      <path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="white"
        d="M 2 16.346 L 20 16.346"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="23" height="23" viewBox="0 0 23 23">
      <path
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        d="M 2 2 L 21 21"
      />
      <path
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        d="M 21 2 L 2 21"
      />
    </svg>
  );
  return (
    <>
    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-lg px-4 py-2.5 rounded-full z-[1000] shadow-lg hidden md:block">
      <ul className="flex gap-4 list-none m-0 p-0 relative" ref={navRef}>
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-10 bg-black/15 rounded-full transition-all duration-300 ease-out z-[1] backdrop-blur-md"
          style={{
            width: sliderStyle.width,
            left: sliderStyle.left,
          }}
        />
        {sections.map((section) => (
          <li key={section}>
            <button
              ref={(el) => {
                buttonRefs.current[section] = el;
              }}
              onClick={() => scrollToSection(section)}
              className={`bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal relative z-[2] ${
                activeSection === section ? "font-bold text-white" : ""
              } hover:text-white/80`}
            >
              {section}
            </button>
          </li>
        ))}

        {/* Auth Buttons */}
        <li>
          {loading ? (
            <div className="px-4 py-2 text-white/60 text-sm">Loading...</div>
          ) : user ? (
            <button
              onClick={() => router.push('/membership')}
              className="bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal relative z-[2] hover:text-white/80"
            >
              Members
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal hover:text-white/80"
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-6 right-6 z-[1100] cursor-pointer bg-black/20 backdrop-blur-lg p-3 rounded-full shadow-lg" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-lg z-[1050] flex items-center justify-center">
          <div className="flex flex-col gap-8 text-center">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal ${
                  activeSection === section ? "font-bold text-white" : ""
                }`}
              >
                {section}
              </button>
            ))}

            {/* Mobile Auth */}
            {loading ? (
              <div className="text-white/60 text-sm px-4 py-2">Loading...</div>
            ) : user ? (
              <button
                onClick={() => {
                  router.push('/membership');
                  setMenuOpen(false);
                }}
                className="bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal"
              >
                Members
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push('/login');
                  setMenuOpen(false);
                }}
                className="bg-none border-none text-white font-roboto-mono text-base cursor-pointer transition-all duration-300 px-4 py-2 rounded-3xl font-normal"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
