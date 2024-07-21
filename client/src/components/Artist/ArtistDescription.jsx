import { useParams } from "react-router-dom";

export default function ArtistDescription() {
  const { artistName } = useParams();
  return <h1>Description for the artist {artistName}</h1>;
}
