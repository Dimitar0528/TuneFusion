import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeToBase64 } from "../utils/encodetoBase64";
export default function SpotifyRedirect() {
  const navigate = useNavigate();
  const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const host = `${window.location.protocol}//${window.location.host}`;

  const REDIRECT_URI = `${host}/callback`;

  useEffect(() => {
    const exchangeCodeForTokens = async (code) => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      });

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodeToBase64(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
          )}`,
        },
        body: body,
      });

      if (!response.ok) {
        console.error("Error Response:", await response.text());
        throw new Error("Failed to exchange code for tokens");
      }

      return response.json();
    };

    const handleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        try {
          const tokens = await exchangeCodeForTokens(code);
          sessionStorage.setItem("SP_AT", tokens.access_token);
          sessionStorage.setItem("SP_RT", tokens.refresh_token);

          const decodedState = decodeURIComponent(state);
          const stateParams = new URLSearchParams(decodedState);
          const userUUID = stateParams.get("userUUID");
          const tab = stateParams.get("tab");

          navigate(`/account/${userUUID}?tab=${tab}`);
        } catch (error) {
          console.error("Error exchanging code for tokens:", error);
        }
      }
    };

    handleRedirect();
  }, [navigate]);

  return <div>Processing Spotify authentication...</div>;
}
