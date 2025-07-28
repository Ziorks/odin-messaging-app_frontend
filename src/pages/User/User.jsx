import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./User.module.css";

function User() {
  //TODO: do something with isLoading and error
  //TODO: default profile pic on create or get here if picture is null

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}/user/${userId}`, {
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
        if (ignore) return;
        setIsLoading(false);
      });

    return () => (ignore = true);
  }, [userId, navigate]);

  const handleMessageClick = (userId) => {
    setIsLoading(true);
    setError(null);

    const url = `${host}/thread/find-or-create`;
    const payload = { recipientIds: [userId] };
    axios
      .post(url, payload, {
        withCredentials: true,
      })
      .then((resp) => {
        navigate(`/conversations/${resp.data.thread.id}`);
      })
      .catch((err) => {
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
  };

  return (
    <>
      {user && (
        <>
          <table>
            <tbody>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Avatar</th>
                <td>
                  <img src={user.profile.picture} />
                </td>
              </tr>
              <tr>
                <th>About</th>
                <td>{user.profile.about}</td>
              </tr>
              <tr>
                <th>Account Created</th>
                <td>{user.profile.createdAt}</td>
              </tr>
              <tr>
                <th>Last Active</th>
                <td>{user.profile.lastActive}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => handleMessageClick(user.id)}>Message</button>
        </>
      )}
    </>
  );
}

export default User;
