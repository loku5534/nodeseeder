import '../styles/login.css'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.jsx";


export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        axiosInstance.post("/login", {email, password})
            .then(response => {
                if (response.status === 200) {
                    console.log("Login successful", response.data);
                    navigate("/", {state: {user: response.data}});
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 403 || error.response.status === 400) {
                    console.error("User does not exist or is not verified", error.response.data);
                    alert("Invalid Credentials: User Does Not Exist or Not Verified");
                } else {
                    console.error("Login failed", error);
                }
            });
        console.log("Login form submitted", {email, password});
    };

    return (
        <div className={"login-container"}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                </div>
                <button type="submit">Login</button>
            </form>
            <p className="signup-link">
                Don't have an account? <Link to={"/signup"}>Sign Up</Link>
            </p>
        </div>);
}