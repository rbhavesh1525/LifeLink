
import './App.css'
import {Home,Signup,Signin,PatientTransferRecords,Staffinfo,TransferPatient,UpdateBedStatus,UpdateHospitalProfile,DoctorAvailability} from "./Pages/PageIndex"
import {Navbar} from "./Components/CompIndex"
import {Routes,Route,BrowserRouter} from "react-router-dom"
import { ToastContainer } from "react-toastify";
function App() {
  

  return (
    <>
    <BrowserRouter>

    <Routes>

      <Route path='/'element ={<><Navbar/><Home/></>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/doctor-availability' element={<><Navbar/><DoctorAvailability/></>}/>
      <Route path='/patient-transfer-records' element={<><Navbar/><PatientTransferRecords/></>}/>
      <Route path='/staff-info' element={<><Navbar/><Staffinfo/></>}/>
      <Route path='/transfer-patient' element={<><Navbar/><TransferPatient/></>}/>
      <Route path='/update-bed-status' element={<><Navbar/><UpdateBedStatus/></>}/>
      <Route path='/update-hospital-profile' element={<><Navbar/><UpdateHospitalProfile/></>}/>
    
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
      
    </>
  )
}

export default App
