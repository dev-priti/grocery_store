export type AddressSnapshot = {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

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
    shippingAddress: AddressSnapshot;
    billingAddress: AddressSnapshot;
};
