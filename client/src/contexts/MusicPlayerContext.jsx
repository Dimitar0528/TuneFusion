import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const MusicPlayerContext = createContext();
import showToast from "../showToast";
import extractUUIDPrefix from "../utils/extractUUIDPrefix";

const playlists = [
  {
    name: "Chill Vibes",
    songs: [
      {
        uuid: "2da296e0-d45c-4ce8-97f1-5d08d4e925ec",
        name: "FE!N",
        artist: "Travis Scott",
        img_src: "https://i1.sndcdn.com/artworks-xRprsAJJxbFl-0-t500x500.jpg",
        audio_src: "https://www.youtube.com/watch?v=2nR1zrNzgcY",
        duration: 192,
        createdAt: "07/07/2024",
        updatedAt: "2024-07-07T20:25:50.000Z",
      },
      {
        uuid: "59452975-6816-4992-a34b-6662444aaf1b",
        name: "MOY SI MERAK",
        artist: "SIMONA",
        img_src:
          "https://images.genius.com/cb7e9ca33d7fdd83be5b1bc30e6e4c6c.1000x1000x1.png",
        audio_src: "https://www.youtube.com/watch?v=YYCnWvsP8Gs",
        duration: 180,
        createdAt: "07/07/2024",
        updatedAt: "2024-07-07T19:48:56.000Z",
      },
    ],
  },
  {
    name: "Chalga Maika",
    songs: [
      {
        uuid: "7ab86caa-bd0c-45d3-940e-dd73b309acff",
        name: "Neshto netipichno",
        artist: "Ivana",
        img_src: "https://i.ytimg.com/vi/bfaf77Msc2E/maxresdefault.jpg",
        audio_src: "https://www.youtube.com/watch?v=X-G4tJZhbU8",
        duration: 232,
        createdAt: "2024-07-10T19:47:54.000Z",
        updatedAt: "2024-07-10T19:47:54.000Z",
      },
      {
        uuid: "8bad01c5-ee95-42d5-8a4e-915680ae6bc6",
        name: "Turbulence",
        artist: "Emilia",
        img_src: "https://i.ytimg.com/vi/5tXyXFIIoos/maxresdefault.jpg",
        audio_src: "https://www.youtube.com/watch?v=QRyw85XoDBA",
        duration: 239,
        createdAt: "2024-07-10T10:00:24.000Z",
        updatedAt: "2024-07-10T10:00:24.000Z",
      },
      {
        uuid: "972be029-9cea-4150-9792-1706b7ad868c",
        name: "Moy Si Merak",
        artist: "SIMONA",
        img_src:
          "https://i1.sndcdn.com/artworks-kp5boj5f9Q9TCE5i-BjTIOw-t500x500.jpg",
        audio_src: "https://www.youtube.com/watch?v=mVB8tkr_Tto",
        duration: 180,
        createdAt: "2024-07-14T12:12:45.000Z",
        updatedAt: "2024-07-14T12:12:45.000Z",
      },
      {
        uuid: "3d164d35-c0ad-4c06-ac2d-1728eaf22b9f",
        name: "От кеф да умирам",
        artist: "Dessita",
        img_src: "https://i.ytimg.com/vi/wTJre6t9lUk/maxresdefault.jpg",
        audio_src: "https://www.youtube.com/watch?v=ytvlTIok1Bo",
        duration: 241,
        createdAt: "2024-07-14T12:11:52.000Z",
        updatedAt: "2024-07-14T12:11:52.000Z",
      },
    ],
  },
];

