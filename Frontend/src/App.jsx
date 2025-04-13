import './App.css'
import {HospitalHome,UserHomepage,UserSignup,UserSignin,PatientTransferRecords,Staffinfo,TransferPatient,UpdateBedStatus,UpdateHospitalProfile,DoctorAvailability,SigninAs,HospitalSignin,HospitalSignup,AmbulanceSignin,AmbulanceSignup,AmbulanceHomepage, HospitalChat, Chat, NearbyHospitals,NearbyAmbulances} from "./Pages/PageIndex"
import {Navbar,AmbulanceNavbar,HospitalNavbar} from "./Components/CompIndex"
import {Routes,Route,BrowserRouter} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./context/SocketContext"
import { MessageProvider } from "./context/MessageContext"

import Footer from './Components/Footer'
import { Navigate } from "react-router-dom";
import HospitalTransferRequest from './Pages/HospitalTransferRequest'
import HospitalTransferChat from './Pages/HospitalTransferChat'

function App() {
  
  return (
    <>
    <BrowserRouter>
    <SocketProvider>
    <MessageProvider>
    <Routes>

      <Route path='*' element={<Navigate  to="/"/>}/>
      <Route path='/'element ={<><Navbar/><UserHomepage/><Footer/></>}/>
      <Route path="/hospital-homepage" element ={<><HospitalNavbar/><HospitalHome/><Footer/></>}/>
      <Route path='/signing-as' element={<SigninAs/>}/>

      <Route path='/user-signup' element={<UserSignup/>}/>
      <Route path='/user-signin' element={<UserSignin/>}/>
      <Route path='/hospital-signup' element={<HospitalSignup/>}/>
      <Route path='/hospital-signin' element={<HospitalSignin/>}/>
      <Route path='/hospital-chat' element={<><HospitalChat/></>}/>
     < Route path='/ambulance-homepage'  element={<><AmbulanceNavbar/><AmbulanceHomepage/></>} />
      <Route path='/ambulance-signup' element={<AmbulanceSignup/>}/> 
      <Route path='/ambulance-signin' element={<AmbulanceSignin/>}/>

      <Route path='/doctor-availability' element={<><Navbar/><DoctorAvailability/></>}/>
      <Route path='/patient-transfer-records' element={<><Navbar/><PatientTransferRecords/></>}/>
      <Route path='/staff-info' element={<><Navbar/><Staffinfo/></>}/>
      <Route path='/transfer-patient' element={<><Navbar/><TransferPatient/></>}/>
      <Route path='/update-bed-status' element={<><Navbar/><UpdateBedStatus/></>}/>
      <Route path='/update-hospital-profile'element={<><Navbar/><UpdateHospitalProfile/></>}/>

      <Route  path='/nearby-hospitals' element={<> <Navbar/> <NearbyHospitals/> <Footer/>    </>} />
      <Route  path ='/nearby-ambulance' element={<><AmbulanceNavbar/><NearbyAmbulances/></>}   />
      <Route path='/hospital-transfer-request' element={<><HospitalNavbar/><HospitalTransferRequest/><Footer/></>}/>
      <Route path='/hospital-transfer/:hospitalId' element={<><HospitalNavbar/><HospitalTransferChat/><Footer/></>}/>

      <Route  path='chat' element={<><Chat></Chat></>} />

    </Routes>
    </MessageProvider>
    </SocketProvider>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
     
      


    </>
  )
}

export default App
