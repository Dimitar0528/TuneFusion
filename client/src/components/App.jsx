import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "./LandingPage/LandingPage";
import AboutUs from "./Navigation/Information/AboutUs";
import Login from "./Login/Login";
import Faq from "./Navigation/Information/Faq";
import Sidebar from "./MyMusic/Sidebar";
import SongManagerHandler from "./Account/SubComponents/SongManagerHandler";
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
import SpotifyRedirect from "./Account/SubComponents/SpotifyRedirect";
export default function App() {
  const { user } = useMusicPlayer();
  const { userUUID, role } = user;

  return (
    <div className="App">
      <ToastContainer />
      <Header
        userUUID={userUUID}
        btnText={userUUID ? "My Account" : "Sign up"}
        goToLocation={
          userUUID ? `/account/${userUUID}?tab=Account` : "/sign-in"
        }
      />

      {userUUID && <MusicPlayer userUUID={userUUID} userRole={role} />}
      <ScrollToTopButton />

      <Routes>
        {userUUID !== null && (
          <Route path={"/account/:currentUserUUID"} element={<Account />} />
        )}
        {userUUID !== null && (
          <Route path={"/callback"} element={<SpotifyRedirect />} />
        )}
        <Route path="/" element={<LandingPage userUUID={userUUID} />} />
        <Route
          path={"/musicplayer/:currentUserUUID"}
          element={
            userUUID !== null ? <Sidebar /> : <Navigate to="/sign-in" replace />
          }
        />

        <Route path="/information">
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="faq" element={<Faq />} />
        </Route>
        <Route path="/search" element={<SearchSong />} />
        <Route
          path="/artist/:artistName/description"
          element={<ArtistDescription />}
        />

        <Route
          element={
            <ProtectedRouteGuard user={user} isNotAdminRouteFlag={true} />
          }>
          <Route path="/sign-in">
            <Route path="" element={<Login />} />
            <Route path="otp" element={<TFAVerification />} />
          </Route>
        </Route>

        <Route element={<ProtectedRouteGuard user={user} />}>
          <Route
            path={`/updatesong/:name`}
            element={<SongManagerHandler action={"updatesong"} />}
          />
          <Route
            path="/addsong"
            element={<SongManagerHandler action={"addsong"} />}
          />
        </Route>

        {/* <Route path="*" element={<Navigate to={"/"} />} /> */}
      </Routes>

      <Footer userUUID={userUUID} />
    </div>
  );
}
