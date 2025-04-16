import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="relative w-4/5 h-[2px] bg-green-500 overflow-hidden">
        <div className="absolute w-full h-full animate-heartbeat">
          {/* This div creates the heartbeat effect */}
          <div className="w-1 h-[2px] bg-transparent shadow-[30px_0_0_lime,40px_-20px_0_lime,50px_40px_0_lime,60px_-10px_0_lime,70px_0_0_lime]" />
        </div>
      </div>
      <p className="mt-4 text-green-400 text-lg font-mono animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
