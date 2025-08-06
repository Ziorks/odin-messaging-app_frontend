import { useContext } from "react";
import { GlobalContext } from "../../contexts";
import { Link } from "react-router-dom";
// import styles from "./Home.module.css";

function Home() {
  const { user } = useContext(GlobalContext);

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          <Link to={"/users"}>User Search</Link>{" "}
          <Link to={"/conversations"}>My Conversations</Link>
        </>
      ) : (
        <>
          <Link to={"/login"}>Login</Link>{" "}
          <Link to={"/register"}>Register</Link>
        </>
      )}
    </>
  );
}

export default Home;
