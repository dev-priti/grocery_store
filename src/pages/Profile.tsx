import type { AuthUser } from "../types/User";

type ProfileProps = {
    user: AuthUser | null;
};

function Profile({ user }: ProfileProps) {
    return (
        <div>
            <div>Logged in successfully!!!</div>

            <div>
                <h2>Welcome, {user?.name}</h2>
                <p>Email: {user?.email}</p>
            </div>
        </div>
    );
}

export default Profile;
