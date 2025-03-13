import { useState } from "react";
import axios from "axios";
import { showToast } from "../Components/Toast";

function Signin() {
  const [error, setError] = useState("");
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const handleSignin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on new attempt

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", signinData);
      console.log("Signin successful:", response.data);
      
      showToast(" 🎉 Signin Successful!", "success");
      
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Redirect after successful login
      setTimeout(() => {
        window.location.href = "/home"; 
      }, 3000);
      
    } catch (error) {
      console.error("Unable to login:", error);
      
      const errorMessage = error.response?.data?.message || "Signin failed";
   
      
      showToast(`❌ ${errorMessage}`, "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninData({ ...signinData, [name]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3 text-gray-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          
          {/* {error && (
            <p className="text-red-500 text-2xl">{error}</p>
          )} */}

          <div>
            <label className="block text-gray-600">Email or Phone</label>
            <input
              type="email"
              placeholder="Enter your Email"
              name="email"
              value={signinData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={signinData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          <div className="text-right">
            <a href="/forgot-pass" className="text-blue-500 text-sm">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg hover:opacity-90"
          >
            LOGIN
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Not a member? <a href="/signup" className="text-blue-500">Signup now</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
