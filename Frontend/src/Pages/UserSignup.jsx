import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import {showToast} from "../Components/Toast"
import "react-toastify/dist/ReactToastify.css";


function UserSignup() { 
  const [ iserror,setIsError ] = useState("");
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    
    email: "",
    password: "",
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/user-signup", signupData);
      console.log("Signup successful:", response.data);
      showToast("🎉 Signup Successful!", "success");
      
    } catch (error) {
      console.error("❌ Error signing up:", error);
      
      const errorMessage = error.response?.data?.message || "Signup Failed. Please try again.";
      console.log(errorMessage);
      
      setIsError(errorMessage); 
      showToast(`❌ ${errorMessage}`, "error");
    }
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3 text-gray-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {iserror &&(
          <p className="text-red-500">{iserror}</p>
        )}
        <form onSubmit={handleSignupSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={signupData.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={signupData.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          
          <input
            type="email"
            placeholder="Enter your Email"
            name="email"
            value={signupData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={signupData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 mt-4"
          >
            Register
          </button>
        </form>
        <div className="flex justify-center space-x-4 mt-6">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-600 hover:bg-gray-100">
            <FaGoogle className="mr-2 text-blue-500" /> Google
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-600 hover:bg-gray-100">
            <FaFacebook className="mr-2 text-blue-600" /> Facebook
          </button>
        </div>
        <p className="text-center text-sm mt-6">
          Already have an account? <a href="/user-signin" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
