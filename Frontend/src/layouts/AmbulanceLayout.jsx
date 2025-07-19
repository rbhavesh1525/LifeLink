import {AmbulanceNavbar,Footer} from "../Components/CompIndex"
export default function AmbulanceLayout({children}){
    return(
        <>
            <AmbulanceNavbar/>
            {children}
            <Footer/>
        </>
    )
}