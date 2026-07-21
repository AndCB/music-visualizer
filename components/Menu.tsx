import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Menu.module.css";
import { useTheme } from "next-themes";
import { Sun, Moon, Info } from "lucide-react";

const Menu = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [themeAnimate, setThemeAnimate] = useState(false);
  const [infoAnimate, setInfoAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  }>({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    theme !== "dark" ? setTheme("dark") : setTheme("light");
  };

  const toggleMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right - 8,
      });
      setMenuOpen(!menuOpen);
    }
  };

  const darkModeClick = () => {
    setThemeAnimate(true);
    toggleTheme();
    setTimeout(() => {
      setThemeAnimate(false);
    }, 200);
  };

  const infoClick = () => {
    setInfoAnimate(true);
    setTimeout(() => {
      setInfoAnimate(false);
    }, 200);
    toggleMenu();
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  const isDark = mounted && theme === "dark";

  return (
    <div ref={menuRef}>
      <div className="flex justify-start items-center gap-2 mr-4">
        <button
          id="darkModeButton"
          onClick={darkModeClick}
          className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ${
            themeAnimate ? "scale-90" : ""
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          ref={btnRef}
          id="infoButton"
          onClick={infoClick}
          className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ${
            infoAnimate ? "scale-90" : ""
          }`}
          aria-label="Info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      {menuOpen && (
        <div
          className={`${styles.menu} p-2 rounded-2xl
            ${menuOpen ? styles.active : ""} 
            w-60 bg-white/20 backdrop-blur-sm border border-white/30`}
          style={{
            position: "fixed",
            top: `${menuPosition.top + 28}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          <h2 className="text-white/80">
            Basic music player made in NextJS with visualizations generated using web audio API.
            <br />
            <br />
            Enjoy!
          </h2>
        </div>
      )}
    </div>
  );
};

export default Menu;
