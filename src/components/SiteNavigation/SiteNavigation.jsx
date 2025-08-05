import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../contexts";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./SiteNavigation.module.css";

function SiteNavigation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}/logout`, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.error || "Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <nav>
      <Link to={"/"}>Home</Link>{" "}
      <span>
        Welcome back, {user.username}{" "}
        <img
          src={user.profile.pictureURL}
          style={{ width: "25px", height: "25px" }}
        />
      </span>{" "}
      <Link to={"/users"}>Users</Link>{" "}
      <Link to={"/conversations"}>Conversations</Link>{" "}
      <Link to={"/my-profile"}>Edit Profile</Link>{" "}
      <button onClick={handleLogout} disabled={isLoading}>
        Logout
      </button>
      {isLoading && <p>Logging out...</p>}
      {error && <p>{error}</p>}
    </nav>
  );
}

export default SiteNavigation;
