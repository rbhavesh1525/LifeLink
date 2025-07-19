import {UserNavbar,Footer} from "../Components/CompIndex"
export default function UserLayout({children}){
    return(
        <>
        <UserNavbar/>
        {children}
        <Footer/>
        </>
    );
}