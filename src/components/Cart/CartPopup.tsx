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
        <div className="cart-overlay modal">
            <div className="model-dialog">
                <div className="cart-popup modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Item added to the bag.</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
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
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={handleViewCart}>Viewcart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPopup;
