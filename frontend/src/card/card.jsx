import styles from './card.module.css';
import React, {useState, useEffect} from "react";
import { jwtDecode } from 'jwt-decode';

function Card({author, content, cardid, likes}){
    const [likeCount, setCount] = useState(likes);
    const [isLiked, setLiked] = useState(false);
    
    //on mount set the liked status
    useEffect(()=>{
        
        fetchLikes();
    },[])


    async function fetchLikes() {
        const token = localStorage.getItem("token");
        const uid = jwtDecode(token).id;
    
        const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/likes/${cardid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Include token
                "Content-Type": "application/json"
            }
        });
    
        const { data } = await result.json();
        const user = data.find((data) => data.userid === uid);
        if (user) {
            setLiked(true);
        }
    }

    async function handleLiked() {
        const token = localStorage.getItem("token");
        const uid = jwtDecode(token).id;
        
        const endpoint = isLiked ? "dislike" : "like";
        const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    
        setLiked(!isLiked);
        setCount(newLikeCount);
    
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`, // Include token
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: uid,
                cardid: cardid
            })
        });
    
        const { message } = await response.json();
        console.log(message);
    }


    return(
        <div className={styles.cardBody}>
            
            <h1 className={styles.cardTitle}>{author}</h1>  
            <div className={styles.content}>{content}</div>

            <div className={styles.liking}>
                <button onClick={()=>handleLiked()} className={isLiked ? styles.liked : ""}>❤</button>
                <p>{likeCount||0}</p>
            </div>

        </div>  
        
    );
}

export default Card;