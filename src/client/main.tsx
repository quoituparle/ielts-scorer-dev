import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig";
import type { Language, Model } from "./def";
import './client.css'

interface UserDetails {
    user_email: string;
    api_key: string | null;
    language: string | null;
};

interface ScoringResponse {
    Overall_score: number;
    TR: number;
    LR: number;
    CC: number;
    GRA: number;
    reason: string;
    improvement: string;
}

const availableLanguages: Language[] = [
    { code: 'English', name: 'English' },
    { code: 'French', name: 'French' },
    { code: 'Chinese', name: 'Chinese (simplified)' },
    { code: 'Spanish', name: 'Spanish' },
    { code: 'Japenese', name: 'Japanese' },
];

const availableModels: Model[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
];

const GearIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.113-1.113l.448-.113c.542-.135 1.092.198 1.385.646l.293.44c.292.44.833.646 1.385.646h.448c.542 0 1.007.465 1.113 1.113l.113.448c.135.542-.198 1.092-.646 1.385l-.44.293c-.44.292-.646.833-.646 1.385v.448c0 .542.465 1.007 1.113 1.113l.448.113c.542.135 1.092-.198 1.385-.646l.293-.44c.292-.44.833-.646 1.385-.646h.448c.542 0 1.007.465 1.113 1.113l.113.448c.135.542-.198 1.092-.646 1.385l-.44.293c-.44.292-.646.833-.646 1.385v.448c0 .542.465 1.007 1.113 1.113l.448.113c.542.135 1.092-.198 1.385-.646l.293-.44c.292-.44.833-.646 1.385-.646h.448c.542 0 1.007.465 1.113 1.113l.113.448c.135.542-.198 1.092-.646 1.385l-.44.293c-.44.292-.646.833-.646 1.385v.448c0 .542.465 1.007 1.113 1.113l.448.113c.542.135.198 1.092-.646 1.385l-.44.293c-.44.292-.833.646-1.385.646h-.448c-.542 0-1.007-.465-1.113-1.113l-.113-.448c-.135-.542.198-1.092.646-1.385l.44-.293c.44-.292.646-.833.646-1.385v-.448c0-.542-.465-1.007-1.113-1.113l-.448-.113c-.542-.135-1.092.198-1.385.646l-.293.44c-.292.44-.833.646-1.385.646h-.448c-.542 0-1.007-.465-1.113-1.113l-.113-.448c-.135-.542.198-1.092.646-1.385l.44-.293c.44-.292.646-.833.646-1.385v-.448c0-.542-.465-1.007-1.113-1.113l-.448-.113c-.542-.135-.198-1.092.646-1.385l.44-.293c.44-.292.833-.646 1.385.646h.448c.542 0 1.007.465 1.113 1.113l.113.448c.135.542-.198 1.092-.646 1.385l-.44.293c-.44.292-.646.833-.646 1.385v.448c0 .542.465 1.007 1.113 1.113l.448.113c.542.135 1.092-.198 1.385-.646l.293-.44c.293-.44.833-.646 1.385-.646h.448c.542 0 1.007.465 1.113 1.113l.113.448c.135.542-.198 1.092-.646 1.385l-.44.293c-.44.292-.646.833-.646 1.385v.448c0 .542.465 1.007 1.113 1.113l.448.113c.542.135.198 1.092-.646 1.385l-.44.293c-.44.292-.833.646-1.385.646h-.448c-.542 0-1.007-.465-1.113-1.113l-.113-.448c-.135-.542.198-1.092.646-1.385l.44-.293c.44-.292.646-.833.646-1.385v-.448c0-.542-.465-1.007-1.113-1.113l-.448-.113c-.542-.135-1.092.198-1.385.646l-.293.44c-.292-.44-.833-.646-1.385.646h-.448c-.542 0-1.007-.465-1.113-1.113l-.113-.448c-.135-.542.198-1.092.646-1.385l.44-.293c.44-.292.646-.833.646-1.385v-.448z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

