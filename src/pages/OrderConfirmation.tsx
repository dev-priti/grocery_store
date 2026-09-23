import { Link, useParams } from "react-router-dom";

function OrderConfirmation() {
    const { orderId } = useParams();

    return (
        <div className="order-confirmation-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="order-confirmation-card text-center">
                            <div className="confirmation-icon-wrap">
                                <span className="confirmation-icon">✓</span>
                            </div>

                            <p className="confirmation-kicker">Order success</p>
                            <h1 className="display-6 fw-bold mb-3">Order Confirmed 🎉</h1>
                            <p className="confirmation-message">
                                Your order has been placed successfully and is being prepared for dispatch.
                            </p>

                            <div className="confirmation-order-box">
                                <span className="text-muted">Order ID</span>
                                <h3 className="mb-0">{orderId}</h3>
                            </div>

                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                                <Link to={`/orders/${orderId}`} className="btn btn-primary px-4 py-2">
                                    View Order Details
                                </Link>
                                <Link to="/" className="btn btn-outline-primary px-4 py-2">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
