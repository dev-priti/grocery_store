import products from "../data/products.json";
import { useParams } from "react-router-dom";
import type { ProductType } from "../types/ProductType";

export type productProps = {
    //searchText?: string;
    addToCart?: (product: ProductType) => void;
}

//function ProductListing({id, name} : categoryProp ) {
function Product ({ addToCart }: productProps) {
    const { productId } = useParams<{productId: string}>();

    const filteredProducts = productId ? products.filter(product => product.id === Number(productId)) : products;

    return(
        <div className="site__product-container">
            {filteredProducts.map((product) => (
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
                            <button className="add-to-cart-button" value="Add to Cart" product-id={product.id} onClick={() => addToCart?.(product)}>Add to Cart</button>
                        {/* </form> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Product;
