import { useState } from "react";
import axios from "axios";
import { showToast } from "../Components/Toast";
import useAuthStore from "../Store/authStore";

function UserSignin() {
  const [message, setMessage] = useState("");
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();

  const handleSignin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user-signin",
        signinData
      );

      console.log("Signin successful:", response.data);

      login(response.data.user, response.data.token); // Use zustand login function
      showToast(" 🎉 Signin Successful!", "success");
      setMessage("Redirecting you to homepage");

      // Redirect after successful login
      setTimeout(() => {
        window.location.href = "/";
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
        <button className="absolute top-3 right-3 text-gray-500 text-xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          {message && <p className="text-green-500 text-2xl">{message}</p>}

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
            <a
              href="/forgot-pass"
              className="text-blue-500 text-sm cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 cursor-pointer"
          >
            LOGIN
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Not a member?{" "}
          <a href="/user-signup" className="text-blue-500 cursor-pointer">
            Signup now
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserSignin;
