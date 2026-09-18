import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Order } from "../../types/Order";
import type { Address } from "../../types/Address";

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token || !orderId) {
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }               
            );

            const data = await response.json();

            if(!response.ok) {
                console.error(data.message);
            }

            const shippingAddressResponse = await fetch(
                `http://localhost:3000/api/addresses/${data?.shippingAddressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }               
            );

            const shippingAddressData = await shippingAddressResponse.json();

            if(!shippingAddressResponse.ok) {
                console.error(shippingAddressData.message);
            }

            const billingAddressResponse = await fetch(
                `http://localhost:3000/api/addresses/${data?.billingAddressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }               
            );

            const billingAddressData = await billingAddressResponse.json();

            if(!billingAddressResponse.ok) {
                console.error(billingAddressData.message);
            }

            setOrder(data);
            setShippingAddress(shippingAddressData);
            setBillingAddress(billingAddressData);

            console.log(shippingAddressData);
            console.log(billingAddressData);
        }
        fetchOrderDetails(); // its just a function call and not dependency.
    }, [orderId]); // orderID is dependency as whenever it changes, page will re-render.

    if(!order) {
        return (
            <div className="order-details-loading">
                Loading order...
            </div>
        );
    }

    return (
        <div className="order-details">
            <button
                className="back-orders-button"
                onClick={() => navigate("/orders")}
            >
                ← Back to My Orders
            </button>
            <h1 className="order-details-title">Order Details</h1>
            <p className="order-summary">Order ID: {order._id}</p>
            <div className="shipping-address">
                <p>
                    Shipping address: {order.shippingAddressId}
                </p>
                <p>
                    Shipping Method: {order.shippingMethod}
                </p>
                <p>
                    Payment Method: {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                    {shippingAddress?.firstName}{shippingAddress?.lastName}<br/>
                    {shippingAddress?.addressLine1} {shippingAddress?.addressLine2}<br/>
                    {shippingAddress?.city} {shippingAddress?.state}<br/>
                    {shippingAddress?.country} {shippingAddress?.postalCode}<br/>
                    {shippingAddress?.phone}<br/><br/>
                </p>
            </div>
            <div className="billing-address">
                <p>
                    Billing address: {order.billingAddressId}<br/>
                </p>
                <p>
                    {billingAddress?.firstName} {billingAddress?.lastName}<br/>
                    {billingAddress?.addressLine1} {billingAddress?.addressLine2}<br/>
                    {billingAddress?.city} {billingAddress?.state}<br/>
                    {billingAddress?.country} {billingAddress?.postalCode}<br/>
                    {billingAddress?.phone}<br/>
                </p>
            </div>
            <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p>Payment: {order.paymentStatus}</p>

            <p>Status: {order.orderStatus}</p><br/><br/>

            <h2>Product details</h2>

            <table className="order-items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>

                <tbody>
                    {order.items.map(item => (
                        <tr key={item.productId}>
                            <td>
                                <div className="order-product">
                                    <img
                                        src={
                                            item.image ||
                                            "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
                                        }
                                        alt={item.itemName}
                                        className="order-product-image"
                                        onError={(event) => {
                                            event.currentTarget.src =
                                                "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp";
                                        }}
                                    />

                                    <span>{item.itemName}</span>
                                </div>
                            </td>

                            <td>{item.quantity}</td>

                            <td>₹{item.priceAtPurchase}</td>

                            <td>₹{item.itemSubtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>Subtotal: ₹{order.subtotal}</div>
            <div>Tax: ₹{order.tax}</div>
            <div>Shipping Price: ₹{order.shippingPrice}</div>
            <div>Total: ₹{order.totalPrice}</div>
        </div>
    )
}

export default OrderDetails;
