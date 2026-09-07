import type { AuthUser } from "./User";

export type HeaderProps = {
    greetings?: string;
    name?: string;
    searchText?: string;
    setSearchText: (value: string) => void;
    cartCount: number;
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

// export interface HeaderProps = {
//     greetings?: string;
//     name?: string;
// }
