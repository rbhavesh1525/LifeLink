import { useState } from "react";
import axios from "axios";

function Signin() {
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("", signinData);
      console.log("Signin successful:", response.data);
      alert("Signin Successful!");
    } catch (error) {
      console.error("Unable to login", error);
      alert("Signin Failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninData({ ...signinData, [name]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your Email"
            name="email"
            value={signinData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={signinData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
