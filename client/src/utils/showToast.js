import { toast } from "react-toastify";

export default function showToast(message, type, autoClose = 2000, triggerRefresh = false) {
    toast(message, {
        type: type,
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        pauseOnFocusLoss: false,

    });
    if (triggerRefresh) {
        setTimeout(() => {
            location.reload();
        }, autoClose + 500);
    }
}