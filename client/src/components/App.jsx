import React from "react";
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
import Account from "./Account/Account";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import TFAVerification from "./Login/TFA";
import ScrollToTopButton from "./ScrollToTopButton";
import MusicPlayer from "./Music/MusicPlayer/MusicPlayer";
export default function App() {
  const { musicListRef, songs, user } = useMusicPlayer();
  const { userUUID, role } = user;

  const showList = () => {
    musicListRef.current.style.opacity = "1";
    musicListRef.current.style.pointerEvents = "auto";
  };

  return (
    <div className="App">
      <ToastContainer />
      <Navigation
        userUUID={userUUID}
        btnText={userUUID ? "My Account" : "Sign up"}
        goToLocation={userUUID ? `/account/${userUUID}` : "/sign-in"}
      />

      {userUUID && (
        <MusicPlayer showList={showList} userUUID={userUUID} userRole={role} />
      )}
      <ScrollToTopButton />

      <Routes>
        {userUUID && (
          <Route
            path={"/account/:userUUID"}
            element={<Account songs={songs} />}
          />
        )}
        <Route path="/" element={<LandingPage userUUID={userUUID} />} />

        <Route path={"/musicplayer/:userUUID"} element={<Music />} />

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
          element={userUUID ? <Navigate to="/" replace /> : <TFAVerification />}
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

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>

      <Footer userUUID={userUUID} />
    </div>
  );
}
