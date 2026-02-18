import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Calculator } from "lucide-react";

export function Login() {
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock login
        if (email && password) {
            login(email);
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
            <div className="bg-yellow-300 w-full max-w-md rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-orange-500 p-3 rounded-xl text-white mb-4">
                        <Calculator size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-yellow-900">Kirana Flow</h1>
                    <p className="text-yellow-800 font-medium">Login to Kirana Flow</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-yellow-50 border-none text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-yellow-50 border-none text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-orange-600/20"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-yellow-800">
                        Don't have an account? <span className="font-bold cursor-pointer hover:underline">Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
