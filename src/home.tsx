import React from 'react';
import { useNavigate } from 'react-router-dom';

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 5.472m0 0a9.09 9.09 0 00-3.246 1.598 3 3 0 004.664 1.748M16.03 4.056a4.5 4.5 0 01-1.456 6.044l-.383.222a.5.5 0 01-.75-.433V6.862a4.5 4.5 0 00-1.64-3.634.5.5 0 01.375-.854 4.49 4.49 0 013.854 1.682z" />
    </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

// --- Components ---

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <h1 className="text-2xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                            <span>BANDSENSE</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-700 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-100 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-100 blur-3xl opacity-50 pointer-events-none"></div>

                <div className="container mx-auto px-6 py-16 md:py-24 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide uppercase">
                        AI-Powered Essay Evaluation
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Write Better.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                            Score Higher.
                        </span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                        Instant, accurate IELTS writing scores powered by Gemini AI. 
                        Access a massive library of high-scoring essays and join a community of learners improving together.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center ">
                        <button 
                            onClick={() => navigate('/')}
                            className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-orange-500/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                        >
                            Try Now !
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={() => navigate('/playground')}
                            className="px-10 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                        >
                            Visit Playground
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white py-20 border-t border-slate-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <SparklesIcon className="w-8 h-8 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant AI Scoring</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Get detailed breakdowns on Task Response, Cohesion, Lexical Resource, and Grammar. Understand exactly why you got that score.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BookOpenIcon className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Rich Essay Library</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Browse thousands of essays sorted by topic and band score. Learn from Band 9 examples and find inspiration for your next writing task.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <UserGroupIcon className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Community Sharing</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Publish your best work to the leaderboard. Review essays from other users worldwide and exchange feedback to improve faster.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mini Callout Section */}
                <div className="py-20 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="20" />
                        </svg>
                    </div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to improve your Writing score?</h2>
                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of students using AI to pinpoint their weaknesses and turn them into strengths.
                        </p>
                        <button 
                            onClick={() => navigate('/register')}
                            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-red-600">BANDSENSE</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © {new Date().getFullYear()} BANDSENSE. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-600 text-sm font-medium">
                        <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;