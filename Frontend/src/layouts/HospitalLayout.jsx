import {HospitalNavbar,Footer} from "../Components/CompIndex"
export default function HospitalLayout({children}){
    return(
        <>
        <HospitalNavbar/>
        {children}
        <Footer/>
        </>
    );
}