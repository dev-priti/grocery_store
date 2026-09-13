import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        image: string;
    }[];
};

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");

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
        <div>
            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map(order => (
                    <div key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    style={{ cursor: "pointer" }}
                    >
                        <h3>Order #{order._id}</h3>

                        <p>
                            Date:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <p>Total: ₹{order.totalPrice}</p>
                        {
                            order.items.map(item => (
                                <div key={item.productId}>
                                    <p>{item.itemName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.priceAtPurchase}</p>
                                    <p>Subtotal: ₹{item.itemSubtotal}</p>
                                </div>
                            )
                        )}
                        <p>Payment: {order.paymentStatus}</p>

                        <p>Status: {order.orderStatus}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;
