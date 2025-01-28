import { Route, Routes, Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { Suspense } from "react";
import './MyMusic/SubComponents/styles/MusicList.css'
// Dynamically imported components
const AboutUs = lazy(() => import("./Navigation/Information/AboutUs"));
const Login = lazy(() => import("./Login/Login"));
const Faq = lazy(() => import("./Navigation/Information/Faq"));
const Sidebar = lazy(() => import("./MyMusic/Sidebar"));
const SongManagerHandler = lazy(() =>
  import("./Account/SubComponents/SongManagerHandler")
);
const ProtectedRouteGuard = lazy(() => import("./ProtectedRouteGuard"));
const ContactUs = lazy(() => import("./Navigation/Information/ContactUs"));
const Header = lazy(() => import("./Navigation/Header"));
const Footer = lazy(() => import("./Navigation/Footer"));
const Account = lazy(() => import("./Account/Account"));
const TFAVerification = lazy(() => import("./Login/TFA"));
const SearchSong = lazy(() => import("./Navigation/Information/SearchSong"));
const ArtistDescription = lazy(() => import("./Artist/ArtistDescription"));
const SpotifyRedirect = lazy(() =>
  import("./Account/SubComponents/SpotifyRedirect")
);
const LandingPage = lazy(() => import("./LandingPage/LandingPage"));
const MusicPlayer = lazy(() => import("./MusicPlayer/MusicPlayer"));

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

      <Routes>
        {userUUID !== null && (
          <Route path={"/account/:currentUserUUID"} element={<Account />} />
        )}
        {userUUID !== null && (
          <Route path={"/callback"} element={<SpotifyRedirect />} />
        )}
        <Route
          path="/"
          element={
            <Suspense fallback={<div style={{ height: "100vh" }} />}>
              <LandingPage userUUID={userUUID} />
            </Suspense>
          }
        />
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

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>

      <Footer userUUID={userUUID} />
    </div>
  );
}
