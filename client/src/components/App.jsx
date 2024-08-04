import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "./LandingPage/LandingPage";
import AboutUs from "./Navigation/Information/AboutUs";
import Login from "./Login/Login";
import Faq from "./Navigation/Information/Faq";
import MyMusic from "./MyMusic/MyMusic";
import SongManagerHandler from "./SongManagerHandler";
import ProtectedRouteGuard from "./ProtectedRouteGuard";
import ContactUs from "./Navigation/Information/ContactUs";
import Header from "./Navigation/Header";
import Footer from "./Navigation/Footer";
import Account from "./Account/Account";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import TFAVerification from "./Login/TFA";
import ScrollToTopButton from "./ScrollToTopButton";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import SearchSong from "./Navigation/Information/SearchSong";
import ArtistDescription from "./Artist/ArtistDescription";
export default function App() {
  const { user } = useMusicPlayer();
  const { userUUID, role } = user;

  return (
    <div className="App">
      <ToastContainer />
      <Header
        userUUID={userUUID}
        btnText={userUUID ? "My Account" : "Sign up"}
        goToLocation={userUUID ? `/account/${userUUID}` : "/sign-in"}
      />

      {userUUID && <MusicPlayer userUUID={userUUID} userRole={role} />}
      <ScrollToTopButton />

      <Routes>
        <Route path={"/account/:userUUID"} element={<Account />} />
        <Route path="/" element={<LandingPage userUUID={userUUID} />} />

        <Route path={"/musicplayer/:userUUID"} element={<MyMusic />} />

        <Route path="/information">
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="faq" element={<Faq />} />
        </Route>
        <Route path="/search" element={<SearchSong />} />
        <Route path="/sign-in">
          <Route
            path=""
            element={userUUID ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="otp"
            element={
              userUUID ? <Navigate to="/" replace /> : <TFAVerification />
            }
          />
        </Route>
        <Route
          path={`/updatesong/:name`}
          element={
            <ProtectedRouteGuard role={role}>
              <SongManagerHandler action={"updatesong"} />
            </ProtectedRouteGuard>
          }
        />
        <Route
          path="/addsong"
          element={
            <ProtectedRouteGuard role={role}>
              <SongManagerHandler action={"addsong"} />
            </ProtectedRouteGuard>
          }
        />
        <Route
          path="/artist/:artistName/description"
          element={<ArtistDescription />}
        />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>

      <Footer userUUID={userUUID} />
    </div>
  );
}
