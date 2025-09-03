import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import 'client.css'
import axios from 'axios'
import apiClient from "../axiosConfig";
import { Language, Model } from "./def";

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
    const [score, setScore] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
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
    const [deleteloading, setDeleteLoading] = useState<boolean>(false);


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

        const handleNullInput = () => {
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
            setLoading(false);
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

    const clearTopic = () => {
        setTopic('');
    };

    const clearEssay = () => {
        setEssay('');
        setApiState(prev => ({ ...prev, error: null, score: null }));
    };
}

export default Main