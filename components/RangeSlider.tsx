import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import styles from "../styles/RangeSlider.module.css";
import { usePlaylist } from "@/contexts/PlaylistContext";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  step,
  onChange,
  className,
}) => {
  const rangeRef = useRef<HTMLInputElement>(null);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    onChange(parseFloat(event.currentTarget.value));
  };

  const { currentTrackId } = usePlaylist();

  useEffect(() => {
    const rangeInput = rangeRef.current;

    const handleInput = () => {
      if (rangeInput && currentTrackId) {
        let range = max - min;
        let ratio = (parseInt(rangeInput.value) - min) / range;
        rangeInput.style.setProperty(
          "--sx",
          `calc(0.5 * 1.5em + ${ratio} * (100% - 1.5em))`
        );
      }
    };

    if (rangeInput) {
      rangeInput.addEventListener("input", handleInput);
    }

    return () => {
      if (rangeInput) {
        rangeInput.removeEventListener("input", handleInput);
      }
    };
  }, []);

  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      ref={rangeRef}
      onChange={handleOnChange}
      className={`
      ${styles.customInput}
        slider-track:bg-gradient-to-b
       slider-track:from-light 
       slider-track:to-light
       slider-track:dark:from-dark 
       slider-track:dark:to-dark
       slider-track:bg-[position:0px_50%]
       slider-track:bg-clip-border
       slider-track:bg-origin-padding
       slider-track:bg-[size:var(--sx)_100%] 
       slider-track:bg-no-repeat 
       slider-track:bg-transparent
       slider-track:border-2 
       slider-track:border-solid 
       slider-track:border-light 
       slider-track:dark:border-dark 
       slider-track:rounded-lg 
       slider-track:h-[.8em]
       [&::-webkit-slider-thumb]:bg-light
       [&::-webkit-slider-thumb]:dark:bg-dark
       [&::-ms-track]:box-border
       [&::-ms-track]:border-none
       [&::-moz-range-progress]:bg-transparent
       [&::-moz-range-track]:border-light
       [&::-moz-range-track]:dark:border-dark
       [&::-moz-range-track]:bg-gradient-to-b
       [&::-moz-range-track]:from-light
       [&::-moz-range-track]:to-light
       [&::-moz-range-track]:dark:from-dark
       [&::-moz-range-track]:dark:to-dark
       [&::-moz-range-track]:bg-[position:0px_50%]
       [&::-moz-range-track]:bg-clip-border
       [&::-moz-range-track]:bg-origin-padding
       [&::-moz-range-track]:bg-[size:var(--sx)_100%] 
       [&::-moz-range-track]:bg-no-repeat 
       [&::-moz-range-thumb]:bg-light
       [&::-moz-range-thumb]:dark:bg-dark
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
