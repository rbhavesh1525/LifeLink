import { useState, useEffect } from "react";

 function Aboutus() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300); // Delay animation for the first section
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="about-us">
      {/* Full-width Background Image with Text */}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/042/585/516/small_2x/ai-generated-medical-stethoscope-on-green-background-top-view-with-copy-space-photo.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold animate__animated animate__fadeInUp">
              LifeLink
            </h1>
            <p className="text-xl mt-4 animate__animated animate__fadeInUp animate__delay-1s">
              Your One-Stop Solution for All Your Needs
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12 animate__animated animate__fadeInUp">
            The Services We Provide
          </h2>

          {/* Service 1 */}
          <div
            className={`flex items-center mb-16 ${isVisible ? "animate__animated animate__fadeInLeft" : ""}`}
          >
            <div className="w-full lg:w-1/2">
              <img
                src="https://hospitalsnearme.co.in/wp-content/uploads/2022/11/cropped-Hospitalsnearme-logo_tag_L.png"
                alt="Service 1"
                className="w-2xl h-full object-cover rounded-lg shadow-xl transition-all duration-500 transform hover:scale-105"
              />
            </div>
            <div className="w-full lg:w-1/2 pl-8">
              <h3 className="text-2xl font-semibold mb-4">Nearby Hospitals</h3>
              <p className="text-lg text-gray-700">
              Discover nearby hospitals based on real-time doctor availability.

Get accurate information about specialists and consultation hours.

Reach the right hospital at the right time without delays.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div
            className={`flex items-center flex-row-reverse mb-16 ${isVisible ? "animate__animated animate__fadeInRight" : ""}`}
          >
            <div className="w-full lg:w-1/2">
              <img
                src="https://play-lh.googleusercontent.com/ArenLe0OXwkXw5AgiLIYxum61kzwJHfYHBW8TmrIifAn3auBIrxXpzY-Wzu77GDEe4Jp"
                alt="Service 2"
                className="w-2xl h-60  rounded-lg shadow-xl transition-all duration-500 transform hover:scale-105"
              />
            </div>
            <div className="w-full lg:w-1/2 pr-8">
              <h3 className="text-2xl font-semibold mb-4">Nearby Ambulances</h3>
              <p className="text-lg text-gray-700">
              Instantly locate ambulances available within a 5 km radius.

Directly connect with private ambulance services in your area.

Fast response times that help save lives when every second matters.
              </p>
            </div>
          </div>

         
          
        </div>
      </div>

      
    </div>
  );
}
export default Aboutus;