// import styles from "./PageNavigation.module.css";

function PageNavigation({
  resultsCount,
  page,
  resultsPerPage,
  handlePrev,
  handleNext,
  handleSetPage,
  handleChangeResultsPerPage,
}) {
  const resultsPerPageOptions = [1, 10, 25, 50];
  const totalPages = Math.max(1, Math.ceil(resultsCount / resultsPerPage));
  const pageOffset = 1 + Math.max(0, Math.min(page - 6, totalPages - 10));

  return (
    <div>
      <div>
        {page > 1 && <button onClick={handlePrev}>Prev</button>}
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => (
          <button
            key={i}
            style={i + pageOffset === page ? { backgroundColor: "green" } : {}}
            onClick={() => handleSetPage(i + pageOffset)}
          >
            {i + pageOffset}
          </button>
        ))}
        {page < totalPages && <button onClick={handleNext}>Next</button>}
      </div>
      <div>
        <label htmlFor="resultsPerPage">Results Per Page</label>
        <select
          name="resultsPerPage"
          id="resultsPerPage"
          value={resultsPerPage}
          onChange={(e) => handleChangeResultsPerPage(e.target.value)}
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
