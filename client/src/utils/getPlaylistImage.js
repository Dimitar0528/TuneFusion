export const getPlaylistImage = (playlist) => {
    if (!playlist.img_src && playlist.Songs && playlist.Songs.length > 0) {
        playlist.img_src = playlist.Songs.at(-1).img_src;
    }
    return (
        playlist.img_src ||
        "https://cdn-icons-png.freepik.com/512/5644/5644664.png"
    );
};