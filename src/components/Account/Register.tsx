import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import type { User } from "../../types/User";
import { getAllUsers, saveUser } from "../../util/auth";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (!name.trim()) {
            alert("Please enter your name");
            return;
        }

        if (name.trim().length < 2) {
            alert("Name must be at least 2 characters");
            return;
        }

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        const allUsers = getAllUsers();
        const maxId = allUsers.reduce(
        (max: number, user: User) => Math.max(max, user.id),
        0
        );
        const newUser = {
            id: maxId + 1,
            name,
            email,
            password,
        };
    

        saveUser(newUser);
    
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowConfirmPassword(false);

        console.log("New user:", newUser);
        navigate("/login");
        alert("Account created successfully!");

    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>

            <form name="register" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />          
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    {showConfirmPassword ? "Hide" : "Show"}
                </button>
                <button type="submit">Register</button>
            </form>
            <Link to="/login">
            Login
            </Link>
        </div>
    );
}

export default Register;
