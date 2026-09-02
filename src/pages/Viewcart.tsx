import type { ReactElement } from "react";
import OrderSummary from "../components/Cart/OrderSummary";
import type { ViewcartProps } from "../types/ViewcartProps";

type OrderSummaryProps = {
  cartTotal: number;
};

const OrderSummaryCard = OrderSummary as unknown as (props: OrderSummaryProps) => ReactElement;

function ViewCart({ cart, increaseQuantity, decreaseQuantity, removeItem, minStock = 1, maxStock = 8, cartTotal }: ViewcartProps) {

  return (
    <div>
      <h1>Your Cart</h1>
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
          <p>Quantity: <button onClick={() => decreaseQuantity(item.product.id)} disabled={item.quantity <= minStock} >-</button> {item.quantity} <button onClick={() => increaseQuantity(item.product.id)} disabled={item.quantity >= maxStock}>+</button></p>
          <p>₹{item.quantity * item.product.price}</p>
          <p className="remove-product"><button onClick={() => removeItem(item.product.id)}>x</button></p>
        </div>
      ))}
      <h2>Total: ₹{cartTotal}</h2>
      <OrderSummaryCard cartTotal={cartTotal} />
    </div>
  );
}

export default ViewCart;
