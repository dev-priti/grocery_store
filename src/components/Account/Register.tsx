import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
//import type { User } from "../../types/User";
// import { getAllUsers, saveUser } from "../../util/auth"; // React authentication

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (!firstName.trim()) {
            alert("Please enter your first name");
            return;
        }

        if (!lastName.trim()) {
            alert("Please enter your last name");
            return;
        }

        if (firstName.trim().length < 2 || lastName.trim().length < 2) {
            alert("Name must be at least 2 characters");
            return;
        }

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        // const allUsers = getAllUsers(); React authentication
        //const maxId = allUsers.reduce(
        // (max: number, user: User) => Math.max(max, user.id),
        // 0
        // );
        // const newUser = {
        //     id: maxId + 1,
        //     name,
        //     email,
        //     password,
        // };
    

        //saveUser(newUser);

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),            
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }        
        
            //saveUser(newUser);

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setShowConfirmPassword(false);

            //console.log("New user:", newUser);
            navigate("/login");
            alert("Account created successfully!");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Unable to connect to the server");
        }
    }

    return (
        <div className="auth-page register-page">
            <div className="auth-card register-card">
                <div className="auth-brand">FreshCart</div>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Start your healthy food journey today</p>

                <form name="register" className="auth-form" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="inputFirstName4" className="form-label">First name</label>
                            <input
                                type="text"
                                placeholder="First name"
                                className="form-control"
                                id="inputFirstName4"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="inputLastNam4" className="form-label">Last name</label>
                            <input
                                type="text"
                                placeholder="Last name"
                                className="form-control"
                                id="inputLastNam4"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="inputEmail4" className="form-label">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="form-control"
                                id="inputEmail4"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="inputPassword4" className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Create password"
                                className="form-control"
                                id="inputPassword4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="inputConfirmPassword4" className="form-label">Confirm password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    className="form-control"
                                    id="inputConfirmPassword4"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 auth-submit">Register</button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login" className="auth-link">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
