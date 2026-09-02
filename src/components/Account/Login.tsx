import { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../../data/users.json";
import type { Dispatch, SetStateAction } from "react";

type LoginProps = {
    setUser: Dispatch<SetStateAction<any>>;
};

function Login({ setUser }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(
        (user) => user.email === email && user.password === password
        );
        if (user) {
            setUser(user);
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            navigate("/profile");
        } else {
            alert("Invalid email or password");
        }
    };

    return(

        <div className="login-container">
            <div>
                <p>Login !!</p>
                <div className="login-form">
                    <form name="login" onSubmit={handleSubmit} >
                        <div className="email-address">
                            <input type="text" className="email-field" name="email" value={email} placeholder="Email address" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <div className="password-field">
                            <input type="password" className="password-field" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                        </div>
                        <div className="login-submit">
                            <input type="submit" className="submit-field" name="Submit" value="Submit" ></input>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default Login;
