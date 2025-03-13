import {toast} from "react-toastify";


export const showToast = (message,type = "success") =>{
toast[type](message,{
    position:"top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
})
}