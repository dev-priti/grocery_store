export type ProductType = {
    id: number;
    categoryId: number;
    category: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    image: string;
};

export type CartItem = {
    product: ProductType;
    quantity: number;
};
