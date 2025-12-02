
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig";

const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);


function Verification () {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loading2, setLoading2] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null);
    const [codeError, setCodeError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Please enter the verification code.');
            return;
        }
        if (codeError) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = { email, code };
            await apiClient.post('/verify-email', data);
            setSuccess('Verification successful!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Verification failed. The code may be incorrect or expired.';
                setError(serverError);
            } else {
                 setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading2(true);
        setError(null);
        setSuccess(null);
        try {
            await apiClient.post('/api/resend-verification-email/', { email });
            setSuccess('A new verification code has been sent to your email.');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Failed to resend the code. Please try again in a moment.';
                setError(serverError);
            }
        } finally {
            setLoading2(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
        setCode(value);
        if (value.trim().length > 0 && value.trim().length !== 6) {
            setCodeError('The verification code must be 6 digits long.');
        } else {
            setCodeError(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
                <div className="mx-auto bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center">
                    <PaperAirplaneIcon className="h-8 w-8 text-orange-500 -rotate-45"/>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mt-6">Check Your Email</h1>
                <p className="text-slate-500 mt-2">
                    We've sent a 6-digit verification code to <br/>
                    <strong className="text-slate-700">{email || 'your email address'}</strong>.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md mt-6 text-left" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                 {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-md mt-6 text-left" role="alert">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="_ _ _ _ _ _"
                            maxLength={6}
                            className={`w-full text-center text-3xl tracking-[1em] font-mono py-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition ${codeError ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-orange-400'}`}
                            required
                        />
                         {codeError && <p className="text-red-500 text-xs mt-2">{codeError}</p>}
                    </div>
                    
                    <button type="submit" disabled={loading || !!success} className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all cursor-pointer disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center">
                         {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : "Verify Account"}
                    </button>
                </form>

                <div className="text-sm text-slate-500 mt-8">
                    <p>Didn't receive the email?</p>
                    <button onClick={handleResend} disabled={loading2} className="font-medium text-orange-600 hover:text-orange-500 hover:underline disabled:text-slate-400 disabled:cursor-wait">
                        {loading2 ? 'Sending...' : 'Click to resend'}
                    </button>
                </div>
                 <Link to="/login" className="inline-block mt-4 text-sm font-medium text-slate-600 hover:text-slate-500 hover:underline">
                    &larr; Back to Login
                </Link>
            </div>
        </div>
    );
}

export default Verification;