import { useParams } from "react-router-dom";
import { useFetchFromAPI, useFindAndGotoThread } from "../../hooks";
// import styles from "./User.module.css";

function User() {
  //TODO: do something with isLoading and error
  //TODO: default profile pic on create or get here if picture is null

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
          <button onClick={() => findAndGotoThread(user.id)}>Message</button>
        </>
      )}
    </>
  );
}

export default User;
