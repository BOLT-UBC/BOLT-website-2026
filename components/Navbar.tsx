"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NAVIGATION } from "../lib/constants";
import { scrollToElement } from "../lib/dom";
import { useAuth } from "../lib/useAuth";

const Navbar: React.FC = () => {
  const sections = useMemo(
    () => [
      { id: "Home", label: "Home" },
      { id: "About", label: "About" },
      { id: "Partners", label: "Partners" },
      { id: "Solutions", label: "Byte Consulting" },
      { id: "Events", label: "Events" },
      { id: "Team", label: "Team" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });

  const isScrolling = useRef(false);
  const navRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<{
    [key: string]: HTMLButtonElement | null;
  }>({});

  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isHome = pathname === "/";
  const isMembershipPage = pathname.startsWith("/membership");
  const isTeamPage = pathname === "/team";
  const isEventPage = pathname.startsWith("/events/");
  const isNotHomePage = !isHome;

  /* -------------------------------------------------- */
  /* Active pill position                               */
  /* -------------------------------------------------- */

  const updateSliderPosition = (sectionName: string) => {
    const activeButton = buttonRefs.current[sectionName];
    const nav = navRef.current;

    if (!activeButton || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setSliderStyle({
      width: buttonRect.width,
      left: buttonRect.left - navRect.left,
    });
  };

  useEffect(() => {
    const update = () => {
      requestAnimationFrame(() => {
        updateSliderPosition(activeSection);
      });
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [activeSection]);

  /* -------------------------------------------------- */
  /* Detect active section while scrolling              */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (isNotHomePage) {
      if (isTeamPage) {
        setActiveSection("Team");
      } else if (isEventPage) {
        setActiveSection("Events");
      } else if (isMembershipPage) {
        setActiveSection("Members");
      }

      return;
    }

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollPosition = window.scrollY;

      let currentSection = "Home";

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);

        if (!element) return;

        const { offsetTop, offsetHeight } = element;

        if (
          scrollPosition >=
            offsetTop - NAVIGATION.SECTION_DETECTION_OFFSET &&
          scrollPosition <
            offsetTop +
              offsetHeight -
              NAVIGATION.SECTION_DETECTION_OFFSET
        ) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    sections,
    isNotHomePage,
    isTeamPage,
    isEventPage,
    isMembershipPage,
  ]);

  /* -------------------------------------------------- */
  /* Navigation                                         */
  /* -------------------------------------------------- */

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);

    // If we're not on the homepage,
    // return to the homepage first.
    if (!isHome) {
      router.push("/");

      if (sectionId !== "Home") {
        setTimeout(() => {
          scrollToElement(sectionId);
        }, 150);
      }

      return;
    }

    const success = scrollToElement(sectionId);

    if (!success) return;

    isScrolling.current = true;
    setActiveSection(sectionId);

    setTimeout(() => {
      isScrolling.current = false;
      setActiveSection(sectionId);
    }, NAVIGATION.SCROLL_ANIMATION_DURATION);
  };

  /* -------------------------------------------------- */
  /* Mobile icons                                       */
  /* -------------------------------------------------- */

  const HamburgerIcon = () => (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 3H21"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 11.5H21"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 20H21"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3L20 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 3L3 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  /* -------------------------------------------------- */
  /* Auth button                                        */
  /* -------------------------------------------------- */

  const AuthButton = ({ mobile = false }: { mobile?: boolean }) => {
    if (loading) {
      return (
        <div
          className={`px-4 py-2 text-white/50 text-sm ${
            mobile ? "text-center" : ""
          }`}
        >
          Loading...
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          router.push(user ? "/membership" : "/login");
          setMenuOpen(false);
        }}
        className="
          relative z-10
          whitespace-nowrap
          rounded-full
          bg-transparent
          px-4 py-2
          font-roboto-mono
          text-sm
          font-semibold
          transition-all
          duration-300
          hover:opacity-80
        "
      >
        <span
          className="
            bg-gradient-to-r
            from-purple-300
            via-fuchsia-400
            to-purple-500
            bg-clip-text
            text-transparent
          "
        >
          {user ? "Members" : "Login"}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* ====================================================== */}
      {/* DESKTOP NAVBAR                                         */}
      {/* ====================================================== */}

      <nav
        className="
          fixed
          top-6
          left-1/2
          -translate-x-1/2
          z-[1000]
          hidden
          rounded-full
          border
          border-white/10
          bg-[#12091f]/65
          px-3
          py-2
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
          md:block
        "
      >
        <ul
          ref={navRef}
          className="relative flex list-none items-center gap-1 m-0 p-0"
        >
          {/* Active pill */}
          <div
            className="
              pointer-events-none
              absolute
              top-1/2
              -translate-y-1/2
              h-10
              rounded-full
              border
              border-purple-300/10
              bg-purple-500/20
              shadow-[0_0_20px_rgba(168,85,247,0.12)]
              backdrop-blur-md
              transition-all
              duration-300
              ease-out
            "
            style={{
              width: sliderStyle.width,
              left: sliderStyle.left,
            }}
          />

          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                ref={(el) => {
                  buttonRefs.current[id] = el;
                }}
                onClick={() => scrollToSection(id)}
                className={`
                  relative
                  z-10
                  rounded-full
                  border-none
                  bg-transparent
                  px-4
                  py-2
                  font-roboto-mono
                  text-sm
                  whitespace-nowrap
                  cursor-pointer
                  transition-all
                  duration-300
                  ${
                    activeSection === id
                      ? "font-semibold text-white"
                      : "font-normal text-white/70"
                  }
                  hover:text-white
                `}
              >
                {label}
              </button>
            </li>
          ))}

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-white/10" />

          {/* Authentication */}
          <li>
            <AuthButton />
          </li>
        </ul>
      </nav>

      {/* ====================================================== */}
      {/* MOBILE MENU BUTTON                                     */}
      {/* ====================================================== */}

      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="
          fixed
          right-5
          top-5
          z-[1100]
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-[#12091f]/70
          shadow-lg
          backdrop-blur-xl
          transition-all
          duration-300
          hover:bg-purple-500/20
          md:hidden
        "
      >
        {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* ====================================================== */}
      {/* MOBILE MENU                                            */}
      {/* ====================================================== */}

      {menuOpen && (
        <div
          className="
            fixed
            inset-0
            z-[1050]
            flex
            h-screen
            w-screen
            items-center
            justify-center
            bg-[#08030f]/90
            backdrop-blur-xl
            md:hidden
          "
        >
          <div className="flex flex-col items-center gap-3">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`
                  rounded-full
                  px-6
                  py-3
                  font-roboto-mono
                  text-lg
                  transition-all
                  duration-300
                  ${
                    activeSection === id
                      ? "bg-purple-500/20 font-semibold text-white"
                      : "text-white/70"
                  }
                  hover:bg-purple-500/10
                  hover:text-white
                `}
              >
                {label}
              </button>
            ))}

            <div className="my-2 h-px w-24 bg-white/10" />

            <AuthButton mobile />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
