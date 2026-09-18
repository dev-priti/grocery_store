export type Order = {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    shippingPrice: number;
    items: {
        productId: number;
        itemName: string;
        quantity: number;
        priceAtPurchase: number;
        itemSubtotal: number;
        image?: string;
    }[];
    shippingAddressId: string;
    billingAddressId: string;
    shippingMethod: string;
    subtotal: number;
    tax: number;
    paymentMethod: string;
};
