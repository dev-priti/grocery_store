import { useNavigate } from "react-router-dom";
import type { ProductType } from "../../types/ProductType";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "../../util/productImage";

type cartPopupProps = {
    product: ProductType;
    cartCount: number;
    onClose: () => void;
};

function CartPopup ({ product, cartCount, onClose }: cartPopupProps) {
    const navigate = useNavigate();

    const handleViewCart = () => {
        onClose();
        navigate("/cart");
    };

    return (
        <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Added to cart">
            <div className="cart-modal-dialog">
                <div className="cart-popup">
                    <div className="cart-popup-header">
                        <h5>Item added to the bag.</h5>
                        <button
                            type="button"
                            className="cart-close-button"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="cart-popup-body">
                        <img
                            src={getProductImage(product.image)}
                            alt={product.name}
                            className="cart-popup-image"
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                        />

                        <div className="cart-popup-details">
                            <h3>{product.name}</h3>
                            <p className="cart-popup-price">₹{product.price}</p>
                            <p className="cart-popup-text">Added to your bag!</p>
                            <p className="cart-popup-meta">Items in bag: {cartCount}</p>
                        </div>
                    </div>

                    <div className="cart-popup-footer">
                        <button className="btn btn-primary cart-popup-button" onClick={handleViewCart}>
                            View cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPopup;
