import { toast } from "react-toastify";

export default function showToast(message, type, autoClose = 1800, triggerRefresh = false) {
    toast(message, {
        type: type,
        position: 'top-right',
        autoClose: autoClose,
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