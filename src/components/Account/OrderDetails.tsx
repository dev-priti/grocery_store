import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Order } from "../../types/Order";
import { getAuthToken } from "../../util/auth";
//import type { Address } from "../../types/Address";

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    // const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    // const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = getAuthToken();
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

            // const shippingAddressResponse = await fetch(
            //     `http://localhost:3000/api/addresses/${data?.shippingAddressId}`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         }
            //     }               
            // );

            // const shippingAddressData = await shippingAddressResponse.json();

            // if(!shippingAddressResponse.ok) {
            //     console.error(shippingAddressData.message);
            // }

            // const billingAddressResponse = await fetch(
            //     `http://localhost:3000/api/addresses/${data?.billingAddressId}`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         }
            //     }               
            // );

            // const billingAddressData = await billingAddressResponse.json();

            // if(!billingAddressResponse.ok) {
            //     console.error(billingAddressData.message);
            // }

            setOrder(data);
            // setShippingAddress(shippingAddressData);
            // setBillingAddress(billingAddressData);

            // console.log(shippingAddressData);
            // console.log(billingAddressData);
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
        <div className="order-details-page">
            <button
                className="back-orders-button"
                onClick={() => navigate("/orders")}
            >
                ← Back to My Orders
            </button>

            <div className="order-details-header">
                <div>
                    <p className="section-kicker">Order summary</p>
                    <h1 className="order-details-title">Order Details</h1>
                </div>
                <span className="status-pill status-pill-large">{order.orderStatus}</span>
            </div>

            <div className="order-info-grid">
                <div className="details-panel">
                    <h2>Order information</h2>
                    <div className="detail-row">
                        <span>Order ID</span>
                        <strong>{order._id}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Placed on</span>
                        <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Payment status</span>
                        <strong>{order.paymentStatus}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Shipping method</span>
                        <strong>{order.shippingMethod}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Payment method</span>
                        <strong>{order.paymentMethod}</strong>
                    </div>
                </div>

                <div className="details-panel">
                    <h2>Address</h2>
                    {order.shippingAddress ? (
                        <div className="address-block">
                            <h3>Shipping</h3>
                            <p>
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                                {order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                {order.shippingAddress?.country}<br />
                                {order.shippingAddress?.phone}
                            </p>
                        </div>
                    ) : null}

                    {order.billingAddress ? (
                        <div className="address-block">
                            <h3>Billing</h3>
                            <p>
                                {order.billingAddress?.firstName} {order.billingAddress?.lastName}<br />
                                {order.billingAddress?.addressLine1} {order.billingAddress?.addressLine2}<br />
                                {order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.postalCode}<br />
                                {order.billingAddress?.country}<br />
                                {order.billingAddress?.phone}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="order-items-card">
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
            </div>

            <div className="order-total-card">
                <div className="detail-row"><span>Subtotal</span><strong>₹{order.subtotal}</strong></div>
                <div className="detail-row"><span>Tax</span><strong>₹{order.tax}</strong></div>
                <div className="detail-row"><span>Shipping</span><strong>₹{order.shippingPrice}</strong></div>
                <div className="detail-row total-row"><span>Total</span><strong>₹{order.totalPrice}</strong></div>
            </div>
        </div>
    )
}

export default OrderDetails;
