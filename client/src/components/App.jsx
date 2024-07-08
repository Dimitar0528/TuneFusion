import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "./LandingPage/LandingPage";
import AboutUs from "./Navigation/Information/AboutUs";
import SignInSignUp from "./Login/SignUp";
import Faq from "./Navigation/Information/Faq";
import Music from "./Music/Music";
import SongForm from "./SongForm";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ContactUs from "./Navigation/Information/ContactUs";
import Navigation from "./Navigation/Navigation";
import Footer from "./Navigation/Footer";
import NotFound from "./NotFound";
import Account from "./Account/Account";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import TFAVerification from "./Login/TFA";
import ScrollToTopButton from "./ScrollToTopButton";

export default function App() {
  const [userUUID, setUserUUID] = useState("");
  const [role, setRole] = useState("");
  const { setSongs, setMusicIndex, songs } = useMusicPlayer();

  useEffect(() => {
    async function getUserToken() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/getToken",
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
        setMusicIndex(JSON.parse(localStorage.getItem("songIndex")) || 0);
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

        <ScrollToTopButton />

        <Routes>
          <Route path="/" element={<LandingPage userUUID={userUUID} />} />

          <Route
            path={`/musicplayer/${userUUID}`}
            element={
              userUUID ? (
                <Music userUUID={userUUID} userRole={role} />
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
          <Route
            path="/otp"
            element={
              userUUID ? <Navigate to="/" replace /> : <TFAVerification />
            }
          />
          <Route
            path={`/updatesong/:name`}
            element={
              <ProtectedRoute role={role}>
                <SongForm action={"updatesong"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addsong/newsong"
            element={
              <ProtectedRoute role={role}>
                <SongForm action={"addsong"} name={"newsong"} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path={`/account/${userUUID}`}
            element={<Account userUUID={userUUID} songs={songs} />}
          />
        </Routes>

        <Footer userUUID={userUUID} />
      </header>
    </div>
  );
}
