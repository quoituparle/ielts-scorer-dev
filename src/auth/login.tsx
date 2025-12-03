// --- START OF FILE login.tsx ---

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig";

const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);


function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // New helper to auto-fill credentials
    const handleVisitorMode = () => {
        setEmail('test@test.com');
        setPassword('12345678');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please fill in both email and password.');
            return;
        };

        setLoading(true);
        setError(null);

        try {
            const data = { email, password };
            const response = await apiClient.post('/login/', data);
            const accessToken = response.data.access_token;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                navigate('/');
            } else {
                setError("Login successful, but no token was received.");
            }
        } catch(err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const serverError = err.response?.data?.detail || 'An unknown error occurred.';
                console.log(err.response)
                
                if (status === 403 ) {
                    setError("Your email is not verified. Redirecting you to verify...");
                    setTimeout(async () => {
                        try {
                           await apiClient.post('/api/resend-verification-email/', { email });
                        } catch (resendError) {
                            console.error("Failed to resend verification email", resendError);
                        }
                        navigate('/verify-email', { state: { email: email } });
                    }, 2000);
                } else {
                    setError(serverError);
                }
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Welcome Back!</h1>
                    <p className="text-slate-500 mt-2">Sign in to BANDSENSE</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="h-5 w-5 text-slate-400"/>
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password_input" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-slate-400"/>
                            </span>
                            <input
                                id="password_input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                required
                            />
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all cursor-pointer disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center">
                         {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing In...</span>
                            </div>
                        ) : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500 hover:underline">
                        Sign up
                    </Link>
                </p>

                {/* Visitor Mode Link */}
                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={handleVisitorMode}
                        className="text-sm text-slate-400 hover:text-slate-600 underline cursor-pointer transition-colors"
                    >
                        Visitor Mode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;