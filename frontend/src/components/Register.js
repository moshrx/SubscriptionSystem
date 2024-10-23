import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import snailImage from "../assets/snail.png";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        name: "",
        email: "",
        password: "",
        general: "",
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error messages before validating
        setError({ name: "", email: "", password: "", general: "" });

        let valid = true;

        // Check if name field is empty
        if (name.trim() === "") {
            setError((prev) => ({ ...prev, name: "Name is required." }));
            valid = false;
        }

        // Check if email is valid
        if (email.trim() === "") {
            setError((prev) => ({ ...prev, email: "Email is required." }));
            valid = false;
        } else if (!emailRegex.test(email)) {
            setError((prev) => ({ ...prev, email: "Please enter a valid email." }));
            valid = false;
        }

        // Check if password is valid
        if (password.trim() === "") {
            setError((prev) => ({ ...prev, password: "Password is required." }));
            valid = false;
        } else if (!passwordRegex.test(password)) {
            setError((prev) => ({
                ...prev,
                password:
                    "Password must contain at least 6 characters, a capital letter, a symbol, and a digit.",
            }));
            valid = false;
        }

        // Stop form submission if validation fails
        if (!valid) return;

        try {
            await api.post("/register", { name, email, password });
            navigate("/login")
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError((prev) => ({ ...prev, general: "User already registered." }));
            } else {
                console.log(err);
                setError((prev) => ({
                    ...prev,
                    general: "Server error. Please try again later.",
                }));
            }
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left section for image */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <img
                    src={snailImage}
                    alt="Register"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Right section for the login form */}
            <div className="w-1/2 flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Create an Account
                    </h2>
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                        <div className="mb-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className={`w-full p-3 border ${error.name ? "border-red-500" : "border-gray-300"
                                    } rounded focus:outline-none focus:border-blue-500`}
                            />
                            {error.name && (
                                <span className="text-red-500 text-sm">{error.name}</span>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={`w-full p-3 border ${error.email ? "border-red-500" : "border-gray-300"
                                    } rounded focus:outline-none focus:border-blue-500`}
                            />
                            {error.email && (
                                <span className="text-red-500 text-sm">{error.email}</span>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full p-3 border ${error.password ? "border-red-500" : "border-gray-300"
                                    } rounded focus:outline-none focus:border-blue-500`}
                            />
                            {error.password && (
                                <span className="text-red-500 text-sm">{error.password}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Register
                        </button>

                        {error.general && (
                            <span className="text-red-500 text-center block mt-4">
                                {error.general}
                            </span>
                        )}

                        <p className="text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
