// components/IconButton.tsx
import React, { ReactNode, forwardRef, useState } from "react";
import styles from "../styles/IconButton.module.css";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, onClick, className, children }, ref) => {
    const [animate, setAnimate] = useState(false);

    const handleClick = () => {
      if (onClick) onClick();
      setAnimate(true);
      setTimeout(() => setAnimate(false), 200);
    };
    return (
      <button
        ref={ref}
        className={`icon-button ${className ?? ""} ${
          animate ? styles.animate : ""
        }`}
        onClick={handleClick}
      >
        {Icon}
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
