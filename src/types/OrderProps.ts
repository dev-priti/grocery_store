type OrderProps = {
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
    }[];
};
