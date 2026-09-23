export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    emailOptin: number;
    dob: Date;
    phone: string;
};

export type AuthUser = Omit<User, "password">;

export type ProfileUser = Omit<User, "password"> & {
    password?: string;
};
