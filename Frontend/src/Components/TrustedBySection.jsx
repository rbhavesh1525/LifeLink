import React from "react";
import CountUp from "react-countup";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const TrustedBySection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-100 to-white py-16 px-6 md:px-20 overflow-hidden mt-6">
      {/* Background doctor image */}
      <img
        src=""
        alt="Doctor with patient"
        className="absolute right-0 top-0 h-full object-cover opacity-30 hidden md:block"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800"
        >
          Trusted by Ambulance Services Nationwide
        </motion.h2>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          We’ve helped save thousands of lives with rapid emergency response and professional support.
        </p>

        {/* Counters */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Ambulance Partners", value: 100, suffix: "+" },
            { label: "Lives Saved", value: 150000, suffix: "+" },
           
            { label: "Satisfaction", value: 97, suffix: "%" },
            { label: "24/7 Support", value: 24, suffix: "/7" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 + i * 0.2 }}
              className="backdrop-blur-md bg-white/30 rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="text-3xl font-bold text-blue-700">
                <CountUp end={item.value} duration={2} separator="," suffix={item.suffix} />
              </div>
              <p className="mt-1 text-sm text-gray-700">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote and CTA */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center">
          <blockquote className="text-xl italic text-gray-700 max-w-xl">
            “Saving lives isn't a service. It’s a responsibility we’ve owned for years.”
          </blockquote>
          <button className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
            <PlayCircle className="w-5 h-5" />
            See how we work
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustedBySection;
