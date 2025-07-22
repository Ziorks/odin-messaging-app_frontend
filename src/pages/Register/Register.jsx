import { useState } from "react";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = { username, password, passwordConfirmation };

    axios
      .post(`${host}/register`, payload, {
        withCredentials: true,
      })
      .then((resp) => {
        console.log(resp);
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
    <form onSubmit={handleRegisterSubmit}>
      <div>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="passwordConfirmation">Confirm Password: </label>
        <input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Register;
