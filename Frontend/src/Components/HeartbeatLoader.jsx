import React from 'react';


const HeartbeatLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 p-4">
      {/* ECG Line */}
      <svg
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[200px] h-[100px]"
      >
        <polyline
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
          points="0,50 20,50 30,30 40,70 50,50 60,50 200,50"
          className="ecg-pulse"
        />
      </svg>

      {/* Loading Text */}
      <div className="flex space-x-1 text-[16px] font-medium">
        {['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((char, index) => (
          <span
            key={index}
            className="loading-char"
            style={{
              animationDelay: `${0.2 * index}s`,
              color: '#00f0ff',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes ecgPulseOnce {
          0% {
            stroke-dashoffset: 600;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          40% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          85% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 600;
          }
        }

        @keyframes loadingChar {
          0% { opacity: 0 }
          20% { opacity: 1 }
          80% { opacity: 1 }
          100% { opacity: 0 }
        }

        .ecg-pulse {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: ecgPulseOnce 2.5s ease-in-out infinite;
        }

        .loading-char {
          opacity: 0;
          animation: loadingChar 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeartbeatLoader;
