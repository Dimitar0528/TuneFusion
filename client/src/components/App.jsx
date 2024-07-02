import LandingPage from "./LandingPage/LandingPage";
import AboutUs from "./Navigation/Information/AboutUs";
import { Route, Routes, Navigate } from "react-router-dom";
import Faq from "./Navigation/Information/Faq";
import Music from "./Music/Music";
import { useEffect, useState } from "react";
import SongForm from "./SongForm";
import ContactUs from "./Navigation/Information/ContactUs";
import Navigation from "./Navigation/Navigation";
import Footer from "./Navigation/Footer";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [musicIndex, setMusicIndex] = useState(
    () => JSON.parse(localStorage.getItem("songIndex")) || 0
  );
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <ToastContainer />
        <Navigation btnText={"Sign up"} goToLocation={"/sign-in"} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path={`/musicplayer/`}
            element={
              <Music
                setMusicIndex={setMusicIndex}
                musicIndex={musicIndex}
                musicData={songs}
              />
            }
          />
          <Route path="/information">
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="contactus" element={<ContactUs />} />
            <Route path="faq" element={<Faq />} />
          </Route>
          {songs.length > 0 && (
            <Route
              path={`/updatesong/:name`}
              element={
                  <SongForm
                    action={"updatesong"}
                    name={songs[musicIndex].name}
                  />
              }
            />
          )}
          {songs.length > 0 && (
            <Route
              path="/addsong/newsong"
              element={
                  <SongForm action={"addsong"} name={"newsong"} />
              }
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </header>
    </div>
  );
}
