export const getSongTimeStamp = (time) => {
    const hours = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    let sec = Math.floor(time % 60);

    if (sec < 10) sec = `0${sec}`;
    if (hours > 0) {
        return `${hours}:${min < 10 ? `0${min}` : min}:${sec}`;
    }
    return `${min}:${sec}`;
};

