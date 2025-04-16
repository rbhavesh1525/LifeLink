import React from "react";
import Healthimg from "../assets/Images/Health-Insurance.jpg"
const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
        {/* Left Image Section */}
        <div className="lg:w-1/2 w-full">
          <img
            src={Healthimg}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="lg:w-1/2 w-full p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Phone</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Message</label>
              <textarea
                rows="4"
                placeholder="Your Message..."
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all duration-300 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
