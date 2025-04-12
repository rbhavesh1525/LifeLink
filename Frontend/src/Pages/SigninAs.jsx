import { Link } from "react-router-dom";
import { FaUser, FaHospital, FaAmbulance } from "react-icons/fa";

function SigninAs () {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-96">
        <h2 className="text-2xl font-semibold mb-6">Welcome to LifeLink</h2>
        <div className="space-y-4">
          <Link
            to="/user-signin"
            className="flex items-center justify-center gap-3 w-full p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <FaUser className="text-gray-600" />
            Login as User
          </Link>

          <Link
            to="/hospital-signin"
            className="flex items-center justify-center gap-3 w-full p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <FaHospital className="text-gray-600" />
            Login as Hospital
          </Link>

          <Link
            to="/ambulance-signin"
            className="flex items-center justify-center gap-3 w-full p-3 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <FaAmbulance className="text-gray-600" />
            Login as Ambulance Driver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninAs;