function Main() {
    const [topic, setTopic] = useState<string>('');
    const [essay, setEssay] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [language, setLanguage] = useState<string>('English');
    const [apiKey, setApiKey] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [apiState, setApiState] = useState<{
        loading: boolean;
        error: string | null;
        success: string | null;
        score: ScoringResponse | null;
    }>({
        loading: false,
        error: null,
        success: null,
        score: null,
    });
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isApiKeyVisible, setIsApiKeyVisible] = useState<boolean>(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<UserDetails>('/api/main/info/')
                const { user_email, api_key, language } = response.data
                setUserEmail(user_email)
                if (api_key) setApiKey(api_key);
                if (language) setLanguage(language);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        navigate('/login')
                    } else {
                        const serverError = err.response?.data?.detail || 'Something went wrong while fetching user data.'
                        setApiState(prev => ({ ...prev, error: serverError }))
                    }
                }
            };
        };
        fetchData()
    }, [navigate]);

    useEffect(() => {
        if (apiState.score && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [apiState.score]);
    
    const update_data = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { user_language: language, api_key: apiKey }
        setUpdateLoading(true);
        setApiState(prev => ({ ...prev, error: null, success: null }));
        try {
            await apiClient.post('/api/main/storage/', payload)
            setApiState(prev => ({ ...prev, success: "Settings updated successfully!" }));
            setTimeout(() => {
                setIsSettingsOpen(false);
                setApiState(prev => ({ ...prev, success: null }));
            }, 1500);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Failed to update settings.'
                setApiState(prev => ({ ...prev, error: serverError }));
            };
        } finally {
            setUpdateLoading(false);
        };
    };

    const scoring = async () => {
        if (!topic.trim() && !essay.trim()) { setApiState(prev => ({ ...prev, error: "Topic and Essay fields are empty." })); return; };
        if (!topic.trim()) { setApiState(prev => ({ ...prev, error: "Please enter the essay topic." })); return; };
        if (!essay.trim()) { setApiState(prev => ({ ...prev, error: "Please enter your essay." })); return; };
        setApiState({ loading: true, error: null, success: null, score: null });
        try {
            const params = { model: model, input_topic: topic, input_essay: essay };
            const response = await apiClient.post<ScoringResponse>('/api/main/response/', params);
            setApiState(prev => ({ ...prev, loading: false, score: response.data }))
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'An error occurred during scoring.'
                setApiState(prev => ({ ...prev, loading: false, error: serverError }));
            } else {
                setApiState(prev => ({ ...prev, loading: false, error: 'An unexpected error occurred' }));
            }
        };
    };

    const Logout = () => {
        setLogoutLoading(true);
        setApiState(prev => ({ ...prev, success: null, error: null }));
        try {
            localStorage.removeItem('accessToken')
            navigate('/login')
        } catch (err) {
            console.log(err);
            setApiState(prev => ({ ...prev, error: "Logout failed" }));
            setLogoutLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure? This action cannot be undone and will permanently delete your account.")) {
            setDeleteLoading(true);
            setApiState(prev => ({ ...prev, error: null, success: null }));
            try {
                await apiClient.delete('/api/main/user/delete');
                localStorage.removeItem('accessToken');
                navigate('/login');
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const serverError = err.response?.data?.detail || 'Failed to delete account.';
                    setApiState(prev => ({ ...prev, error: serverError }));
                }
                setDeleteLoading(false);
            }
        }
    };

    const clearInputs = () => {
        setTopic('');
        setEssay('');
        setApiState(prev => ({ ...prev, error: null, score: null, success: null }));
    };

    const handleSelectModel = (modelId: string) => {
        setModel(modelId);
        setIsModelDropdownOpen(false);
    };

    const handleSelectLanguage = (langCode: string) => {
        setLanguage(langCode);
        setIsLangDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold text-red-600">IELTS™ Scorer</h1>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="relative">
                                <button onClick={() => setIsModelDropdownOpen(prev => !prev)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed">
                                    {availableModels.find(m => m.id === model)?.name || 'Select Model'}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out ${isModelDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="py-1">
                                        {availableModels.map(m => (
                                            <button key={m.id} onClick={() => handleSelectModel(m.id)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed">
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setIsLangDropdownOpen(prev => !prev)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed">
                                    {availableLanguages.find(l => l.code === language)?.name || 'Select Language'}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out ${isLangDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="py-1">
                                        {availableLanguages.map(l => (
                                            <button key={l.code} onClick={() => handleSelectLanguage(l.code)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed">
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsSettingsOpen(prev => !prev)} className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed">
                            <GearIcon className="w-6 h-6 text-slate-600" />
                        </button>
                        <div className={`absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-300 ease-in-out ${isSettingsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                           <form onSubmit={update_data} className="p-4 space-y-4">
                                <div className="border-b pb-2">
                                    <p className="text-sm font-medium text-slate-900">Account</p>
                                    <p className="text-sm text-slate-500 truncate">{userEmail}</p>
                                </div>
                                <div>
                                    <label htmlFor="api_key" className="block text-sm font-medium text-slate-700 mb-1">Google AI API Key</label>
                                    <div className="relative">
                                        <input 
                                            id="api_key" 
                                            type={isApiKeyVisible ? 'text' : 'password'} 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        />
                                        <button type="button" onClick={() => setIsApiKeyVisible(prev => !prev)} className="absolute inset-y-0 right-0 px-3 text-slate-400 cursor-pointer disabled:cursor-not-allowed">
                                            {isApiKeyVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={updateLoading} className="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-700 disabled:bg-slate-400 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed">
                                    {updateLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Update Settings'}
                                </button>
                                <div className="border-t pt-4 space-y-2">
                                     <button type="button" onClick={Logout} disabled={logoutLoading} className="w-full bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed">
                                        {logoutLoading ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : 'Log Out'}
                                    </button>
                                    <button type="button" onClick={handleDeleteAccount} disabled={deleteLoading} className="w-full text-red-600 text-sm font-medium hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                                        {deleteLoading ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                           </form>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6 md:p-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    {apiState.error && (
                         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{apiState.error}</p>
                        </div>
                    )}
                    {apiState.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Success</p>
                            <p>{apiState.success}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="topic" className="block text-lg font-semibold text-slate-800 mb-2">Essay Topic</label>
                        <div className="relative">
                            <textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion."
                                className="w-full h-28 p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                rows={3}
                            />
                            {topic && (
                                <button onClick={() => setTopic('')} className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div>
                         <label htmlFor="essay" className="block text-lg font-semibold text-slate-800 mb-2">Your Essay</label>
                         <textarea
                            id="essay"
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                            placeholder="Start writing your essay here..."
                            className="w-full h-96 p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            rows={15}
                        />
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <button onClick={clearInputs} className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-300 transform active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed">
                           Clear
                        </button>
                         <button onClick={scoring} disabled={apiState.loading} className="px-10 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed">
                            {apiState.loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Scoring...</span>
                                </div>
                            ) : "Get Score"}
                        </button>
                    </div>
                </div>

                {apiState.score && (
                    <section ref={resultsRef} className="mt-16 pt-10 max-w-4xl mx-auto animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 bg-cover bg-no-repeat" style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(254 226 226)'%3e%3cpath d='M0 .5 L31.5 .5 M.5 0 V31.5'/%3e%3c/svg%3e\")"}}>
                           <div className="text-center mb-10">
                                <h2 className="text-2xl font-light text-slate-600">Overall Score</h2>
                                <p className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-orange-500">{apiState.score.Overall_score.toFixed(1)}</p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200/80 text-center">
                                    <h3 className="font-semibold text-slate-500 mb-1">Task Response (TR)</h3>
                                    <p className="text-5xl font-bold text-red-500">{apiState.score.TR.toFixed(1)}</p>
                                </div>
                                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200/80 text-center">
                                    <h3 className="font-semibold text-slate-500 mb-1">Coherence & Cohesion (CC)</h3>
                                    <p className="text-5xl font-bold text-red-500">{apiState.score.CC.toFixed(1)}</p>
                                </div>
                                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200/80 text-center">
                                    <h3 className="font-semibold text-slate-500 mb-1">Lexical Resource (LR)</h3>
                                    <p className="text-5xl font-bold text-red-500">{apiState.score.LR.toFixed(1)}</p>
                                </div>
                                <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200/80 text-center">
                                    <h3 className="font-semibold text-slate-500 mb-1">Grammatical Range & Accuracy (GRA)</h3>
                                    <p className="text-5xl font-bold text-red-500">{apiState.score.GRA.toFixed(1)}</p>
                                </div>
                           </div>

                           <div className="space-y-8">
                               <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 pb-2 border-b-2 border-orange-500 inline-block">Reason for Score</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{apiState.score.reason}</p>
                               </div>
                               <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 pb-2 border-b-2 border-orange-500 inline-block">Areas for Improvement</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{apiState.score.improvement}</p>
                               </div>
                           </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default Main;