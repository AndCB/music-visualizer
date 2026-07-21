import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import styles from "../styles/RangeSlider.module.css";
import { usePlaylist } from "@/contexts/PlaylistContext";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (value: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: (value: number) => void;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  step,
  onChange,
  onSeekStart,
  onSeekEnd,
  className,
}) => {
  const rangeRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const val = parseFloat(event.currentTarget.value);
    onChange(val);
    // Update --sx immediately on drag for smooth fill
    if (rangeRef.current) {
      const range = max - min;
      const ratio = (val - min) / range;
      rangeRef.current.style.setProperty(
        "--sx",
        `calc(0.5 * 1.5em + ${ratio} * (100% - 1.5em))`
      );
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    onSeekStart?.();
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      onSeekEnd?.(value);
    }
  };

  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      ref={rangeRef}
      onChange={handleOnChange}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`
      ${styles.customInput}
        slider-track:bg-gradient-to-b
       slider-track:from-white/40 
       slider-track:to-white/40
       slider-track:bg-[position:0px_50%]
       slider-track:bg-clip-border
       slider-track:bg-origin-padding
       slider-track:bg-[size:var(--sx)_100%] 
       slider-track:bg-no-repeat 
       slider-track:bg-transparent
       slider-track:border-2 
       slider-track:border-solid 
       slider-track:border-white/30
       slider-track:rounded-lg 
       slider-track:h-[.8em]
       [&::-webkit-slider-thumb]:bg-white
       [&::-ms-track]:box-border
       [&::-ms-track]:border-none
       [&::-moz-range-progress]:bg-transparent
       [&::-moz-range-track]:border-white/30
       [&::-moz-range-track]:bg-gradient-to-b
       [&::-moz-range-track]:from-white/40
       [&::-moz-range-track]:to-white/40
       [&::-moz-range-track]:bg-[position:0px_50%]
       [&::-moz-range-track]:bg-clip-border
       [&::-moz-range-track]:bg-origin-padding
       [&::-moz-range-track]:bg-[size:var(--sx)_100%] 
       [&::-moz-range-track]:bg-no-repeat 
       [&::-moz-range-thumb]:bg-white
       ${className}
       `}
      style={
        {
          "--sx": `calc(0.5 * 1.5em + ${
            (value - min) / (max - min)
          } * (100% - 1.5em))`,
        } as React.CSSProperties
      }
    />
  );
};

export default RangeSlider;

// <input
//   type="range"
//   defaultValue={value}
//   min={min}
//   max={max}
//   step={step}
//   ref={rangeRef}
//   className={`${styles.customInput} ${
//     theme != "dark" ? styles.lightmode : styles.darkmode
//   } ${className}`}
// />
