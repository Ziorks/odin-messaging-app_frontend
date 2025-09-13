import styles from "./PageNavigation.module.css";

function PageNavigation({
  resultsCount,
  page,
  resultsPerPage,
  isLoading,
  queryHandlers,
}) {
  const resultsPerPageOptions = [1, 10, 25, 50];
  const totalPages = Math.max(1, Math.ceil(resultsCount / resultsPerPage));
  const pageOffset = 1 + Math.max(0, Math.min(page - 6, totalPages - 10));

  return (
    <div className={styles.mainContainer}>
      <div>
        <button
          onClick={queryHandlers.handlePrev}
          disabled={isLoading || page <= 1}
          className={styles.btn}
        >
          Prev
        </button>
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => (
          <button
            key={i}
            className={styles.btn}
            onClick={() => queryHandlers.handleSetPage(i + pageOffset)}
            disabled={isLoading || i + pageOffset === page}
          >
            {i + pageOffset}
          </button>
        ))}
        <button
          onClick={queryHandlers.handleNext}
          disabled={isLoading || page >= totalPages}
          className={styles.btn}
        >
          Next
        </button>
      </div>
      <div>
        <label htmlFor="resultsPerPage">Results Per Page</label>
        <select
          name="resultsPerPage"
          id="resultsPerPage"
          className={styles.btn}
          value={resultsPerPage}
          onChange={(e) =>
            queryHandlers.handleChangeResultsPerPage(e.target.value)
          }
          disabled={isLoading}
        >
          {resultsPerPageOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default PageNavigation;
