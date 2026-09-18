import { Link, useParams } from "react-router-dom";

function OrderConfirmation() {
   // const location = useLocation(); // The useLocation hook is a built-in feature of the React Router library.  It returns a location object representing the app's current URL and routing state

   const { orderId } = useParams();

    // const orderId = location.state?.orderId;

    return (
        <div>
            <h1>Order Confirmed 🎉</h1>

            <p>Your order has been placed successfully.</p>

            <p>
                Order ID: {orderId}
            </p>

            <Link to={`/orders/${orderId}`}>
                View Order Details
            </Link>
        </div>
    );
}

export default OrderConfirmation;
