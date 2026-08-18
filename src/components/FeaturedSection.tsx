import products from "../data/products.json";
import {useState} from "react";

export type featureProductProps = {
    searchText?: string;
}

function FeaturedSection({ searchText = ""}: featureProductProps) {
    const [sortBy, setSortBy] = useState("");

    let featuredProducts = products.filter(product => 
        product.featuredProduct === 1
    );

    // Search Filtering
    if (searchText.trim() !== "") {
        const search = searchText.toLowerCase().trim();

        featuredProducts = featuredProducts.filter(
        (product) =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );
    }

    // Sorting
    featuredProducts = [...featuredProducts].sort((a, b) => {
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

    const noProducts = featuredProducts.length === 0  ? 1 : 0;

    return(
        <div>
            {!noProducts ? 
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
            </select> : null}
            <div className="site__featured-container">
                {featuredProducts.map((product) => (
                    <div className="product-container" key={product.id}>
                        <div className="image-container">
                            <img src={product.image} className="product-img" alt={product.name} width="100" height="100" />
                        </div>
                        <div className="product-details">
                            <div className="product-title">{product.name}</div>
                            <div className="product-subtitle">{product.description}</div>
                            <div className="product-unit">
                                <span className="price">{product.price}</span>
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

                {
                    featuredProducts.length === 0 && (
                    <p className="no-products">No products found.</p>
                )}

            </div>
        </div>
    )
}

export default FeaturedSection;
