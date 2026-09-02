export type HeaderProps = {
    greetings?: string;
    name?: string;
    searchText?: string;
    setSearchText: (value: string) => void;
    cartCount: number;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

// export interface HeaderProps = {
//     greetings?: string;
//     name?: string;
// }
