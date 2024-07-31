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

export const generateHtmlMessage = (data : any) => {
  let htmlMessage = `
    <div style="font-family: Arial, sans-serif; color: #19857b;">
      <h3 style="border-bottom: 2px solid #19857b; padding-bottom: 5px; margin-bottom: 10px;">Model Group</h3>
      <ul style="list-style-type: none; padding: 0; margin: 0;">
  `;
  data.modelGroup.forEach((group : any) => {
    htmlMessage += `
      <li style="background-color: #f1f1f1; margin-bottom: 5px; padding: 10px; border-radius: 5px; color: #000;">
        ${group}
      </li>
    `;
  });
  htmlMessage += `
      </ul>
      <h3 style="border-bottom: 2px solid #19857b; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px;">Inspection Group</h3>
      <ul style="list-style-type: none; padding: 0; margin: 0;">
  `;

  data.inspectionGroup.forEach((group : any) => {
    htmlMessage += `
      <li style="background-color: #f1f1f1; margin-bottom: 5px; padding: 10px; border-radius: 5px; color: #000;">
        ${group}
      </li>
    `;
  });
  htmlMessage += `
      </ul>
    </div>
  `;
  return htmlMessage;
};

