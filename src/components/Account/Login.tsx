import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { AuthUser } from "../../types/User";
import { Link } from "react-router-dom";
import { setAuthToken } from "../../util/auth";

type LoginProps = {
    setUser: Dispatch<SetStateAction<AuthUser | null>>;
};

function Login({ setUser }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            alert("Please enter your email");
            return;
        }

        if (!password) {
            alert("Please enter your password");
            return;
        }

        setIsSubmitting(true);

        type LoginResponse = {
            message?: string;
            token?: string;
            user?: {
                id?: string;
                name?: string;
                firstName?: string;
                lastName?: string;
                email?: string;
                phone?: string;
            };
        };

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    password,
                }),
            });

            let data: LoginResponse = {};

            try {
                data = (await response.json()) as LoginResponse;
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data?.message || "Login failed. Please try again.");
            }

            if (!data?.user || !data?.token) {
                throw new Error("Invalid login response from server");
            }

            const loggedInUser: AuthUser = {
                id: Number(data.user.id ?? 0),
                name: data.user.name || `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || "User",
                firstName: data.user.firstName || "",
                lastName: data.user.lastName || "",
                email: data.user.email || "",
                emailOptin: 0,
                dob: new Date(),
                phone: data.user.phone || "",
            };

            setUser(loggedInUser);
            setAuthToken(data.token);
            navigate("/profile");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to login right now. Please try again.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="auth-page login-page">
            <div className="auth-card">
                <div className="auth-brand">FreshCart</div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue your grocery shopping</p>

                <form name="login" className="auth-form" onSubmit={handleSubmit} >
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" name="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}></input>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} className="form-control" id="exampleInputPassword" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                            <button
                                type="button" className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100 auth-submit"
                        name="Submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>New here?</span>
                    <Link to="/register" className="auth-link">Create an account</Link>
                </div>
            </div>
        </div>
    );

}

export default Login;
