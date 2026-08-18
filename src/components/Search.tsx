import { useState } from 'react';

interface SearchProps {
    onSearch: (value: string) => void;
}

function Search({ onSearch }: SearchProps) {

    const [searchText, setsearchText] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setsearchText(value);
        onSearch(value);
    };

    return (
        <>
            <span><input type="text" placeholder="Search products..." value={searchText} name="search" className="search-text" onChange={handleSearch} /></span>
    
            {/* {
            searchText ? <p>You searched {searchText}!</p> : null
            } */}
        </>
    )
}

export default Search;
