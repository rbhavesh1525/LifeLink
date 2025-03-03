
import './App.css'
import {Home,Signup,Signin} from "./Pages/PageIndex"
import {Navbar} from "./Components/CompIndex"
import {Routes,Route,BrowserRouter} from "react-router-dom"
function App() {
  

  return (
    <>
    <BrowserRouter>

    <Routes>

      <Route path="/" element ={<><Navbar/><Home/></>}/>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
