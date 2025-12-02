import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig"; // 假设路径一致
import './client.css'; // 假设样式通用

// --- Types ---

interface Topic {
    topic_id: string;
    topic: string;
}

// 修改：根据 views.py 的结构更新 Essay 接口
interface Essay {
    essay_id: string;
    user_id: string;
    content: string;
    published_date: string;
    // 扁平化的分数结构
    Overall_score: number;
    TR: number;
    LR: number;
    CC: number;
    GRA: number;
    reason: string;
    improvement: string;

    author?: {
        username?: string;
        email?: string;
    }
}

interface RankData {
    topic: Topic;
    score_rank: Essay[];
    time_rank: Essay[];
}

// --- Icons (Reused & New) ---

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 10-4.5 0v5.625m0 0h4.5m-4.5 0a2.25 2.25 0 00-2.25 2.25v1.375c0 .621.504 1.125 1.125 1.125h.872m5.007 0v1.375c0 .621-.504 1.125-1.125 1.125h-.872m-8.128-4.637l.09.02a3.75 3.75 0 003.882-2.52l.22-.66a1.5 1.5 0 00-1.423-1.92h-1.35c-.776 0-1.488.384-1.912 1.026-.51.764-.707 1.688-.564 2.596l.112.756c.07.464.472.802.942.722zm13.196-6.19c-.424-.642-1.136-1.026-1.912-1.026h-1.35a1.5 1.5 0 00-1.423 1.92l.22.66a3.75 3.75 0 003.882 2.52l.09-.02c.47-.08.872-.418.942-.722l.112-.756c.143-.908-.054-1.832-.564-2.596z" />
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

// --- Reuse Animation Components from Main ---
const AnimatedNumber = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setDisplayValue(progress * value);
            if (progress < 1) animationFrameId = requestAnimationFrame(animate);
            else setDisplayValue(value);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value, duration]);
    return <span>{displayValue.toFixed(1)}</span>;
};

