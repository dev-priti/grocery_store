import type { CartItem } from "./ProductType";

export type ViewcartProps = {
  cart: CartItem[];
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeItem: (productId: number) => void;
  minStock: number;
  maxStock: number;
  cartTotal: number,
};
