import {useState} from 'react';
import products from "../data/products.json";
import { Link } from "react-router-dom";

function Search() { 

    const [searchText, setsearchText] = useState("");

    let filteredProducts = products.filter((product) => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) || product.category.toLowerCase().includes(searchText.toLowerCase())
    );

    const [sortBy, setSortBy] = useState("");

    filteredProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-low") {
        return a.price - b.price;
        }

        if (sortBy === "price-high") {
        return b.price - a.price;
        }

        if (sortBy === "name") {
        return a.name.localeCompare(b.name);
        }

        return 0;
    });

    return (
        <>
            <span><input type="text" placeholder="Search products..." value={searchText} name="search" className="search-text" onChange={(e) => setsearchText(e.target.value)} /></span>
    
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
            </select>
            {/* {
            searchText ? <p>You searched {searchText}!</p> : null
            } */}
            <div className="site__searched-products">
                {filteredProducts.map((product) => (
                    <div className="product-container" key={product.id}>
                        <div className="image-container">
                            <Link to={`/category/${product.categoryId}/${product.category}/${product.name}`} >
                                <img src={product.image} className="product-img" alt={product.name} width="100" height="100" />
                            </Link>
                        </div>
                        <div className="product-details">
                            <div className="product-title">{product.name}</div>
                            <div className="product-subtitle">{product.description}</div>
                            <div className="product-unit">
                                <span className="price">₹{product.price}</span>&nbsp;/
                                <span className="product-unit">{product.unit}</span>
                            </div>
                            <div className="product-rating">{product.rating}</div>
                        </div>
                        <div className="product-add-to-cart">
                            {/* <form name="cart">                             */}
                                <button className="add-to-cart-button" value="Add to Cart" product-id={product.id}>Add to Cart</button>
                            {/* </form> */}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Search;