const ScoreBar = ({ label, score }: { label: string, score: number }) => {
    const percentage = Math.min((score / 9) * 100, 100);
    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-2">
                <h3 className="font-semibold text-slate-600 text-xs uppercase tracking-wide">{label}</h3>
                <span className="text-xl font-bold text-slate-800"><AnimatedNumber value={score} duration={1000} /></span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

// --- Helper Functions ---

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- Main Component ---

function Playground() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Navigation State
    const [viewState, setViewState] = useState<'list' | 'topic_detail' | 'rank_list' | 'essay_detail'>('list');
    
    // Data State
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [rankData, setRankData] = useState<RankData | null>(null);
    const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
    const [rankSort, setRankSort] = useState<'score' | 'time'>('score');

    const HomeFloatingButton = () => (
        <button
            onClick={() => navigate('/')}
            className="fixed top-6 right-6 z-50 p-3 bg-white rounded-full shadow-lg border border-slate-200 text-slate-500 hover:text-orange-600 hover:shadow-orange-100 transition-all cursor-pointer group"
            title="Go Home"
        >
            <HomeIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
    );

    // Fetch Topics on Mount
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await apiClient.get<Topic[]>('/main/topics/');
                setTopics(res.data);
                setLoading(false);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError("Failed to load topics.");
                    setLoading(false);
                }
            }
        };
        fetchTopics();
    }, [navigate]);

    // Handlers
    const handleTopicClick = (topic: Topic) => {
        setSelectedTopic(topic);
        setViewState('topic_detail');
    };

    const handleRankClick = async () => {
        if (!selectedTopic) return;
        setLoading(true);
        try {
            const res = await apiClient.get<RankData>(`/main/topic/${selectedTopic.topic_id}/essays`);
            setRankData(res.data);
            setViewState('rank_list');
        } catch (err) {
            alert("Failed to fetch ranking data.");
        } finally {
            setLoading(false);
        }
    };

    const handleEssayClick = (essay: Essay) => {
        setSelectedEssay(essay);
        setViewState('essay_detail');
    };

    const handleBack = () => {
        if (viewState === 'essay_detail') setViewState('rank_list');
        else if (viewState === 'rank_list') setViewState('topic_detail');
        else if (viewState === 'topic_detail') setViewState('list');
    };

    // --- Renders ---

    // 1. Loading / Error
    if (loading && viewState === 'list') {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    // 2. Topic List View
    if (viewState === 'list') {
        return (
            <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12 relative">
                 <HomeFloatingButton />
                 
                 <div className="max-w-6xl mx-auto">
                    <header className="mb-10 text-center md:text-left pr-16">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span className="p-2 bg-orange-100 rounded-lg text-orange-600"><ChartBarIcon className="w-8 h-8"/></span>
                            Topic Playground
                        </h1>
                        <p className="text-slate-500 mt-2 ml-1">Browse published topics and compare essays from the community.</p>
                    </header>
                    
                    {error ? (
                         <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((t) => (
                                <div 
                                    key={t.topic_id} 
                                    onClick={() => handleTopicClick(t)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between h-64"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Topic</span>
                                        </div>
                                        <p className="text-slate-800 font-medium line-clamp-4 group-hover:text-orange-600 transition-colors">
                                            {t.topic}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end mt-4">
                                        <span className="text-sm font-semibold text-slate-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View Details <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        );
    }

    // 3. Topic Detail View
    if (viewState === 'topic_detail' && selectedTopic) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col relative">
                <HomeFloatingButton />

                <div className="flex-1 container mx-auto p-6 md:p-12 flex items-center justify-center">
                    <div className="bg-white w-full max-w-3xl p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 relative">
                        <button onClick={handleBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="mt-8">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">Current Topic</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed pr-8">
                                {selectedTopic.topic}
                            </h2>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4">
                             <button 
                                onClick={() => navigate('/', { 
                                    state: { 
                                        topicText: selectedTopic.topic, 
                                        topicId: selectedTopic.topic_id 
                                    } 
                                })}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-full font-bold shadow-lg hover:bg-orange-700 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all active:scale-95 cursor-pointer"
                            >
                                <PencilIcon className="w-5 h-5" />
                                <span>Practice This</span>
                             </button>

                             <button 
                                onClick={handleRankClick}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 cursor-pointer"
                            >
                                <TrophyIcon className="w-6 h-6 text-yellow-400" />
                                <span>View Rankings</span>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Rank List View
    if (viewState === 'rank_list' && rankData) {
        const essays = rankSort === 'score' ? rankData.score_rank : rankData.time_rank;

        return (
            <div className="min-h-screen bg-slate-50 p-6 md:p-8 relative">
                 <HomeFloatingButton />

                 <div className="max-w-4xl mx-auto bg-white min-h-[80vh] rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 pr-16">
                        <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer">
                             <ChevronLeftIcon className="w-5 h-5" /> Back to Topic
                        </button>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setRankSort('score')} 
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${rankSort === 'score' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                            >
                                Score
                            </button>
                            <button 
                                onClick={() => setRankSort('time')} 
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${rankSort === 'time' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                            >
                                Time
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {essays.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">No essays submitted yet.</div>
                        ) : (
                            essays.map((e, index) => {
                                const scoreDisplay = e.Overall_score;
                                const username = e.user?.username || e.author?.username || "Anonymous User";
                                
                                return (
                                    <div 
                                        key={e.essay_id} 
                                        onClick={() => handleEssayClick(e)}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 && rankSort === 'score' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-700 flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-slate-400"/>
                                                    {username}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <ClockIcon className="w-3 h-3"/> {formatDate(e.published_date)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                                {scoreDisplay.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Band</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                 </div>
            </div>
        );
    }

    // 5. Essay Detail View
    if (viewState === 'essay_detail' && selectedEssay && selectedTopic) {
        const overall = selectedEssay.Overall_score;
        const username = selectedEssay.user?.username || selectedEssay.author?.username || "Anonymous";

        return (
            <div className="min-h-screen bg-slate-50 p-6 md:p-8 relative">
                <HomeFloatingButton />

                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Header / Nav */}
                    <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors mb-4 cursor-pointer">
                        <ChevronLeftIcon className="w-5 h-5" /> Back to Rankings
                    </button>

                    {/* Score Dashboard */}
                     <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div>
                                <h2 className="text-2xl font-bold mb-1">{username}'s Essay</h2>
                                <p className="text-slate-400 text-sm">Published on {formatDate(selectedEssay.published_date)}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                                    {overall.toFixed(1)}
                                </span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Overall Band</span>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
                            <ScoreBar label="Task Response" score={selectedEssay.TR} />
                            <ScoreBar label="Coherence" score={selectedEssay.CC} />
                            <ScoreBar label="Lexical" score={selectedEssay.LR} />
                            <ScoreBar label="Grammar" score={selectedEssay.GRA} />
                        </div>
                     </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Topic</h3>
                            <p className="text-slate-700 font-medium leading-relaxed">{selectedTopic.topic}</p>
                        </div>

                        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Essay Content</h3>
                             <div className="prose prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-wrap font-serif">
                                {selectedEssay.content}
                             </div>

                             {(selectedEssay.reason || selectedEssay.improvement) && (
                                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 gap-6">
                                    {selectedEssay.reason && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Feedback</h4>
                                            <p className="text-slate-600 text-sm">{selectedEssay.reason}</p>
                                        </div>
                                    )}
                                    {selectedEssay.improvement && (
                                        <div>
                                            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">Improvement</h4>
                                            <p className="text-slate-600 text-sm">{selectedEssay.improvement}</p>
                                        </div>
                                    )}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default Playground;