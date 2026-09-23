import type { CartItem } from "../types/ProductType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddressSelector from "../../src/components/Checkout/AddressSelector";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "../util/productImage";

type CheckoutProps = {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function Delivery({ cart, setCart }: CheckoutProps) {
    const [placingOrder, setPlacingOrder] = useState(false); // For preventing multiple order creation when the user click on complete order button multiple times.
    const [shippingAddressId, setShippingAddressId] = useState("");
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [billingAddressId, setBillingAddressId] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const navigate = useNavigate();
    const subtotal = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const shippingPrice =
    shippingMethod === "express" ? 100 : 50;

    const cartTotal = subtotal + shippingPrice;
    // useEffect(() => {
    //     if (cart.length === 0) {
    //         navigate("/cart");
    //     }
    // }, [cart.length, navigate]);


    const handlePlaceOrder = async ()  => {
        if (placingOrder) {
            return;
        }

        setPlacingOrder(true);

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            setPlacingOrder(false);
            return;
        }

        if (!shippingAddressId) {
            alert("Please select a shipping address");
            setPlacingOrder(false);
            return;
        }

        const finalBillingAddressId = sameAsShipping
            ? shippingAddressId
            : billingAddressId;

        if (!finalBillingAddressId) {
            alert("Please select a billing address");
            setPlacingOrder(false);
            return;
        }

        if (!shippingMethod) {
            alert("Please select a shipping method");
            setPlacingOrder(false);
            return;
        }

        if (!paymentMethod) {
            alert("Please select a payment method");
            setPlacingOrder(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        shippingAddressId,
                        billingAddressId: finalBillingAddressId,
                        shippingMethod,
                        paymentMethod,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                setPlacingOrder(false);
                return;
            }

            console.log("Order created:", data.order);
            setCart([]);
            navigate(`/confirm/${data.order._id}`);
        } catch (error) {
            console.error("Place order error:", error);
            setPlacingOrder(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-layout">
                <div className="checkout-card">
                    <h1>Checkout</h1>

                    <div className="checkout-section">
                        <AddressSelector
                            title="Shipping Address"
                            name="shippingAddress"
                            selectedAddressId={shippingAddressId}
                            onAddressChange={(addressId) => {
                                setShippingAddressId(addressId);

                                if (sameAsShipping) {
                                    setBillingAddressId(addressId);
                                }
                            }}
                        />
                    </div>

                    <div className="checkout-section billing-address-container">
                        <h2>Billing Address</h2>

                        <label className="checkbox-row" htmlFor="asShipping">
                            <input
                                type="checkbox"
                                id="asShipping"
                                name="asShipping"
                                checked={sameAsShipping}
                                onChange={(e) => {
                                    const checked = e.target.checked;

                                    setSameAsShipping(checked);

                                    if (checked) {
                                        setBillingAddressId(shippingAddressId);
                                    }
                                }}
                            />
                            <span>Billing address is same as shipping address</span>
                        </label>

                        {!sameAsShipping && (
                            <AddressSelector
                                title="Billing Address"
                                name="billingAddress"
                                selectedAddressId={billingAddressId}
                                onAddressChange={setBillingAddressId}
                            />
                        )}
                    </div>

                    <div className="checkout-section">
                        <h2>Shipping Method</h2>
                        <label className="option-row">
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="standard"
                                checked={shippingMethod === "standard"}
                                onChange={(e) =>
                                    setShippingMethod(e.target.value)
                                }
                            />
                            <span>Standard Delivery</span>
                        </label>
                        <label className="option-row">
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="express"
                                checked={shippingMethod === "express"}
                                onChange={(e) =>
                                    setShippingMethod(e.target.value)
                                }
                            />
                            <span>Express Delivery</span>
                        </label>
                    </div>

                    <div className="checkout-section">
                        <h2>Payment Method</h2>
                        <label className="option-row">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>

                {cart.length > 0 ? (
                    <aside className="checkout-summary-card">
                        <h2>Order Overview</h2>

                        {cart.map(item => (
                            <div key={item.product.id} className="checkout-item">
                                <img
                                    src={getProductImage(item.product.image)}
                                    alt={item.product.name}
                                    className="checkout-item-image"
                                    onError={(event) => {
                                        event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                                    }}
                                />
                                <div className="checkout-item-details">
                                    <p className="checkout-item-name">{item.product.name}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p>₹{item.product.price} each</p>
                                </div>
                                <strong>₹{item.product.price * item.quantity}</strong>
                            </div>
                        ))}

                        <div className="checkout-summary-lines">
                            <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
                            <div><span>Shipping</span><strong>₹{shippingPrice}</strong></div>
                            <div className="checkout-total"><span>Total</span><strong>₹{cartTotal}</strong></div>
                        </div>

                        <button className="btn btn-success w-100 checkout-submit" onClick={handlePlaceOrder} disabled={placingOrder}>
                            {placingOrder ? "Placing Order..." : "Place Order"}
                        </button>
                    </aside>
                ) : null}
            </div>
        </div>
    );
}

export default Delivery;
