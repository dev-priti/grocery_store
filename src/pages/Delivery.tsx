import type { CartItem } from "../types/ProductType";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddressSelector from "../../src/components/Checkout/AddressSelector";

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
        <div>
            {
                <>
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
                    <div className="billing-address-container">
                        <h2>Billing Address</h2>

                        <div>
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

                            <label htmlFor="asShipping">
                                Billing address is same as shipping address
                            </label>
                        </div>

                        {!sameAsShipping && (
                            <AddressSelector
                                title="Billing Address"
                                name="billingAddress"
                                selectedAddressId={billingAddressId}
                                onAddressChange={setBillingAddressId}
                            />
                        )}
                    </div>
                    <h2>Shipping Method</h2>
                    <label>
                        <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={(e) =>
                                setShippingMethod(e.target.value)
                            }
                        />
                        Standard Delivery
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={(e) =>
                                setShippingMethod(e.target.value)
                            }
                        />
                        Expresss Delivery
                    </label> 
                    <h2>Payment Method</h2>

                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />
                        Cash on Delivery
                    </label>                  
                </>
            }
            { cart.length > 0 ? (
                <>
                <h1>Checkout</h1>

                    {cart.map(item => (
                        <div key={item.product.id}>
                            <p>{item.product.name}</p>
                            <img src={item.product.image}></img>
                            <p>Quantity: {item.quantity}</p>
                            <p>
                                Price: ₹{item.product.price}
                            </p>
                            <p>
                                Subtotal: ₹
                                {item.product.price * item.quantity}
                            </p>
                        </div>
                    ))}
                    <p>
                        Subtotal: ₹{subtotal}
                    </p>

                    <p>
                        Shipping: ₹{shippingPrice}
                    </p>
                    <p>
                        Total: ₹{cartTotal}
                    </p>
                    <button onClick={handlePlaceOrder} disabled={placingOrder}>
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                </>
                ) : null
            }

        </div>  
    );
}

export default Delivery;
