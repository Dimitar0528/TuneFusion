import LandingPage from "./LandingPage/LandingPage";
import AboutUs from "./Navigation/Information/AboutUs";
import SignInSignUp from "./Account/SignUp";
import { Route, Routes, Navigate } from "react-router-dom";
import Faq from "./Navigation/Information/Faq";
import Music from "./Music/Music";
import { useEffect, useState } from "react";
import SongForm from "./SongForm";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ContactUs from "./Navigation/Information/ContactUs";
import Navigation from "./Navigation/Navigation";
import Footer from "./Navigation/Footer";
import NotFound from "./NotFound";
import Account from "./Account/Account";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [musicIndex, setMusicIndex] = useState(
    () => JSON.parse(localStorage.getItem("songIndex")) || 0
  );
  const [songs, setSongs] = useState([]);
  const [userUUID, setUserUUID] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function getUserToken() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/getToken",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const token = await response.json();
        setUserUUID(token.id.slice(0, 6));
        setRole(token.role);
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    }
    getUserToken();

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
        <Navigation
          userUUID={userUUID}
          btnText={userUUID ? "My Account" : "Sign up"}
          goToLocation={userUUID ? `/account/${userUUID}` : "/sign-in"}
        />

        <Routes>
          <Route path="/" element={<LandingPage userUUID={userUUID} />} />
          <Route
            path={`/musicplayer/${userUUID}`}
            element={
              userUUID ? (
                <Music
                  setMusicIndex={setMusicIndex}
                  musicIndex={musicIndex}
                  musicData={songs}
                  userUUID={userUUID}
                  userRole={role}
                />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route path="/information">
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="contactus" element={<ContactUs />} />
            <Route path="faq" element={<Faq />} />
          </Route>
          <Route
            path="/sign-in"
            element={userUUID ? <Navigate to="/" replace /> : <SignInSignUp />}
          />
          {songs.length > 0 && (
            <Route
              path={`/updatesong/:name`}
              element={
                <ProtectedRoute role={role}>
                  <SongForm
                    action={"updatesong"}
                    name={songs[musicIndex].name}
                  />
                </ProtectedRoute>
              }
            />
          )}
          {songs.length > 0 && (
            <Route
              path="/addsong/newsong"
              element={
                <ProtectedRoute role={role}>
                  <SongForm action={"addsong"} name={"newsong"} />
                </ProtectedRoute>
              }
            />
          )}
          <Route
            path={`/account/${userUUID}`}
            element={<Account userUUID={userUUID} songs={songs} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer userUUID={userUUID} />
      </header>
    </div>
  );
}
