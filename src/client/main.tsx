import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './client.css'
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
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

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
                    if (err.response?.status === 401) {
                        navigate('/login')
                    } else {
                    const serverError = err.response?.data?.detail || 'Something went wrong'
                    setApiState(prev => ({...prev, error: serverError}))
                    }
                }
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

    const clearInputs = () => {
        setTopic('');
        setEssay('');
        setApiState(prev => ({ ...prev, error: null, score: null }));
    };

    // --- SVG Icons
    const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.829 15.222c-.655-1.134-.655-2.51 0-3.644.473-.817 1.25-1.422 2.171-1.674v-2.73a.25.25 0 0 0-.203-.246l-2.31-.577a.25.25 0 0 1-.219-.245v-2.31a.25.25 0 0 0-.246-.203h-2.73c-.252.92-.857 1.698-1.674 2.171-1.134.655-2.51.655-3.644 0-.817-.473-1.422-1.25-1.674-2.171h-2.73a.25.25 0 0 0-.246.203v2.31c0 .108-.07.204-.176.236l-2.348.586a.25.25 0 0 0-.203.246v2.73c.92.252 1.698.857 2.171 1.674.655 1.134.655 2.51 0 3.644-.473.817-1.25 1.422-2.171 1.674v2.73a.25.25 0 0 0 .203.246l2.31.577c.101.025.188.112.219.219v2.31a.25.25 0 0 0 .246.203h2.73c.252-.92.857-1.698 1.674-2.171 1.134-.655 2.51-.655 3.644 0 .817.473 1.422 1.25 1.674 2.171h2.73a.25.25 0 0 0 .246-.203v-2.31a.25.25 0 0 1 .219-.245l2.31-.577a.25.25 0 0 0 .203-.246v-2.73c-.92-.252-1.698-.857-2.171-1.674ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>;
    const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.742.742H5.625a.75.75 0 0 1-.742-.742L3.879 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.385 3.965a.75.75 0 0 1 .623.722v10.75a.75.75 0 0 1-1.5 0V7.713a.75.75 0 0 1 .877-.722ZM12 6.963a.75.75 0 0 1 .75.75v10.75a.75.75 0 0 1-1.5 0V7.713a.75.75 0 0 1 .75-.75Zm3.385.722a.75.75 0 0 0-.877.722v10.75a.75.75 0 0 0 1.5 0V7.713a.75.75 0 0 0-.623-.722Z" clipRule="evenodd"/></svg>;
    const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113C21.182 17.022 16.97 20.25 12.001 20.25c-4.97 0-9.185-3.223-10.675-7.69a.75.75 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" /></svg>;
    const EyeSlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM10.72 10.72a3 3 0 0 0 2.56 2.56l-2.56-2.56Zm-3.44 1.78a5.25 5.25 0 0 0 6.88 6.88l-6.88-6.88Zm10.4 1.08-3.52-3.52a5.25 5.25 0 0 0-6.34-6.34L3.98 3.98C2.59 5.39 1.45 7.21.81 9.19c-.75 2.36-.75 4.88 0 7.24 1.49 4.47 5.7 7.69 10.67 7.69 1.57 0 3.09-.28 4.52-.8L17.66 13.58Z" clipRule="evenodd" /></svg>;
    const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
    return (
        <div id="main-page">
        <div className="main-container">
            <header className="sticky-header">
                <div className="header-controls">
                    {/* Model Dropdown */}
                    <div className="custom-dropdown">
                        <button onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)} className="dropdown-button">
                            {availableModels.find(m => m.id === model)?.name || 'Select Model'}
                            <span className={`chevron ${isModelDropdownOpen ? 'open' : ''}`}><ChevronDownIcon /></span>
                        </button>
                        <ul className={`dropdown-menu ${isModelDropdownOpen ? 'open' : ''}`}>
                            {availableModels.map((m) => (
                                <li key={m.id} onClick={() => { setModel(m.id); setIsModelDropdownOpen(false); }}>
                                    {m.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Language Dropdown */}
                    <div className="custom-dropdown">
                        <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="dropdown-button">
                            {availableLanguages.find(l => l.code === language)?.name || 'Select Language'}
                            <span className={`chevron ${isLangDropdownOpen ? 'open' : ''}`}><ChevronDownIcon /></span>
                        </button>
                        <ul className={`dropdown-menu ${isLangDropdownOpen ? 'open' : ''}`}>
                            {availableLanguages.map((l) => (
                                <li key={l.code} onClick={() => { setLanguage(l.code); setIsLangDropdownOpen(false); }}>
                                    {l.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="settings-container">
                    <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="icon-button settings-button">
                        <GearIcon />
                    </button>
                    <div className={`settings-panel ${isSettingsOpen ? 'open' : ''}`}>
                        <p className="user-email">Logged in as: <strong>{userEmail}</strong></p>
                        <form onSubmit={update_data}>
                            <label htmlFor="api-key">Gemini API Key</label>
                            <div className="api-key-wrapper">
                                <input
                                    id="api-key"
                                    type={isApiKeyVisible ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your API Key"
                                />
                                <button type="button" onClick={() => setIsApiKeyVisible(!isApiKeyVisible)} className="icon-button eye-button">
                                    {isApiKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <button type="submit" className="button-primary" disabled={updateLoading}>
                                {updateLoading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </form>
                        <hr />
                        <div className="danger-zone">
                            <button onClick={Logout} className="button-danger" disabled={logoutLoading}>
                                {logoutLoading ? 'Logging out...' : 'Log Out'}
                            </button>
                            <button onClick={handleDeleteAccount} className="button-danger" disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="content-area">
                <div className="input-card">
                    <div className="topic-wrapper">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter the essay topic here..."
                            className="topic-input"
                        />
                        <button onClick={() => setTopic('')} className="icon-button clear-topic-button">
                            <TrashIcon />
                        </button>
                    </div>

                    <textarea
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                        placeholder="Paste your essay here..."
                        className="essay-textarea"
                    />

                    <div className="actions-bar">
                         <button onClick={clearInputs} className="button-secondary">
                            Clear All
                        </button>
                        <button onClick={scoring} className="score-button" disabled={apiState.loading}>
                            {apiState.loading ? <div className="spinner"></div> : 'Get Score'}
                        </button>
                    </div>
                </div>

                {apiState.error && <div className="error-message">{apiState.error}</div>}
                {apiState.success && <div className="success-message">{apiState.success}</div>}

                {apiState.score && (
                    <div className="results-container" ref={resultsRef}>
                        <div className="overall-score-wrapper">
                            <p>Overall Score</p>
                            <h1 className="overall-score">{apiState.score.Overall_score.toFixed(1)}</h1>
                        </div>

                        <div className="score-grid">
                            <div className="score-card">
                                <h3>Task Response</h3>
                                <p>{apiState.score.TR.toFixed(1)}</p>
                            </div>
                            <div className="score-card">
                                <h3>Lexical Resource</h3>
                                <p>{apiState.score.LR.toFixed(1)}</p>
                            </div>
                            <div className="score-card">
                                <h3>Coherence & Cohesion</h3>
                                <p>{apiState.score.CC.toFixed(1)}</p>
                            </div>
                            <div className="score-card">
                                <h3>Grammatical Range & Accuracy</h3>
                                <p>{apiState.score.GRA.toFixed(1)}</p>
                            </div>
                        </div>

                        <div className="feedback-section">
                            <h2>Reason</h2>
                            <p>{apiState.score.reason}</p>
                        </div>
                        <div className="feedback-section">
                            <h2>Improvement</h2>
                            <p>{apiState.score.improvement}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
        </div>
    );
}

export default Main