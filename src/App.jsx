import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;

function App() {
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
      <Link to={"/"}>Home</Link> <Link to={"/users"}>Users</Link>{" "}
      <Link to={"/conversations"}>Conversations</Link>{" "}
      <button onClick={handleLogout}>Logout</button>
      <Outlet />
    </>
  );
}

export default App;
