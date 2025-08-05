// import styles from "./SearchForm.module.css";

function SearchFrom({ search, handleSearchChange }) {
  return (
    <form>
      <div>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
    </form>
  );
}

export default SearchFrom;
