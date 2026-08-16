import products from "../data/products.json";
import { useParams, Link } from "react-router-dom";
//import type { ProductType } from "../types/ProductType";

// type productProps = {
//     results?: ProductType[];
// };

function ProductListing() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const filteredProducts = categoryId
        ? products.filter((product) => product.categoryId === Number(categoryId))
        : products;

    // if (results && results.length > 0) {
    //     filteredProducts = results;
    // }

    return(

        <div className="site__product-listing">
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
        </div>
    );
}

export default ProductListing;
