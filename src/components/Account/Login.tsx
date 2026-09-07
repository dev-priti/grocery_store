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

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        if (!password) {
            alert("Please enter your password");
            return;
        }

        // const user = authenticateUser(email, password); // React code

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        setUser(data.user);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/profile");
    };

    return(

        <div className="login-container">
            <div>
                <p>Login !!</p>
                <div className="login-form">
                    <form name="login" onSubmit={handleSubmit} >
                        <div className="email-address">
                            <input type="email" className="email-field" name="email" value={email} placeholder="Email address" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <div className="password-field">
                            <input type={showPassword ? "text" : "password"} className="password-field" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="login-submit">
                            <input type="submit" className="submit-field" name="Submit" value="Submit" ></input>
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
