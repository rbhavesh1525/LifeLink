import { useState } from "react";
import axios from "axios";

function Signup() {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    registeringAs: "",
    email: "",
    password: "",
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("", signupData);
      console.log("Signup successful:", response.data);
      alert("Signup Successful!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup Failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignupSubmit} className="space-y-4">
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
          <select
            name="registeringAs"
            value={signupData.registeringAs}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Registering as</option>
            <option value="User">User</option>
            <option value="TempoDriver">Tempo Driver</option>
          </select>
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
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
