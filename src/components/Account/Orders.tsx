import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth";

type Order = {
    _id: string;
    orderStatus: string;
    createdAt: string;
    items: {
        productId: number;
        itemName: string;
        image: string;
    }[];
};

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = getAuthToken();

            if (!token) {
                return;
            }

            const response = await fetch(
                "http://localhost:3000/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <div className="orders-page">
            <div className="orders-header">
                <div>
                    <p className="section-kicker">Your purchases</p>
                    <h1>My Orders</h1>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders-state">
                    <h2>No orders found.</h2>
                    <p>Your recent grocery orders will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="order-card"
                            onClick={() => navigate(`/orders/${order._id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    navigate(`/orders/${order._id}`);
                                }
                            }}
                        >
                            <div className="order-card-header">
                                <div>
                                    <p className="order-label">Order #{order._id.slice(-6).toUpperCase()}</p>
                                    <h3>{new Date(order.createdAt).toLocaleDateString()}</h3>
                                </div>
                                <span className="status-pill">{order.orderStatus}</span>
                            </div>

                            <div className="order-items-preview">
                                {order.items.slice(0, 3).map(item => (
                                    <div key={item.productId} className="mini-item">
                                        {item.image && (
                                            <img src={item.image} alt={item.itemName} />
                                        )}
                                        <span>{item.itemName}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <span>{order.items.length} items</span>
                                <strong>View details</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
