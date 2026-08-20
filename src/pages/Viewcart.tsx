import type { ViewcartProps } from "../types/ViewcartProps";

function ViewCart({ cart, increaseQuantity, decreaseQuantity, removeItem }: ViewcartProps) {

  const cartTotal = cart.reduce(
  (total, item) =>
    total + item.product.price * item.quantity,
  0
  );

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
          <p>Quantity: <button onClick={() => decreaseQuantity(item.product.id)}>-</button> {item.quantity} <button onClick={() => increaseQuantity(item.product.id)}>+</button></p>
          <p>₹{item.quantity * item.product.price}</p>
          <p className="remove-product"><button onClick={() => removeItem(item.product.id)}>x</button></p>
        </div>
      ))}
      <h2>Total: ₹{cartTotal}</h2>
    </div>
  );
}

export default ViewCart;
