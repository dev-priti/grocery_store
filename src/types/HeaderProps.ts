import type { AuthUser } from "./User";
import type { CartItem } from "./ProductType";

export type HeaderProps = {
    greetings?: string;
    name?: string;
    searchText?: string;
    setSearchText: (value: string) => void;
    cartCount: number;
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// export interface HeaderProps = {
//     greetings?: string;
//     name?: string;
// }
