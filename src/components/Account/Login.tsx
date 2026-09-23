import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { AuthUser } from "../../types/User";
import { Link } from "react-router-dom";
//import { authenticateUser } from "../../util/auth";

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
            localStorage.setItem("token", data.token);
            navigate("/profile");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to login right now. Please try again.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return(

        <div className="login-container form-group">
            <div>
                <p>Login !!</p>
                <div className="login-form">
                    <form name="login" onSubmit={handleSubmit} >
                        <div className="email-address form-group">
                            <input type="email" className="email-field form-control mx-sm-3 mb-2" id="exampleInputEmail1" name="email" value={email} placeholder="Email address" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <div className="password-field form-group">
                            <input type={showPassword ? "text" : "password"} className="password-field form-control mx-sm-3 mb-2" id="exampleInputPassword" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                            <button
                                type="button" className="btn btn-primary mb-2"
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="login-submit">
                            <button
                                type="submit"
                                className="submit-field btn btn-primary"
                                name="Submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>
                    <Link to="/register">
                    Register
                    </Link>
                </div>
            </div>
        </div>
    );

}

export default Login;
