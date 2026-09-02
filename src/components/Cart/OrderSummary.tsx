import type { ViewcartProps } from "../../types/ViewcartProps"

function OrderSummary({ cartTotal }: ViewcartProps) {

    const discountPercentage = 10;
    const shippingCharges = 10;
    const discount = cartTotal - (cartTotal * discountPercentage)/100;
    const tax = 0;
    const total = discount + shippingCharges;

    return(
        <>
            <p>Subtotal: ₹{cartTotal}</p>
            <p>Shipping: ₹{shippingCharges}</p>
            <p>Tax: ₹{tax}</p>
            <p>Discount %: {discountPercentage} %</p>
            <p>Discount Amount: ₹{discount}</p>
            <p>Total: ₹{total}</p>
        </>
    );

}

export default OrderSummary;
