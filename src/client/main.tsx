import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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
    { id: 'gemini-flash-latest', name: 'Gemini 2.5 Flash Latest' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro'}
];


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


const CloudUploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
);

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const AnimatedNumber = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Ease-out Quart cubic bezier approximation
            
            setDisplayValue(progress * value); 

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [value, duration]);

    return <span>{displayValue.toFixed(1)}</span>;
};

const ScoreBar = ({ label, score }: { label: string, score: number }) => {
    // IELTS score is out of 9
    const percentage = Math.min((score / 9) * 100, 100);
    
    return (
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-2">
                <h3 className="font-semibold text-slate-600 text-sm">{label}</h3>
                <span className="text-2xl font-bold text-red-600"><AnimatedNumber value={score} duration={1000} /></span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

function Main() {
    const [topic, setTopic] = useState<string>('');
    const [essay, setEssay] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [language, setLanguage] = useState<string>('English');
    const [apiKey, setApiKey] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    
    // State to hold the ID of the topic if user came from playground
    const [topicId, setTopicId] = useState<string | null>(null);

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
    const [publishLoading, setPublishLoading] = useState<boolean>(false);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [isApiKeyVisible, setIsApiKeyVisible] = useState<boolean>(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch User Info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get<UserDetails>('/main/user/info/')
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

    // Check for state passed from Playground (Practice Mode)
    useEffect(() => {
        if (location.state && location.state.topicText) {
            setTopic(location.state.topicText);
            setTopicId(location.state.topicId);
            // Optionally clear history state to clean up, but keeping it is fine too
        }
    }, [location]);

    // Auto-scroll to results
    useEffect(() => {
        if (apiState.score && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [apiState.score]);
    
    // --- Actions ---

    const update_data = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { user_language: language, api_key: apiKey }
        setUpdateLoading(true);
        setApiState(prev => ({ ...prev, error: null, success: null }));
        try {
            await apiClient.post('/main/user/storage/', payload)
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

    const update_lang = async () => {
        const payload = { user_language: language, api_key: apiKey }
        setUpdateLoading(true);
        setApiState(prev => ({ ...prev, error: null, success: null }));
        try {
            await apiClient.post('/main/user/storage/', payload)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Failed to update settings.'
                setApiState(prev => ({ ...prev, error: serverError }));
            };
        } finally {
            setUpdateLoading(false);
        };
    };
    
    const handleTrySample = () => {
        setTopic("Some people think that math is the most important for schoolchildren, while many others think that other subjects are more important. Discuss both these views and give your own opinion.");
        setEssay(`It is often argued that mathematics is the most crucial subject for schoolchildren, while others believe that a broader range of subjects holds greater importance. Although mathematics undoubtedly plays a fundamental role in students’ academic development, I believe that other subjects are equally vital in preparing young people for a well-rounded future.

On the one hand, mathematics is considered indispensable for several reasons. First, it fosters logical thinking and problem-solving skills, which are applicable not only in science-related fields but also in everyday life. For example, understanding percentages helps individuals manage personal finances and make rational decisions. Second, math forms the backbone of many high-demand careers such as engineering, data science, and finance. In a world increasingly driven by technology and algorithms, a solid foundation in mathematics gives students a competitive advantage. Therefore, supporters argue that math deserves a central role in school curriculums.

On the other hand, focusing exclusively on mathematics may undermine the broader educational needs of students. Subjects such as literature, history, and the arts contribute significantly to emotional intelligence, cultural awareness, and creativity. These qualities are essential for personal development and social harmony. Moreover, practical subjects like physical education or life skills classes promote health and well-being, which are necessary for long-term success. Additionally, not all students excel in or enjoy mathematics; allowing them to explore other fields can help them discover their strengths and pursue a career aligned with their interests.

In my view, no single subject should be regarded as the most important. Instead, education should aim for balance. While math is undeniably valuable, modern societies require diverse talents: scientists, artists, communicators, healthcare workers, and innovators. A curriculum that encourages students to develop both analytical and creative abilities equips them with a broader skill set to navigate an uncertain future.

In conclusion, although mathematics plays a key role in developing logical skills and preparing students for technical careers, other subjects are equally important for fostering creativity, cultural understanding, and personal growth. A balanced approach to education is, therefore, the most beneficial for schoolchildren.`);
        // Clear topic ID since this is a generic sample, not linked to the DB yet
        setTopicId(null);
    };

    const scoring = async () => {
        if (!topic.trim() && !essay.trim()) { setApiState(prev => ({ ...prev, error: "Topic and Essay fields are empty." })); return; };
        if (!topic.trim()) { setApiState(prev => ({ ...prev, error: "Please enter the essay topic." })); return; };
        if (!essay.trim()) { setApiState(prev => ({ ...prev, error: "Please enter your essay." })); return; };
        
        setApiState({ loading: true, error: null, success: null, score: null });
        try {
            const params = { model: model, input_topic: topic, input_essay: essay };
            const response = await apiClient.post<ScoringResponse>('/main/response/', params);
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

    // For publish essay
    const PostEssay = async () => {
        if (!topicId) {
            setApiState(p => ({...p, error: 'This essay cannot be published (No Topic ID found).'}));
            return;
        }
        if (!apiState.score) {
             setApiState(p => ({...p, error: 'Please get a score first.'}));
             return;
        }

        setPublishLoading(true);
        setApiState(p => ({...p, error: null, success: null}));
        
        try{
            const params = {
                Overall_score: apiState.score.Overall_score,
                TR: apiState.score.TR,
                LR: apiState.score.LR,
                CC: apiState.score.CC,
                GRA: apiState.score.GRA,
                reason: apiState.score.reason,
                improvement: apiState.score.improvement,
                content: essay
            }

            await apiClient.post(`/main/topic/${topicId}/essays`, params);
            
            setApiState(p => ({...p, success: "Essay published to leaderboard successfully!"}));
            // Clear topicId to prevent duplicate publishing
            setTopicId(null); 
        } catch(err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Failed to publish essay.'
                setApiState(p => ({ ...p, error: serverError}))
            } else {
                setApiState(p => ({ ...p, error: "An unexpected error occurred."}))
            }
        } finally {
            setPublishLoading(false);
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
                await apiClient.delete('/main/user/delete');
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
        setTopicId(null); // Also clear the topic association
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
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <h1 className="text-2xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                            <span>BANDIFY</span>
                        </h1>
                        <div className="hidden md:flex items-center gap-6">
                            {/* Model Selector */}
                            <div className="relative group">
                                <label className="block text-xs font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">Model</label>
                                <button onClick={() => setIsModelDropdownOpen(prev => !prev)} className="flex items-center justify-between gap-3 min-w-[180px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-300 hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed">
                                    <span className="truncate">{availableModels.find(m => m.id === model)?.name || 'Select Model'}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 origin-top-left transition-all duration-200 ease-out z-20 ${isModelDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                    <div className="py-2">
                                        {availableModels.map(m => (
                                            <button key={m.id} onClick={() => handleSelectModel(m.id)} className="w-full text-left cursor-pointer block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-8 w-px bg-slate-200"></div>

                            {/* Language Selector */}
                            <div className="relative group">
                                <label className="block text-xs font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">Output language</label>
                                <button onClick={() => setIsLangDropdownOpen(prev => !prev)} className="flex items-center justify-between gap-3 min-w-[140px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-300 hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed">
                                    <span className="truncate">{availableLanguages.find(l => l.code === language)?.name || 'Select Language'}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 origin-top-left transition-all duration-200 ease-out z-20 ${isLangDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                    <div className="py-2">
                                        {availableLanguages.map(l => (
                                            <button key={l.code} onClick={() => {handleSelectLanguage(l.code) ; update_lang()}} className="w-full text-left block px-4 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         {/* Playground Button */}
                         <button 
                            onClick={() => navigate('/playground')} 
                            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95 group relative"
                            title="Go to Playground"
                        >
                            <p>Playground</p>
                            <span className="absolute top-full right-0 mt-1 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Playground
                            </span>
                        </button>

                        {/* Settings Button & Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsSettingsOpen(prev => !prev)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95">
                                <p>Settings</p>
                            </button>
                            <div className={`absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-300 ease-cubic-bezier ${isSettingsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                            <form onSubmit={update_data} className="p-5 space-y-5">
                                    <div className="border-b border-slate-100 pb-3">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Signed in as</p>
                                        <p className="text-sm font-medium text-slate-800 truncate">{userEmail}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="api_key" className="block text-sm font-medium text-slate-700 mb-1.5">Google AI API Key</label>
                                        <div className="relative">
                                            <input 
                                                id="api_key" 
                                                type={isApiKeyVisible ? 'text' : 'password'} 
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                                                placeholder="sk-..."
                                            />
                                            <button type="button" onClick={() => setIsApiKeyVisible(prev => !prev)} className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                                {isApiKeyVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={updateLoading} className="w-full bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-700 disabled:bg-slate-400 shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer">
                                        {updateLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Update Settings'}
                                    </button>
                                    <div className="border-t border-slate-100 pt-4 space-y-3">
                                        <button type="button" onClick={Logout} disabled={logoutLoading} className="w-full bg-white border border-red-200 text-red-600 font-semibold py-2.5 px-4 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer">
                                            {logoutLoading ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : 'Log Out'}
                                        </button>
                                        <button type="button" onClick={handleDeleteAccount} disabled={deleteLoading} className="w-full text-red-500 text-xs font-medium hover:underline disabled:opacity-50 cursor-pointer text-center block">
                                            {deleteLoading ? 'Deleting...' : 'Delete Account'}
                                        </button>
                                    </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Error Message */}
                    {apiState.error && (
                         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm flex items-start gap-3" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div>
                                <p className="font-bold">Error</p>
                                <p className="text-sm">{apiState.error}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Success Message */}
                    {apiState.success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm flex items-start gap-3" role="alert">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <div>
                                <p className="font-bold">Success</p>
                                <p className="text-sm">{apiState.success}</p>
                            </div>
                        </div>
                    )}

                    {/* Topic Input Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <label htmlFor="topic" className="block text-lg font-bold text-slate-800 mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                                Essay Topic
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Try Sample Button */}
                                <button
                                    type="button"
                                    onClick={handleTrySample}
                                    className="text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-full transition-colors cursor-pointer border border-orange-200"
                                >
                                    Try sample!
                                </button>

                                {/* Practice Mode Indicator */}
                                {topicId && (
                                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                                        <PencilIcon className="w-3 h-3" /> Practice Mode
                                    </span>
                                )}
                            </div>
                        </label>
                        <div className="relative group">
                            <textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this..."
                                className={`w-full h-32 p-4 border rounded-xl bg-slate-50 focus:bg-white shadow-inner focus:ring-2 transition-all resize-none text-slate-700 placeholder:text-slate-400 ${topicId ? 'border-green-200 focus:border-green-400 focus:ring-green-100' : 'border-slate-200 focus:border-orange-400 focus:ring-orange-200'}`}
                            />
                            {topic && (
                                <button onClick={() => setTopic('')} className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:bg-white hover:text-red-500 hover:shadow-md transition-all cursor-pointer">
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Essay Input Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                         <label htmlFor="essay" className="block text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                             Your Essay
                         </label>
                         <div className="relative group">
                            <textarea
                                id="essay"
                                value={essay}
                                onChange={(e) => setEssay(e.target.value)}
                                placeholder="Start writing your essay here..."
                                className="w-full h-[400px] p-5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white shadow-inner focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all resize-none text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed"
                            />
                            {essay && (
                                <button onClick={() => setEssay('')} className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:bg-white hover:text-red-500 hover:shadow-md transition-all cursor-pointer">
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            )}                        
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={clearInputs} className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transform active:scale-95 transition-all cursor-pointer">
                           Clear All
                        </button>
                         <button onClick={scoring} disabled={apiState.loading} className="min-w-[180px] px-10 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/30 transform active:scale-95 transition-all disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none cursor-pointer flex justify-center items-center">
                            {apiState.loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Scoring...</span>
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Get Score 
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Score Results Section */}
                {apiState.score && (
                    <section ref={resultsRef} className="mt-20 max-w-5xl mx-auto">
                        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                           {/* Decorative background */}
                           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600"></div>
                           <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="300" cy="100" r="200" fill="url(#paint0_radial)" />
                                    <defs>
                                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 100) rotate(90) scale(200)">
                                            <stop stopColor="#F97316" />
                                            <stop offset="1" stopColor="white" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>
                                </svg>
                           </div>

                           <div className="p-8 md:p-12">
                               <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12 border-b border-slate-100 pb-12">
                                   <div className="text-center md:text-left flex-1">
                                        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 mb-2">
                                            <h2 className="text-3xl font-bold text-slate-800">Evaluation Results</h2>
                                            
                                            {/* Publish Button - Visible only when topicId is present */}
                                            {topicId && (
                                                <button 
                                                    onClick={() => PostEssay()} 
                                                    disabled={publishLoading}
                                                    className="md:ml-2 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-md hover:bg-slate-700 hover:-translate-y-0.5 active:scale-95 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                >
                                                    {publishLoading ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <CloudUploadIcon className="w-5 h-5" />
                                                    )}
                                                    Publish to Leaderboard
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-slate-500">Analysis provided by AI Model based on IELTS criteria.</p>
                                   </div>
                                   
                                   <div className="relative flex flex-col items-center justify-center p-4">
                                        <div className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-2">Overall Band Score</div>
                                        <div className="relative w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-[0_0_40px_-10px_rgba(234,88,12,0.3)] border-4 border-slate-50">
                                            {/* Ring Background */}
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                                <circle 
                                                    cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="0"
                                                    className="animate-[dash_1.5s_ease-out_forwards]"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#f97316" />
                                                        <stop offset="100%" stopColor="#dc2626" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-600">
                                                <AnimatedNumber value={apiState.score.Overall_score} />
                                            </span>
                                        </div>
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    <ScoreBar label="Task Response" score={apiState.score.TR} />
                                    <ScoreBar label="Coherence & Cohesion" score={apiState.score.CC} />
                                    <ScoreBar label="Lexical Resource" score={apiState.score.LR} />
                                    <ScoreBar label="Grammar Range" score={apiState.score.GRA} />
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">Feedback & Analysis</h3>
                                        </div>
                                        <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {apiState.score.reason}
                                        </div>
                                   </div>

                                   <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200/60">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-orange-200 rounded-lg text-orange-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">Areas for Improvement</h3>
                                        </div>
                                        <div className="prose prose-sm prose-orange max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {apiState.score.improvement}
                                        </div>
                                   </div>
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