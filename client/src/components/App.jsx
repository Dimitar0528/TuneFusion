import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "./landingPage/LandingPage";
import AboutUs from "./navigation/Information/AboutUs";
import SignInSignUp from "./login/SignUp";
import Faq from "./navigation/Information/Faq";
import MyMusic from "./myMusic/MyMusic";
import SongManagerHandler from "./SongManagerHandler";
import ProtectedRouteHandler from "./ProtectedRouteHandler";
import ContactUs from "./navigation/Information/ContactUs";
import Header from "./navigation/Header";
import Footer from "./navigation/Footer";
import Account from "./account/Account";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import TFAVerification from "./login/TFA";
import ScrollToTopButton from "./ScrollToTopButton";
import MusicPlayer from "./musicPlayer/MusicPlayer";
import SearchSong from "./navigation/Information/SearchSong";
export default function App() {
  const { musicListRef, songs, user, setFilteredSongs, filteredSongs } =
    useMusicPlayer();
  const { userUUID, role } = user;

  const showList = () => {
    musicListRef.current.style.opacity = "1";
    musicListRef.current.style.pointerEvents = "auto";
  };
  return (
    <div className="App">
      <ToastContainer />
      <Header
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

        <Route path={"/musicplayer/:userUUID"} element={<MyMusic />} />

        <Route path="/information">
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="faq" element={<Faq />} />
        </Route>
        <Route path="/search" element={<SearchSong />} />
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
            <ProtectedRouteHandler role={role}>
              <SongManagerHandler action={"updatesong"} />
            </ProtectedRouteHandler>
          }
        />
        <Route
          path="/addsong/newsong"
          element={
            <ProtectedRouteHandler role={role}>
              <SongManagerHandler action={"addsong"} name={"newsong"} />
            </ProtectedRouteHandler>
          }
        />

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>

      <Footer userUUID={userUUID} />
    </div>
  );
}
