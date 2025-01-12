"use client";

import { PulseLoader } from "react-spinners";

export default function PageLevelLoader() {
  return (

      <PulseLoader
       color={"#000000"} 
       size={30} 
       data-testid="loader"

      />

  );
}
