import type { ReactElement } from "react";
import OrderSummary from "../components/Cart/OrderSummary";
import type { ViewcartProps } from "../types/ViewcartProps";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "../util/productImage";

type OrderSummaryProps = {
  cartTotal: number;
};

const OrderSummaryCard = OrderSummary as unknown as (props: OrderSummaryProps) => ReactElement;

function ViewCart({ cart, changeQuantity, removeItem, minStock = 1, maxStock = 8, cartTotal }: ViewcartProps) {

  const navigate = useNavigate();
  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>Items in bag: {cart.length}</p>
      </div>

      {cart.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-items-panel">
            {cart.map((item) => (
              <div key={item.product.id} className="cart-item-card">
                <img
                  src={getProductImage(item.product.image)}
                  alt={item.product.name}
                  className="cart-item-image"
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />

                <div className="cart-item-content">
                  <div className="cart-item-top">
                    <h3>{item.product.name}</h3>
                    <button className="remove-product-btn" onClick={() => removeItem(item.product.id)}>Remove</button>
                  </div>

                  <div className="cart-item-meta">
                    <span className="cart-price">₹{item.product.price}</span>
                    <span className="cart-line-total">₹{item.quantity * item.product.price}</span>
                  </div>

                  <div className="quantity-control">
                    <button onClick={() => changeQuantity(item.product.id, -1)} disabled={item.quantity <= minStock} aria-label="Decrease quantity">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.product.id, 1)} disabled={item.quantity >= maxStock} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary-panel">
            <h2>Order Summary</h2>
            <OrderSummaryCard cartTotal={cartTotal} />
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{cartTotal}</strong>
            </div>
            <button className="btn btn-success w-100 checkout-button" onClick={() => navigate("/checkout")}>Checkout</button>
          </aside>
        </div>
      ) : (
        <div className="empty-cart-state">
          <h2>There are no products in the bag.</h2>
          <p>Please add some products to continue shopping.</p>
        </div>
      )}
    </div>
  );
}

export default ViewCart;
