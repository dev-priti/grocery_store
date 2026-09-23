//import products from "../data/products.json";
import { Link, useParams } from "react-router-dom";
import type { ProductType } from "../types/ProductType";
import { useEffect, useState } from "react";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "../util/productImage";

export type productProps = {
    addToCart?: (product: ProductType) => void;
};

function Product({ addToCart }: productProps) {
    const { productId } = useParams<{ productId: string }>();
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch("http://localhost:3000/api/products");
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const filteredProducts = productId
        ? products.filter((product) => product.id === Number(productId))
        : products;

    if (filteredProducts.length === 0) {
        return (
            <div className="product-detail-page">
                <div className="empty-state-card">
                    <h2>No product found.</h2>
                    <p>Please return to the product listing and choose another item.</p>
                    <Link to="/all" className="btn btn-success">Browse products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            {filteredProducts.map((product) => (
                <div className="product-detail-card" key={product.id}>
                    <div className="product-detail-image-wrap">
                        <img
                            src={getProductImage(product.image)}
                            className="product-detail-image"
                            alt={product.name}
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                        />
                    </div>

                    <div className="product-detail-info">
                        <span className="product-badge">Fresh pick</span>
                        <h1>{product.name}</h1>
                        <p className="product-detail-description">{product.description}</p>

                        <div className="product-detail-price-row">
                            <span className="product-detail-price">₹{product.price}</span>
                            <span className="product-detail-unit">{product.unit}</span>
                            <span className="product-detail-rating">★ {product.rating}</span>
                        </div>

                        <div className="product-detail-meta">
                            <span>Category: {product.category}</span>
                            <span>Product ID: #{product.id}</span>
                        </div>

                        <div className="product-detail-actions">
                            <button
                                className="btn btn-success product-detail-button"
                                value="Add to Cart"
                                product-id={product.id}
                                onClick={() => addToCart?.(product)}
                            >
                                Add to Cart
                            </button>
                            <Link to="/all" className="btn btn-outline-success product-detail-secondary">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Product;
