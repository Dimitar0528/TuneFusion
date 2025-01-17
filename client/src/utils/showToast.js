import { toast } from "react-toastify";

export default function showToast(message, message_type, autoClose = 2000, triggerRefresh = false, triggerFullReload = false) {
    toast(message, {
        type: message_type,
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
            triggerFullReload ? location.href = location.origin : location.reload();
        }, autoClose + 500);
    }
}