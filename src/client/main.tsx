import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'client.css'
import axios from 'axios'
import apiClient from "../axiosConfig";
import type { Language, Model } from "./def";

interface UserDetails {
    email: string;
    api_key: string | null;
    language: string | null;
};

const availableLanguages: Language[] = [
    {code: 'English', name: 'English'},
    {code: 'French', name: 'French'},
    {code: 'Chinese', name: 'Chinese (simplified)'},
    {code: 'Spanish', name: 'Spanish'},
    {code: 'Japenese', name: 'Janpanese'},
];

const availableModels: Model[] = [
    {id: 'gemini-2.5-flash', name: 'Gemini 2.5 flash'},
    {id: 'gemini-2.5-pro', name: 'Gemini 2.5 pro'},
];

function Main() {
    const [topic, setTopic] = useState<string>('');
    const [essay, setEssay] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [language, setLanguage] = useState<string>('English');
    const [apiKey, setApiKey] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [apiState, setApiState] = useState<{ // A more efficient react state updater, https://react.dev/learn/updating-objects-in-state#updating-a-nested-object
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

    const resultsRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await apiClient.get<UserDetails>('/api/main/user/me')
                const {email, api_key, language} = response.data
                setUserEmail(email)
                if (api_key) setApiKey(api_key);
                if (language) setLanguage(language);
            } catch (err) {
                if (axios.isAxiosError(err)){
                    const serverError = err.response?.data?.detail || 'Something went wrong'
                    setApiState(prev => ({...prev, error: serverError}))
                };
            };
        };
        fetchData()
    }, []);
    // Auto-scroll effect
    useEffect(() => {
        if (apiState.score && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [apiState.score]);

    const update_data = async (e: {preventDefault: () => void}) => {
        e.preventDefault();

        const playload = {language: language, api_key: apiKey}

        setUpdateLoading(true);
        setApiState(prev => ({...prev, error: null, success: null}));

        try{
            const response = await apiClient.post('/api/storage', playload)
            console.log("storage success", response.data)
            setApiState(prev => ({...prev, success:"Settings updated successfully!"}));
        } catch(err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Something went wrong'                
                setApiState(prev => ({...prev, error: serverError}));
            };
        } finally {
            setUpdateLoading(false);
        };
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

    const scoring = async () => {

        if (!topic.trim() && !essay.trim()){
            setApiState(prev => ({...prev, error: "Nothing here"}));
            return;
        };

        if (!topic.trim()){
            setApiState(prev => ({...prev, error: "You forget to enter the topic"}));
            return;
        };

        if (!essay.trim()){
            setApiState(prev => ({...prev, error: "Where's the essay?"}));
            return;
        };


        setApiState({ loading: true, error: null, success: null, score: null });


        try{
            const params = {
                selected_model: model,
                topic_input: topic,
                essay_input: essay,
                };    


            const response = await apiClient.post<ScoringResponse>('/api/response', params);
            console.log("success", response.data)
            setApiState(prev => ({...prev, loading: false, score: response.data})) // In HTML part , use apiState.score.CC to fetch data 

        } catch(err) {
            if (axios.isAxiosError(err)){
                const serverError = err.response?.data?.detail || 'Something went wrong'
                setApiState(prev => ({...prev, error: serverError}));
            };
        } finally {
            setApiState(prev => ({...prev, loading: false}));
        };

    };

    const Logout = () => {
        setLogoutLoading(false);
        setApiState(prev => ({...prev, success: null, error: null}));

        try{
            localStorage.removeItem('accessToken')
            setApiState(prev => ({...prev, success: "Logout success"}));
            navigate('/login')
        } catch(err) {
            console.log(err);
            setApiState(prev => ({...prev, error:"Logout failed"}));
        } finally {
            setLogoutLoading(false);
        };
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure? This action cannot be undone and will permanently delete your account.")) {
            setDeleteLoading(true);
            setApiState(prev => ({...prev, error: null, success: null}));
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

    const clear = () => {
        setTopic('');
        setEssay('');
        setApiState(prev => ({ ...prev, error: null, score: null }));
    };

    // --- SVG Icons
    const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.829 15.222c-.655-1.134-.655-2.51 0-3.644.473-.817 1.25-1.422 2.171-1.674v-2.73a.25.25 0 0 0-.203-.246l-2.31-.577a.25.25 0 0 1-.219-.245v-2.31a.25.25 0 0 0-.246-.203h-2.73c-.252.92-.857 1.698-1.674 2.171-1.134.655-2.51.655-3.644 0-.817-.473-1.422-1.25-1.674-2.171h-2.73a.25.25 0 0 0-.246.203v2.31c0 .108-.07.204-.176.236l-2.348.586a.25.25 0 0 0-.203.246v2.73c.92.252 1.698.857 2.171 1.674.655 1.134.655 2.51 0 3.644-.473.817-1.25 1.422-2.171 1.674v2.73a.25.25 0 0 0 .203.246l2.31.577c.101.025.188.112.219.219v2.31a.25.25 0 0 0 .246.203h2.73c.252-.92.857-1.698 1.674-2.171 1.134-.655 2.51-.655 3.644 0 .817.473 1.422 1.25 1.674 2.171h2.73a.25.25 0 0 0 .246-.203v-2.31a.25.25 0 0 1 .219-.245l2.31-.577a.25.25 0 0 0 .203-.246v-2.73c-.92-.252-1.698-.857-2.171-1.674ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>;
    const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.742.742H5.625a.75.75 0 0 1-.742-.742L3.879 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.385 3.965a.75.75 0 0 1 .623.722v10.75a.75.75 0 0 1-1.5 0V7.713a.75.75 0 0 1 .877-.722ZM12 6.963a.75.75 0 0 1 .75.75v10.75a.75.75 0 0 1-1.5 0V7.713a.75.75 0 0 1 .75-.75Zm3.385.722a.75.75 0 0 0-.877.722v10.75a.75.75 0 0 0 1.5 0V7.713a.75.75 0 0 0-.623-.722Z" clipRule="evenodd"/></svg>;
    const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113C21.182 17.022 16.97 20.25 12.001 20.25c-4.97 0-9.185-3.223-10.675-7.69a.75.75 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" /></svg>;
    const EyeSlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM10.72 10.72a3 3 0 0 0 2.56 2.56l-2.56-2.56Zm-3.44 1.78a5.25 5.25 0 0 0 6.88 6.88l-6.88-6.88Zm10.4 1.08-3.52-3.52a5.25 5.25 0 0 0-6.34-6.34L3.98 3.98C2.59 5.39 1.45 7.21.81 9.19c-.75 2.36-.75 4.88 0 7.24 1.49 4.47 5.7 7.69 10.67 7.69 1.57 0 3.09-.28 4.52-.8L17.66 13.58Z" clipRule="evenodd" /></svg>;

        return (
        <div className="main-container">
            <header className="top-bar">
                <div className="selection-container">
                    <div className="select-wrapper">
                        <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
                            {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div className="select-wrapper">
                        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                            {availableLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="settings-container">
                    <button className="icon-button settings-button" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                        <GearIcon />
                    </button>
                    <div className={`settings-panel ${isSettingsOpen ? 'open' : ''}`}>
                        <div className="settings-content">
                            <p className="user-email">{userEmail}</p>
                            <form onSubmit={update_data}>
                                <div className="input-group">
                                    <label htmlFor="api-key">Your API Key</label>
                                    <div className="api-key-wrapper">
                                        <input
                                            id="api-key"
                                            type={isApiKeyVisible ? 'text' : 'password'}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Enter your API key"
                                        />
                                        <button type="button" className="icon-button" onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}>
                                            {isApiKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="button-primary" disabled={updateLoading}>
                                    {updateLoading ? 'Saving...' : 'Save Settings'}
                                </button>
                            </form>
                            <div className="account-actions">
                                <button className="button-danger" onClick={Logout} disabled={logoutLoading}>
                                    {logoutLoading ? 'Logging out...' : 'Log Out'}
                                </button>
                                <button className="button-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="content-body">
                {apiState.error && <div className="notification error">{apiState.error}</div>}
                {apiState.success && <div className="notification success">{apiState.success}</div>}
                
                <div className="input-group">
                    <label htmlFor="topic">Topic</label>
                    <div className="input-with-button">
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., The importance of artificial intelligence in modern society"
                        />
                        <button className="icon-button clear-button" onClick={clear}><TrashIcon /></button>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="essay">Essay</label>
                    <textarea
                        id="essay"
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                        placeholder="Paste your essay here..."
                        rows={15}
                    ></textarea>
                </div>
                
                <button className="score-button" onClick={scoring} disabled={apiState.loading}>
                    {apiState.loading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Scoring...</span>
                        </>
                    ) : 'Score Essay'}
                </button>

                {apiState.score && (
                    <div className="results-section" ref={resultsRef}>
                        <h2 className="overall-score">Overall Score: {apiState.score.Overall_score.toFixed(1)}</h2>
                        <div className="score-grid">
                            <div className="score-card">
                                <h3>TR</h3>
                                <p>{apiState.score.TR.toFixed(1)}</p>
                                <span>Task Response</span>
                            </div>
                            <div className="score-card">
                                <h3>LR</h3>
                                <p>{apiState.score.LR.toFixed(1)}</p>
                                <span>Lexical Resource</span>
                            </div>
                            <div className="score-card">
                                <h3>CC</h3>
                                <p>{apiState.score.CC.toFixed(1)}</p>
                                <span>Cohesion & Coherence</span>
                            </div>
                            <div className="score-card">
                                <h3>GRA</h3>
                                <p>{apiState.score.GRA.toFixed(1)}</p>
                                <span>Grammatical Range & Accuracy</span>
                            </div>
                        </div>
                        <div className="feedback-section">
                            <h3>Reason</h3>
                            <p>{apiState.score.reason}</p>
                        </div>
                        <div className="feedback-section">
                            <h3>Improvement</h3>
                            <p>{apiState.score.improvement}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Main