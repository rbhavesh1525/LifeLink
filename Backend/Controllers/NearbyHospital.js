const Hospital = require("../Models/HospitalAuthModel");
const Doctor = require("../Models/DoctorAvailibilityModel");
const UserLocation = require("../Models/UserLocation");
const BedStatusModel = require("../Models/BedStatusModel");

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getNearbyHospitals = async (req, res) => {
  try {
    const  userId = req.params.userId;

    console.log("Received User ID:", userId);

    const userLoc = await UserLocation.findOne({ userId });
    if (!userLoc || !userLoc.location) {
      return res.status(404).json({ message: "User location not found" });
    }
    const { latitude, longitude } = userLoc.location;

    // Step 2: Get hospitals with valid lat/lng
    const hospitals = await Hospital.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    });

    let finalList = [];

    for (const hospital of hospitals) {
      // Step 3: Check if hospital has any available doctors
      const availableDoctor = await Doctor.findOne({ status: "AVAILABLE" });
      if (!availableDoctor) continue; // skip if no available doc

      // Step 4: Calculate distance
      const distance = getDistance(
        latitude,
        longitude,
        hospital.latitude,
        hospital.longitude
      );

      finalList.push({
        hospital,
        distance: parseFloat(distance.toFixed(2)), // for display
      });
    }

    // Step 5: Sort by distance
    finalList.sort((a, b) => a.distance - b.distance);

    res.status(200).json(finalList);
  } catch (err) {
    console.error("Error in getNearbyHospitals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// New function to check bed and doctor availability for a specific hospital
const checkHospitalAvailability = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    // Get hospital details
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Get bed availability
    const bedData = await BedStatusModel.findOne({ hospitalId });
    
    // Get ALL doctors associated with this hospital (not just available ones)
    const allDoctors = await Doctor.find({ hospitalId }).select('name specialization status note');
    
    // Count doctors by status
    const availableDoctors = allDoctors.filter(doc => doc.status === "AVAILABLE");
    const busyDoctors = allDoctors.filter(doc => doc.status === "BUSY");
    const unavailableDoctors = allDoctors.filter(doc => doc.status === "UNAVAILABLE");
    
    // Count doctors by specialization
    const specializationCounts = {};
    allDoctors.forEach(doctor => {
      const specialization = doctor.specialization || "Unspecified";
      if (!specializationCounts[specialization]) {
        specializationCounts[specialization] = {
          total: 0,
          available: 0
        };
      }
      
      specializationCounts[specialization].total += 1;
      if (doctor.status === "AVAILABLE") {
        specializationCounts[specialization].available += 1;
      }
    });
    
    // Convert specialization counts to array for easier frontend processing
    const specializations = Object.keys(specializationCounts).map(key => ({
      name: key,
      total: specializationCounts[key].total,
      available: specializationCounts[key].available
    })).sort((a, b) => b.available - a.available); // Sort by available count

    // Calculate total bed counts by category
    const generalBedsTotal = 
      (bedData?.GeneralWardMale?.total || 0) + 
      (bedData?.GeneralWardFemale?.total || 0);
    
    const generalBedsAvailable = 
      (bedData?.GeneralWardMale?.available || 0) + 
      (bedData?.GeneralWardFemale?.available || 0);
    
    const privateBedsTotal = 
      (bedData?.SemiPrivateBeds?.total || 0) + 
      (bedData?.PrivateBeds?.total || 0);
    
    const privateBedsAvailable = 
      (bedData?.SemiPrivateBeds?.available || 0) + 
      (bedData?.PrivateBeds?.available || 0);
    
    const criticalCareBedsTotal = 
      (bedData?.ICUBeds?.total || 0) + 
      (bedData?.CCUBeds?.total || 0) + 
      (bedData?.HDUBeds?.total || 0);
    
    const criticalCareBedsAvailable = 
      (bedData?.ICUBeds?.available || 0) + 
      (bedData?.CCUBeds?.available || 0) + 
      (bedData?.HDUBeds?.available || 0);
    
    const pediatricBedsTotal = 
      (bedData?.NICUBeds?.total || 0) + 
      (bedData?.PICUBeds?.total || 0);
    
    const pediatricBedsAvailable = 
      (bedData?.NICUBeds?.available || 0) + 
      (bedData?.PICUBeds?.available || 0);

    // Compile response with all bed types
    const availabilityData = {
      hospital: {
        name: hospital.hospitalName,
        address: hospital.address,
        phone: hospital.phone
      },
      beds: {
        // Original categories for backward compatibility
        generalBeds: { 
          total: generalBedsTotal, 
          available: generalBedsAvailable 
        },
        icuBeds: { 
          total: bedData?.ICUBeds?.total || 0, 
          available: bedData?.ICUBeds?.available || 0 
        },
        emergencyBeds: { 
          total: bedData?.HDUBeds?.total || 0, 
          available: bedData?.HDUBeds?.available || 0 
        },
        // Detailed bed categorization
        detailedBeds: {
          general: {
            male: bedData?.GeneralWardMale || { total: 0, available: 0 },
            female: bedData?.GeneralWardFemale || { total: 0, available: 0 },
            total: { 
              total: generalBedsTotal, 
              available: generalBedsAvailable 
            }
          },
          private: {
            semi: bedData?.SemiPrivateBeds || { total: 0, available: 0 },
            full: bedData?.PrivateBeds || { total: 0, available: 0 },
            total: { 
              total: privateBedsTotal, 
              available: privateBedsAvailable 
            }
          },
          criticalCare: {
            icu: bedData?.ICUBeds || { total: 0, available: 0 },
            ccu: bedData?.CCUBeds || { total: 0, available: 0 },
            hdu: bedData?.HDUBeds || { total: 0, available: 0 },
            total: { 
              total: criticalCareBedsTotal, 
              available: criticalCareBedsAvailable 
            }
          },
          pediatric: {
            nicu: bedData?.NICUBeds || { total: 0, available: 0 },
            picu: bedData?.PICUBeds || { total: 0, available: 0 },
            total: { 
              total: pediatricBedsTotal, 
              available: pediatricBedsAvailable 
            }
          }
        }
      },
      doctors: {
        summary: {
          total: allDoctors.length,
          available: availableDoctors.length,
          busy: busyDoctors.length,
          unavailable: unavailableDoctors.length
        },
        specializations: specializations,
        details: {
          available: availableDoctors,
          busy: busyDoctors,
          unavailable: unavailableDoctors
        }
      }
    };

    res.status(200).json(availabilityData);
  } catch (error) {
    console.error("Error checking hospital availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNearbyHospitals, checkHospitalAvailability };
