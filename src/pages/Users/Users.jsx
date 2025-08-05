import { Link } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import styles from "./Users.module.css";
import { useFindAndGotoThread, useSearch } from "../../hooks";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";

function Users() {
  const {
    search,
    page,
    resultsPerPage,
    results,
    isLoading: searchIsLoading,
    error: searchError,
    queryHandlers,
  } = useSearch("/user");

  const { findAndGotoThread } = useFindAndGotoThread();

  return (
    <>
      <h1>Users</h1>
      <SearchFrom
        search={search}
        handleSearchChange={queryHandlers.handleSearchChange}
      />
      {searchIsLoading && <p>Searching...</p>}
      {searchError && <p>{searchError}</p>}
      {results && (
        <>
          <p>{results.count} Results</p>
          <ul>
            {results.users.map((user) => (
              <li key={user.id}>
                {new Date(user.profile.lastActive) >
                  Date.now() - 1000 * 60 * 2 && (
                  <FaCircle className={styles.online} />
                )}
                <Link to={`/users/${user.id}`}>{user.username}</Link>{" "}
                <button onClick={() => findAndGotoThread(user.id)}>
                  <IoChatbubbleOutline />
                </button>
              </li>
            ))}
          </ul>
          <PageNavigation
            resultsCount={results.count}
            page={page}
            resultsPerPage={resultsPerPage}
            isLoading={searchIsLoading}
            queryHandlers={queryHandlers}
          />
        </>
      )}
    </>
  );
}

export default Users;
