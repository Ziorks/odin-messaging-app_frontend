import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./Conversations.module.css";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";

function Conversations() {
  //TODO: delay only for search change (not page or resultsPerPage)
  //TODO: do something with isLoading and error (update page nav after response)

  const [query, setQuery] = useState({
    search: "",
    page: 1,
    resultsPerPage: 10,
  });
  const [results, setResults] = useState({ count: 0, threads: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const firstRender = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchResults = () => {
      if (ignore) {
        return;
      }
      setIsLoading(true);
      setError(null);

      const { search, page, resultsPerPage } = query;
      const url = `${host}/thread/?search=${search}&page=${page}&resultsPerPage=${resultsPerPage}`;

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

  const formatParticipants = (participants) => {
    const names = participants.map((participant) => participant.username);
    if (names.length === 1) {
      return names[0];
    }

    names.sort((a, b) => a.localeCompare(b));
    const end = names.splice(-2, 2);
    names.push(end.join(" & "));
    return names.join(", ");
  };

  return (
    <>
      <h1>Conversations</h1>
      <SearchFrom
        search={query.search}
        handleSearchChange={handleSearchChange}
      />
      <p>{results.count} Results</p>
      <ol>
        {results.threads.map((thread) => (
          <li key={thread.id}>
            <Link to={`/conversations/${thread.id}`}>
              {formatParticipants(thread.participants)}{" "}
              {thread.messages[0].body} {thread.messages[0].createdAt}
            </Link>
          </li>
        ))}
      </ol>
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

export default Conversations;
