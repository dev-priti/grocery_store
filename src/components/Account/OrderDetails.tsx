import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import { Order } from "../../types/OrderProps";

type Order = {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    items: {
        productId: number;
        itemName: string;
        quantity: number;
        priceAtPurchase: number;
        itemSubtotal: number;
        image?: string;
    }[];
};

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
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
                console.error("data.message");
            }

            setOrder(data);
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
            <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p>Total: ₹{order.totalPrice}</p>

            <p>Payment: {order.paymentStatus}</p>

            <p>Status: {order.orderStatus}</p>

            <h2>Items</h2>

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
    )
}

export default OrderDetails;
