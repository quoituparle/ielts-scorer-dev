import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from "../axiosConfig"; 
import './client.css'; 

interface Topic {
    topic_id: string;
    topic: string;
}

interface Essay {
    essay_id: string;
    user_id: string;
    content: string;
    score: number;
    published_date: string;
}

interface RankData {
    topic: Topic;
    score_rank: Essay[];
    time_rank: Essay[];
}

interface ParsedScore {
    Overall_score: number;
    TR: number;
    LR: number;
    CC: number;
    GRA: number;
}

function Playground(){
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [viewState, setViewState] = useState<'list' | 'topic_detail' | 'rank_list' | 'essay_detail'>('list');
    
}

export default Playground