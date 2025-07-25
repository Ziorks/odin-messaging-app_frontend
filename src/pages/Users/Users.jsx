import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
import styles from "./Users.module.css";

//TODO: links to message/goto conversation with users (link to convo if exists, else create then link)
//TODO: delay only for search change (not page or resultsPerPage)
//TODO: do something with isLoading and error (update page nav after response)

function Users() {
  const [query, setQuery] = useState({
    search: "",
    page: 1,
    resultsPerPage: 10,
  });
  const [results, setResults] = useState({ count: 0, users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const firstRender = useRef(true);
  const navigate = useNavigate();

  const totalPages = Math.max(
    1,
    Math.ceil(results.count / query.resultsPerPage),
  );
  const pageOffset = 1 + Math.max(0, Math.min(query.page - 6, totalPages - 10));
  const resultsPerPageOptions = [1, 10, 25, 50];

  useEffect(() => {
    let ignore = false;

    const fetchResults = () => {
      if (ignore) {
        return;
      }
      setIsLoading(true);
      setError(null);

      const { search, page, resultsPerPage } = query;
      const url = `${host}/user/?search=${search}&page=${page}&resultsPerPage=${resultsPerPage}`;
      axios
        .get(url, {
          withCredentials: true,
        })
        .then((resp) => {
          setResults(resp.data.results);
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

    if (firstRender.current) {
      firstRender.current = false;
      fetchResults();
    } else {
      setTimeout(fetchResults, 1000);
    }

    return () => (ignore = true);
  }, [query, navigate]);

  return (
    <>
      <h1>Users</h1>
      <form>
        <div>
          <label htmlFor="search">Search: </label>
          <input
            type="text"
            name="search"
            id="search"
            value={query.search}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, search: e.target.value, page: 1 }))
            }
          />
        </div>
      </form>
      <p>{results.count} Results</p>
      <ul>
        {results.users.map((user) => (
          <li key={user.id}>
            {/* TODO: remove the '?' once I delete the fake users */}
            {new Date(user.profile?.lastActive) >
              Date.now() - 1000 * 60 * 2 && (
              <FaCircle className={styles.online} />
            )}
            <Link to={`/users/${user.id}`}>{user.username}</Link>{" "}
            <button>
              <IoChatbubbleOutline />
            </button>
          </li>
        ))}
      </ul>
      <div>
        {query.page > 1 && (
          <button
            onClick={() =>
              setQuery((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Prev
          </button>
        )}
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => (
          <button
            key={i}
            style={
              i + pageOffset === query.page ? { backgroundColor: "green" } : {}
            }
            onClick={() =>
              setQuery((prev) => ({ ...prev, page: i + pageOffset }))
            }
          >
            {i + pageOffset}
          </button>
        ))}
        {query.page < totalPages && (
          <button
            onClick={() =>
              setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </button>
        )}
      </div>
      <div>
        <label htmlFor="resultsPerPage">Results Per Page</label>
        <select
          name="resultsPerPage"
          id="resultsPerPage"
          value={query.resultsPerPage}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              resultsPerPage: e.target.value,
              page: 1,
            }))
          }
        >
          {resultsPerPageOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default Users;
