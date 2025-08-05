import { useParams } from "react-router-dom";
import { useFetchFromAPI, useFindAndGotoThread } from "../../hooks";
// import styles from "./User.module.css";

function User() {
  const { userId } = useParams();
  const {
    data,
    isLoading: userIsLoading,
    error: userError,
  } = useFetchFromAPI(`/user/${userId}`);
  const { user } = data || {};

  const {
    findAndGotoThread,
    isLoading: findIsLoading,
    error: findError,
  } = useFindAndGotoThread();

  return (
    <>
      {userIsLoading && <p>Loading...</p>}
      {userError && <p>{userError}</p>}
      {data && (
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
                  <img
                    src={user.profile.pictureURL}
                    style={{ width: "100px", height: "100px" }}
                  />
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
          <div>
            <button
              onClick={() => findAndGotoThread(user.id)}
              disabled={findIsLoading}
            >
              Message
            </button>
            {findError && <span>{findError}</span>}
          </div>
        </>
      )}
    </>
  );
}

export default User;
