import { useState } from "react";

interface SearchProps {
  onSearch: (value: string) => void;
}

function Search({ onSearch }: SearchProps) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search products..."
        value={searchText}
        name="search"
        className="search-text"
        aria-label="Search products"
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;
