
import './App.css'
import {HospitalHome,UserHomepage,UserSignup,UserSignin,PatientTransferRecords,Staffinfo,TransferPatient,UpdateBedStatus,UpdateHospitalProfile,DoctorAvailability,SigninAs,HospitalSignin,HospitalSignup,AmbulanceSignin,AmbulanceSignup,AmbulanceHomepage, HospitalChat, Chat} from "./Pages/PageIndex"
import {Navbar} from "./Components/CompIndex"
import {Routes,Route,BrowserRouter} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";

function App() {
  
  

  return (
    <>
    <BrowserRouter>

    <Routes>
      <Route path='*' element={<Navigate  to="/"/>}/>
      <Route path='/'element ={<><Navbar/><UserHomepage/></>}/>
      <Route path="/hospital-homepage" element ={<><Navbar/><HospitalHome/></>}/>
      <Route path='/signing-as' element={<SigninAs/>}/>
      <Route path='/user-signup' element={<UserSignup/>}/>
      <Route path='/user-signin' element={<UserSignin/>}/>
      <Route path='/hospital-signup' element={<HospitalSignup/>}/>
      <Route path='/hospital-signin' element={<HospitalSignin/>}/>
      <Route path='/hospital-chat' element={<><HospitalChat/></>}/>
     < Route path='/ambulance-signup'  element={<><AmbulanceHomepage/></>} />
      <Route path='/ambulance-signup' element={<AmbulanceSignup/>}/> 
      <Route path='/ambulance-signin' element={<AmbulanceSignin/>}/>
      <Route path='/doctor-availability' element={<><Navbar/><DoctorAvailability/></>}/>
      <Route path='/patient-transfer-records' element={<><Navbar/><PatientTransferRecords/></>}/>
      <Route path='/staff-info' element={<><Navbar/><Staffinfo/></>}/>
      <Route path='/transfer-patient' element={<><Navbar/><TransferPatient/></>}/>
      <Route path='/update-bed-status' element={<><Navbar/><UpdateBedStatus/></>}/>
      <Route path='/update-hospital-profile'element={<><Navbar/><UpdateHospitalProfile/></>}/>

      <Route  path='chat' element={<><Chat></Chat></>} />
    
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
      
    </>
  )
}

export default App