export function MusicPlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activePlaylist, setActivePlaylist] = useState(() => {
    const storedActivePlaylist = JSON.parse(
      localStorage.getItem("activePlaylist")
    );
    const playlist = playlists.find(
      (pl) => pl.name === storedActivePlaylist.name
    );
    if (playlist) return { ...storedActivePlaylist, songs: playlist.songs };

    return null;
  });

  const [isCollapsed, setIsCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isCollapsed")) || false
  );
  const [currentSongUUID, setCurrentSongUUID] = useState(
    () => JSON.parse(localStorage.getItem("currentSongUUID")) || ""
  );
  const [volume, setVolume] = useState(
    () => Number(JSON.parse(localStorage.getItem("audioVolume"))) || 0.3
  );
  const [currentTime, setCurrentTime] = useState(
    () => Number(JSON.parse(localStorage.getItem("currentTime"))) || 0
  );

  const currentSong = songs.find(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const currentIndex = filteredSongs.findIndex(
    (song) => extractUUIDPrefix(song.uuid) === currentSongUUID
  );

  const progressAreaRef = useRef();
  const progressBarRef = useRef();
  const playerRef = useRef();
  const musicListRef = useRef();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();
        setSongs(data);
        if (!activePlaylist) {
          setFilteredSongs(data.slice(0, 30));
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentSongUUID", JSON.stringify(currentSongUUID));
  }, [currentSongUUID]);

  useEffect(() => {
    localStorage.setItem(
      "currentTime",
      JSON.stringify(Math.round(currentTime))
    );
  }, [Math.round(currentTime)]);

  useEffect(() => {
    localStorage.setItem(
      "activePlaylist",
      JSON.stringify({
        name: activePlaylist?.name,
        activeIndex: activePlaylist?.activeIndex,
      })
    );
    if (activePlaylist) {
      setFilteredSongs(activePlaylist.songs);
    } else {
      setFilteredSongs(songs.slice(0, 30));
    }
  }, [activePlaylist]);

  const fetchLyrics = async () => {
    if (isCollapsed)
      return showToast(
        "Can't show lyrics when the player is collapsed",
        "warning"
      );
    if (lyrics) return setLyrics("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/songs/${currentSong.artist}/${currentSong.name}`
      );
      const lyrics = await response.json();
      if (lyrics.error) return setLyrics(lyrics.error);
      setLyrics(lyrics);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (currentTime > 0) {
      playerRef.current.seekTo(currentTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * filteredSongs.length);
      } while (
        extractUUIDPrefix(filteredSongs[randomIndex].uuid) === currentSongUUID
      );
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[randomIndex].uuid));
      setIsPlaying(true);
      lyrics && setLyrics("");
    } else {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      setCurrentSongUUID(extractUUIDPrefix(filteredSongs[nextIndex].uuid));
      setIsPlaying(true);
      lyrics && setLyrics("");
    }
    setCurrentTime(0);
  };

  const toggleShufflePlayList = () => {
    setShuffle(!shuffle);
    showToast(
      `Shuffle ${!shuffle ? "enabled" : "disabled"} successfully!`,
      "success"
    );
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isCollapsed", JSON.stringify(!isCollapsed));
  };

  const handlePreviousSong = () => {
    const prevIndex =
      (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setCurrentSongUUID(extractUUIDPrefix(filteredSongs[prevIndex].uuid));
    setIsPlaying(true);
    lyrics && setLyrics("");
    setCurrentTime(0);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("audioVolume", JSON.stringify(newVolume));
  };

  const contextValue = {
    songs,
    setSongs,
    filteredSongs,
    playlists,
    setFilteredSongs,
    currentSongUUID,
    setCurrentSongUUID,
    currentSong,
    isPlaying,
    setIsPlaying,
    lyrics,
    setLyrics,
    shuffle,
    setShuffle,
    isLoading,
    setIsLoading,
    isCollapsed,
    setIsCollapsed,
    volume,
    setVolume,
    progressAreaRef,
    progressBarRef,
    playerRef,
    musicListRef,
    fetchLyrics,
    handlePlayPause,
    handleNextSong,
    toggleShufflePlayList,
    handleCollapseToggle,
    handlePreviousSong,
    handleVolumeChange,
    currentTime,
    setCurrentTime,
    activePlaylist,
    setActivePlaylist,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  return context;
}
