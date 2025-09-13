// --- START OF FILE register.tsx ---

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig";

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

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


function Registration() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [full_name, setFull_name] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [password2Error, setPassword2Error] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !full_name.trim() || !password2.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        
        if (password !== password2) {
            setPassword2Error('Passwords do not match.');
            return;
        }

        if (passwordError || password2Error) {
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const data = { email, password, full_name };
            await apiClient.post('/api/register/', data);
            navigate('/verify-email', { state: { email: email } });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'An unknown error occurred.';
                setError(serverError);
            } else {
                 setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.trim().length > 0 && newPassword.trim().length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
        } else {
            setPasswordError(null);
        }

        if (password2 && newPassword !== password2) {
            setPassword2Error('Passwords do not match.');
        } else {
            setPassword2Error(null);
        }
    };

    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword2 = e.target.value;
        setPassword2(newPassword2);

        if (password && password !== newPassword2) {
            setPassword2Error('Passwords do not match.');
        } else {
            setPassword2Error(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Create Your Account</h1>
                    <p className="text-slate-500 mt-2">Get started with your personal IELTS Scorer.</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-slate-400"/>
                            </span>
                            <input
                                id="full_name"
                                type="text"
                                value={full_name}
                                onChange={(e) => setFull_name(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                required
                            />
                        </div>
                    </div>

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
                                onChange={handlePasswordChange}
                                placeholder="Minimum 8 characters"
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition ${passwordError ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-orange-400'}`}
                                required
                            />
                        </div>
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-slate-400"/>
                            </span>
                            <input
                                id="password2"
                                type="password"
                                value={password2}
                                onChange={handlePassword2Change}
                                placeholder="Repeat your password"
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition ${password2Error ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-orange-400'}`}
                                required
                            />
                        </div>
                        {password2Error && <p className="text-red-500 text-xs mt-1">{password2Error}</p>}
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all cursor-pointer disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center">
                         {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Registration;