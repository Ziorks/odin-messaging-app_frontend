import { Link } from "react-router-dom";
// import styles from "./Conversations.module.css";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";
import { useSearch } from "../../hooks";

function Conversations() {
  //TODO: do something with isLoading and error (update page nav after response)

  const {
    search,
    page,
    resultsPerPage,
    results,
    isLoading,
    error,
    queryHandlers,
  } = useSearch("/thread");

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
        search={search}
        handleSearchChange={queryHandlers.handleSearchChange}
      />
      {results && (
        <>
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
            page={page}
            resultsPerPage={resultsPerPage}
            queryHandlers={queryHandlers}
          />
        </>
      )}
    </>
  );
}

export default Conversations;
