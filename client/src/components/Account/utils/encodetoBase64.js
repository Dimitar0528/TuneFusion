export const encodeToBase64 = (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    let binary = "";
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return window.btoa(binary);
};