import { useState, useEffect } from "react";
import playlistsAPI from "../../api/playlists-api";
import showToast from "../../utils/showToast";

export const validatePlaylist = (values) => {
    const errors = {};
    if (values.name.trim() === "") {
        errors.name = "Please enter a playlist name.";
    }
    return errors;
};

export function useCreatePlaylist() {
    const createPlaylistHandler = async (playlistData, triggerRefreshHandler) => {
        const result = await playlistsAPI.createPlaylist(playlistData);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return createPlaylistHandler
}

export function useAddSongToPlaylist() {
    const addSongToPlaylistHandler = async (playlistData, callback, triggerRefreshHandler) => {
        const result = await playlistsAPI.addSongToPlaylist(playlistData);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        typeof callback === 'function' && callback();
        triggerRefreshHandler();
    }
    return addSongToPlaylistHandler
}

export function useAddExternalSongToPlaylist() {
    const addExternalSongToPlaylistHandler = async (playlistData, triggerRefreshHandler, triggerRefreshSongsHandler) => {
        const result = await playlistsAPI.addExternalSongToPlaylist(playlistData);
        result.warn && showToast(`Warning: ${result.warn}`, "warning", 2500);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
        triggerRefreshSongsHandler();
    }
    return addExternalSongToPlaylistHandler
}


export const useGetUserPlaylists = (userUUID, refreshFlag) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!userUUID) return;
        const fetchPlaylists = async () => {
            const result = await playlistsAPI.getUserPlaylists(userUUID);
            if (result.error) return showToast(`Error: ${result.error}`, "error")
            setPlaylists(result);
            setLoading(false);
        };
        fetchPlaylists();
    }, [userUUID, refreshFlag]);

    return [playlists, loading];
};

export function useEditPlaylist() {
    const editPlaylistHandler = async (playlistName, playlistData, triggerRefreshHandler) => {
        const result = await playlistsAPI.editPlaylist(playlistName, playlistData);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return editPlaylistHandler
}

export function useDeletePlaylist() {
    const deleteSongHandler = async (playlistUUID, callback, triggerRefreshHandler) => {
        const result = await playlistsAPI.deletePlaylist(playlistUUID);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        typeof callback === 'function' && callback();
        triggerRefreshHandler();
    }
    return deleteSongHandler
}

export function useRemoveSongFromPlaylist() {
    const removeSongHanlder = async (playlistData, triggerRefreshHandler) => {
        const result = await playlistsAPI.removeSongFromPlaylist(playlistData);
        result.error ? showToast(`Error: ${result.error}`, "error") : showToast(result.message, 'success');
        triggerRefreshHandler();
    }
    return removeSongHanlder
}