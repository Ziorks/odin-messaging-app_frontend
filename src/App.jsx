import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteNavigation from "./components/SiteNavigation";
const host = import.meta.env.VITE_API_HOST;

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}/user/me`, {
        withCredentials: true,
      })
      .then((resp) => {
        if (ignore) return;
        setUser(resp.data.user);
      })
      .catch((err) => {
        if (ignore) return;
        console.log(err);

        if (err.response) {
          if (err.response.status === 401) {
            navigate("/login");
          } else {
            setError(err.response.data.error);
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => (ignore = true);
  }, [navigate]);

  return (
    <>
      <SiteNavigation user={user} />
      <Outlet />
    </>
  );
}

export default App;
