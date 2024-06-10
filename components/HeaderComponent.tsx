import React from "react";
import { MusicButton } from "./MusicButton";
import Menu from "./Menu";

const HeaderComponent = () => {
  return (
    <div className="flex justify-between m-2 h-1/6">
      <MusicButton></MusicButton>
      <Menu />
    </div>
  );
};

export default HeaderComponent;
