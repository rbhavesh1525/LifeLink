
import './App.css'
import {HospitalHome,UserHomepage,UserSignup,UserSignin,PatientTransferRecords,Staffinfo,TransferPatient,UpdateBedStatus,UpdateHospitalProfile,DoctorAvailability,SigninAs,HospitalSignin,HospitalSignup,AmbulanceSignin,AmbulanceSignup} from "./Pages/PageIndex"
import {Navbar} from "./Components/CompIndex"
import {Routes,Route,BrowserRouter} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Footer from './Components/Footer';
function App() {
  

  return (
    <>
    <BrowserRouter>

    <Routes>

      <Route path='/' element={<SigninAs/>}/>
      <Route path='/user-homepage'element ={<><Navbar/><UserHomepage/><Footer/></>}/>
      <Route path="/hospital-homepage" element ={<><Navbar/><HospitalHome/><Footer/></>}/>
      <Route path='/user-signup' element={<UserSignup/>}/>
      <Route path='/user-signin' element={<UserSignin/>}/>
      <Route path='/hospital-signup' element={<HospitalSignup/>}/>
      <Route path='/hospital-signin' element={<HospitalSignin/>}/>
      <Route path='/ambulance-signup' element={<AmbulanceSignup/>}/> 
      <Route path='/ambulance-signin' element={<AmbulanceSignin/>}/>
      <Route path='/doctor-availability' element={<><Navbar/><DoctorAvailability/><Footer/></>}/>
      <Route path='/patient-transfer-records' element={<><Navbar/><PatientTransferRecords/><Footer/></>}/>
      <Route path='/staff-info' element={<><Navbar/><Staffinfo/><Footer/></>}/>
      <Route path='/transfer-patient' element={<><Navbar/><TransferPatient/><Footer/></>}/>
      <Route path='/update-bed-status' element={<><Navbar/><UpdateBedStatus/><Footer/></>}/>
      <Route path='/update-hospital-profile' element={<><Navbar/><UpdateHospitalProfile/><Footer/></>}/>
    
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
      
    </>
  )
}

export default App
