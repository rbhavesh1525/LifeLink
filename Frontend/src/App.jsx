import './App.css'

import {HospitalHome,UserHomepage,UserSignup,UserSignin,PatientTransferRecords,Staffinfo,TransferPatient,UpdateBedStatus,UpdateHospitalProfile,DoctorAvailability,SigninAs,HospitalSignin,HospitalSignup,AmbulanceSignin,AmbulanceSignup,AmbulanceHomepage, Chat, NearbyHospitals,NearbyAmbulances,UserProfile,Feedback, UserFeedbacks} from "./Pages/PageIndex"



import {AmbulanceNavbar,LandingPage, Aboutus,ContactUs,UserHelp, TrustedBySection,HeartbeatLoader} from "./Components/CompIndex"

import {Routes,Route,BrowserRouter} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./context/SocketContext"
import { ChatProvider } from "./context/MessageContext"

import { Navigate } from "react-router-dom";
import UserLayout from './layouts/UserLayout';
import HospitalLayout from './layouts/HospitalLayout';
import AmbulanceLayout from './layouts/AmbulanceLayout';
// import HospitalTransferRequest from './Pages/HospitalTransferRequest'
// import HospitalTransferChat from './Pages/HospitalTransferChat'

function App() {
  
  return (
    <>
    <BrowserRouter>
    <SocketProvider>
    <ChatProvider>
    <Routes>
      {/*Public Routes*/}
      <Route path='*' element={<Navigate  to="/"/>}/>
      <Route path='/' element={<SigninAs/>}/>
      {/*User public Routes*/}
      <Route path='/user-signup' element={<UserSignup/>}/>
      <Route path='/user-signin' element={<UserSignin/>}/>
      {/*Hospital public Routes*/}
      <Route path='/hospital-signup' element={<HospitalSignup/>}/>
      <Route path='/hospital-signin' element={<HospitalSignin/>}/>
      {/*Ambulance public Routes*/}
      <Route path='/ambulance-signup' element={<AmbulanceSignup/>}/> 
      <Route path='/ambulance-signin' element={<AmbulanceSignin/>}/>


      {/*User Private Routes*/}
      <Route path='/user-homepage'element ={<UserLayout><LandingPage/><UserHomepage/><TrustedBySection/><UserFeedbacks/></UserLayout>}/>
      <Route  path='/about-us' element={<UserLayout><Aboutus/></UserLayout>}/> 
      <Route path='/contact-us' element={<UserLayout>  <ContactUs/> </UserLayout>} />
      <Route path='/user-help' element={<UserLayout> <UserHelp/></UserLayout>}/>     
      <Route path='/user-profile' element={<UserLayout><UserProfile/></UserLayout>} />
      <Route  path='/nearby-hospitals' element={<UserLayout> <NearbyHospitals/>    </UserLayout>} />
      <Route  path ='/nearby-ambulance' element={<UserLayout><NearbyAmbulances/></UserLayout>}   />



      {/*Hospital Private Routes*/}
      <Route path="/hospital-homepage" element ={<HospitalLayout><HospitalHome/></HospitalLayout>}/>
      <Route path='/patient-transfer-records' element={<HospitalLayout><PatientTransferRecords/></HospitalLayout>}/>
      <Route path='/doctor-availability' element={<HospitalLayout><DoctorAvailability/></HospitalLayout>}/>
      <Route path='/staff-info' element={<HospitalLayout><Staffinfo/></HospitalLayout>}/>
      <Route path='/transfer-patient' element={<HospitalLayout><TransferPatient/></HospitalLayout>}/>
      <Route path='/update-bed-status' element={<HospitalLayout><UpdateBedStatus/></HospitalLayout>}/>
      <Route path='/update-hospital-profile'element={<HospitalLayout><UpdateHospitalProfile/></HospitalLayout>}/>

      
      {/*Ambulance Private Routes*/}
     < Route path='/ambulance-homepage'  element={<AmbulanceLayout><AmbulanceHomepage/></AmbulanceLayout>} />

      {/* <Route path='/hospital-chat' element={<><HospitalChat/></>}/> */}



      
      {/* <Route path='/hospital-transfer-request' element={<><HospitalNavbar/><HospitalTransferRequest/><Footer/></>}/> */}
      {/* <Route path='/hospital-transfer/:hospitalId' element={<><HospitalNavbar/><HospitalTransferChat/><Footer/></>}/> */}


      <Route path='/feedback'  element={<><Feedback/></>} />
      <Route path='/loader'  element={<><HeartbeatLoader/></>}/>
      
      {/* <Route path='/user-feedbacks' element={<><UserFeedbacks/></>} /> */}

      <Route  path='chat' element={<><Chat></Chat></>} />

    </Routes>
    </ChatProvider>
    </SocketProvider>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
     
      


    </>
  )
}

export default App
