import Swal from "sweetalert2";

export default function toastAlert(icons : string  ,msg : string  , timer : number ) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: icons == "success" ? "success" : "error",
        title: msg 
      });
}

