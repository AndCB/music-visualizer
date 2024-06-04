import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Menu.module.css";
import { useTheme } from "next-themes";

const Menu = () => {
  const { theme, setTheme } = useTheme();
  const [animate, setAnimate] = useState({ status: false, animation: "" });
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
        top: rect.bottom - window.scrollY,
        right: window.innerWidth - rect.right - window.scrollX,
      });
      setMenuOpen(!menuOpen);
    }
  };

  const darkModeClick = () => {
    setAnimate({ status: true, animation: styles.darkModeAnimation });
    toggleTheme();
    setTimeout(() => {
      setAnimate({ status: false, animation: "" });
    }, 200);
  };

  const infoClick = () => {
    setAnimate({ status: true, animation: styles.infoAnimation });
    setTimeout(() => {
      setAnimate({ status: false, animation: "" });
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

  return (
    <div ref={menuRef}>
      <div
        className={`${styles.menuTest} bg-light dark:bg-dark relative ${
          theme !== "dark" ? styles.menuLightMode : styles.menuDarkMode
        } flex justify-evenly items-center ${
          animate.status ? animate.animation : ""
        }`}
      >
        <button
          id="darkModeButton"
          className={styles.button}
          onClick={darkModeClick}
        />
        <button
          ref={btnRef}
          id="infoButton"
          className={styles.button}
          onClick={infoClick}
        />
      </div>
      {menuOpen && (
        <div
          className={`${styles.menu} 
            after:border-b-light dark:after:border-b-dark p-2
            ${menuOpen ? styles.active : ""} 
            w-60 bg-light dark:bg-dark border-light dark:border-dark`}
          style={{
            position: "absolute",
            top: `calc(${menuPosition.top}px + 3em)`,
            right: `calc(${menuPosition.right}px - 1em)`,
          }}
        >
          <h2 className="text-primary-light dark:text-primary-dark">
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
