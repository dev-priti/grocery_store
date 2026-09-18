import type { ReactElement } from "react";
import OrderSummary from "../components/Cart/OrderSummary";
import type { ViewcartProps } from "../types/ViewcartProps";
import { useNavigate } from "react-router-dom";

type OrderSummaryProps = {
  cartTotal: number;
};

const OrderSummaryCard = OrderSummary as unknown as (props: OrderSummaryProps) => ReactElement;

function ViewCart({ cart, changeQuantity, removeItem, minStock = 1, maxStock = 8, cartTotal }: ViewcartProps) {

  const navigate = useNavigate();
  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length > 0 ? (
        <>
          <p>Items in bag: {cart.length}</p>
          {cart.map((item) => (
          <div key={item.product.id} className="cart-item">
            <img
              src={item.product.image}
              alt={item.product.name}
              width="100"
            />

            <h3>{item.product.name}</h3>
            <p>₹{item.product.price}</p>
            <p>Quantity: <button onClick={() => changeQuantity(item.product.id, -1)} disabled={item.quantity <= minStock} >-</button> {item.quantity} <button onClick={() => changeQuantity(item.product.id, 1)} disabled={item.quantity >= maxStock}>+</button></p>
            <p>₹{item.quantity * item.product.price}</p>
            <p className="remove-product"><button onClick={() => removeItem(item.product.id)}>x</button></p>
          </div>
          ))}
          <h2>Total: ₹{cartTotal}</h2>
          <OrderSummaryCard cartTotal={cartTotal} />
          <div>
            <button className="checkout-button" onClick={() => navigate("/checkout")}>Checkout</button>
          </div>
        </>
      ) : <h2>There are no products in the bag. Please add some products to continue.</h2>}
    </div>
  );
}

export default ViewCart;
