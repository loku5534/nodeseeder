import '../styles/signup.css'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.jsx";


export default function SignUp() {
    const [stage, setStage] = useState("signup");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [courses, setCourses] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    function validateSignUpForm() {
        if (!username || !email || !password || !courses) {
            alert("All fields are required for sign-up.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        return true;
    }

    function validateOtpForm() {
        console.log(otp);
        if (!otp || otp.length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return false;
        }
        return true;
    }

    function handleSignUp(event) {
        event.preventDefault();
        if (validateSignUpForm()) {
            axiosInstance.post("/register", {username, email, password, courses}).then(response => {
                if (response.status === 200) {
                    console.log("Sending Credentials successful", response.data);
                    setStage("otp");

                } else {
                    // Login failure
                    console.error("Login failed", response.data);
                }
            })
            console.log("Sign-up form submitted", {username, email, password});
        }
    }

    function handleOtpSubmit(event) {
        event.preventDefault();
        if (validateOtpForm()) {
            axiosInstance.post("/register/otp", {email, otp}).then(response => {
                if (response.status === 200) {
                    console.log("Sending Credentials successful", response.data);
                    navigate("/login");

                } else {
                    // Login failure
                    console.error("Login failed", response.data);
                }
            })
            console.log("Sign-up form submitted", {username, email, password});
            console.log("OTP submitted", {otp});
        }
    }

    return (<div className="sign-up-container">
        {stage === "signup" ? (<>
                <h1>Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            minLength={8}
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="courses">Course:</label>
                        <select name="courses" id="courses" onChange={(e) => setCourses(e.target.value)} required>
                            <option >Select Course</option>
                            <option value="1">BS Software Engineering</option>
                            <option value="2">BS Computer Science</option>
                            <option value="3">BS Data Science</option>
                        </select>
                    </div>
                    <button type="submit" className={"signup-button"}>Sign Up</button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </>) :

            (<div className="otp-container">
                <form onSubmit={handleOtpSubmit}>
                    <h1>Enter OTP</h1>
                    <p>A 6-digit OTP has been sent to your email. Please enter it below.</p>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                            // Only allow numbers and max 6 digits
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(value.toString());
                        }}
                        placeholder="Enter OTP"
                        autoFocus
                        className="otp-input"
                        required
                    />
                    <button type="submit">Verify OTP</button>
                    <p className="resend-otp-link" style={{marginTop: "10px", cursor: "pointer"}}>
                        Didn't receive the OTP? <button onClick={() => handleSignUp()}>Resend OTP</button>
                    </p>
                    <p className="resend-otp-link">
                        Incorrect Information? <Link to="/register">Go Back</Link>
                    </p>
                </form>


            </div>)}
    </div>);
}