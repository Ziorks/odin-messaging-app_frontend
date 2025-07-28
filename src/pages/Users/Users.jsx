import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
import styles from "./Users.module.css";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";

//TODO: links to message/goto conversation with users (link to convo if exists, else create then link)
//TODO: delay only for search change (not page or resultsPerPage)
//TODO: do something with isLoading and error (update page nav after response)
//TODO: don't allow messaging self

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

  useEffect(() => {
    let ignore = false;

    const fetchResults = () => {
      setIsLoading(true);
      setError(null);

      const { search, page, resultsPerPage } = query;
      const url = `${host}/user/?search=${search}&page=${page}&resultsPerPage=${resultsPerPage}`;
      axios
        .get(url, {
          withCredentials: true,
        })
        .then((resp) => {
          if (ignore) return;
          setResults(resp.data.results);
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
    };

    if (firstRender.current) {
      firstRender.current = false;
      fetchResults();
    } else {
      setTimeout(fetchResults, 1000);
    }

    return () => (ignore = true);
  }, [query, navigate]);

  const handleSearchChange = (search) => {
    setQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePrev = () => {
    setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleNext = () => {
    setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleSetPage = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handleChangeResultsPerPage = (resultsPerPage) => {
    setQuery((prev) => ({
      ...prev,
      resultsPerPage,
      page: 1,
    }));
  };

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
      <h1>Users</h1>
      <SearchFrom
        search={query.search}
        handleSearchChange={handleSearchChange}
      />
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
            <button onClick={() => handleMessageClick(user.id)}>
              <IoChatbubbleOutline />
            </button>
          </li>
        ))}
      </ul>
      <PageNavigation
        resultsCount={results.count}
        page={query.page}
        resultsPerPage={query.resultsPerPage}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleSetPage={handleSetPage}
        handleChangeResultsPerPage={handleChangeResultsPerPage}
      />
    </>
  );
}

export default Users;
