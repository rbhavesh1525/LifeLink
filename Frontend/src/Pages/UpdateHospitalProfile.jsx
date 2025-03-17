import { useState } from "react";
import axios from "axios";

function UpdateHospitalProfile() {
    const [hospitalprofiledata, setHospitalProfileData] = useState({
        hospitalName: "",
        hospitalType: "",
        hospitalDescription: "",
        hospitalAddress: "",
        hospitalPhone: "",
        hospitalEmail: "",
        hospitalWebsite: "",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setHospitalProfileData({ ...hospitalprofiledata, [name]: value });
    };

    const handleHospitalDataSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("YOUR_API_ENDPOINT", hospitalprofiledata);
            console.log(response.data);
            setHospitalProfileData({
                hospitalName: "",
                hospitalType: "",
                hospitalDescription: "",
                hospitalAddress: "",
                hospitalPhone: "",
                hospitalEmail: "",
                hospitalWebsite: "",
            });
        } catch (error) {
            console.error("Error updating hospital profile:", error);
        }
    };

    return (
        <>
            <div className="heading-container flex items-center">
                <h1>Update Hospital Profile</h1>
                <h3>You can update your hospital info here which will be shown to users</h3>
            </div>

            <div className="main-boxes-container">
                <form onSubmit={handleHospitalDataSubmit}>
                    <div className="basic-info-box">
                        <h2>Basic Hospital Information</h2>
                        
                        <label htmlFor="hospital_name">Hospital Name</label>
                        <input 
                            type="text" 
                            id="hospital_name" 
                            name="hospitalName" 
                            value={hospitalprofiledata.hospitalName} 
                            placeholder="Enter Hospital Name" 
                            onChange={handleOnChange} 
                            required 
                        />

                        <label htmlFor="hospital_type">Hospital Type</label>
                        <select 
                            name="hospitalType" 
                            value={hospitalprofiledata.hospitalType} 
                            id="hospital_type" 
                            onChange={handleOnChange}
                        >
                            <option value="">Select Hospital Type</option>
                            <option value="General Hospital">General Hospital</option>
                            <option value="Specialized Hospital">Specialized Hospital</option>
                            <option value="Children Hospital">Children Hospital</option>
                            <option value="Mental Health Hospital">Mental Health Hospital</option>
                            <option value="Psychiatric Hospital">Psychiatric Hospital</option>
                            <option value="Emergency Hospital">Emergency Hospital</option>
                            <option value="Nursing Home">Nursing Home</option>
                            <option value="Home Healthcare">Home Healthcare</option>
                            <option value="Long-term Care Hospital">Long-term Care Hospital</option>
                            <option value="Other">Other</option>
                        </select>

                        <label htmlFor="hospital_description">Hospital Description</label>
                        <textarea 
                            id="hospital_description" 
                            name="hospitalDescription" 
                            value={hospitalprofiledata.hospitalDescription} 
                            placeholder="Enter Hospital Description" 
                            rows="5" 
                            onChange={handleOnChange} 
                            required
                        ></textarea>
                    </div>

                    {/* Contact Information Section */}
                    <div className="contact-info-box">
                        <h2>Contact Information</h2>

                        <label htmlFor="hospital_address">Address</label>
                        <input 
                            type="text" 
                            id="hospital_address" 
                            name="hospitalAddress" 
                            value={hospitalprofiledata.hospitalAddress} 
                            placeholder="Enter Address" 
                            onChange={handleOnChange} 
                            required 
                        />

                        <label htmlFor="hospital_phone">Phone</label>
                        <input 
                            type="tel" 
                            id="hospital_phone" 
                            name="hospitalPhone" 
                            value={hospitalprofiledata.hospitalPhone} 
                            placeholder="Enter Phone Number" 
                            onChange={handleOnChange} 
                            required 
                        />

                        <label htmlFor="hospital_email">Email</label>
                        <input 
                            type="email" 
                            id="hospital_email" 
                            name="hospitalEmail" 
                            value={hospitalprofiledata.hospitalEmail} 
                            placeholder="Enter Email" 
                            onChange={handleOnChange} 
                            required 
                        />

                        <label htmlFor="hospital_website">Website</label>
                        <input 
                            type="url" 
                            id="hospital_website" 
                            name="hospitalWebsite" 
                            value={hospitalprofiledata.hospitalWebsite} 
                            placeholder="Enter Website URL" 
                            onChange={handleOnChange} 
                        />

                        <button type="submit">Update Profile</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UpdateHospitalProfile;
