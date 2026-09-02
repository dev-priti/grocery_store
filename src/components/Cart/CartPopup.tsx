import { useNavigate } from "react-router-dom";
import type { ProductType } from "../../types/ProductType";

type cartPopupProps = {
    product: ProductType;
    cartCount: number;
    onClose: () => void;
};

function CartPopup ({product, cartCount, onClose} : cartPopupProps) {
    const navigate = useNavigate();
    const handleViewCart = () => {
        onClose();
        navigate("/cart");
    };

    return (
        <div className="cart-overlay">
            <div className="cart-popup">
                <button onClick={onClose}>X</button>
                <img
                    src={product.image}
                    alt={product.name}
                    width="80"
                />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
                <p>Added to your bag!</p>
                <p>Items in bag: {cartCount}</p>
                {/* <Link to="/cart">
                    View Cart
                </Link> OR  */}
                <button onClick={handleViewCart}>Viewcart</button>
            </div>
        </div>
    );
}

export default CartPopup;
