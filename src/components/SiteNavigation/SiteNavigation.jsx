import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./SiteNavigation.module.css";

function SiteNavigation({ user }) {
  //TODO: show the users profile picture and username
  //TODO: if user===null show placeholder OR don't render this until the user has loaded (less desirable)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

        if (err.response) {
          setError(err.response.data.error);
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {user && (
        <nav>
          <Link to={"/"}>Home</Link> <Link to={"/users"}>Users</Link>{" "}
          <Link to={"/conversations"}>Conversations</Link>{" "}
          <span>Welcome back, {user.username}</span>{" "}
          <Link to={"/my-profile"}>My Profile</Link>{" "}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </>
  );
}

export default SiteNavigation;
