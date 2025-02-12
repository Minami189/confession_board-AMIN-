import styles from './create.module.css';
import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Create(){
    const navigate = useNavigate();
    const authorInput = useRef("");
    const contentInput = useRef("");
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("");
    const [userid, setUserid] = useState("");
    useEffect(()=>{
            const token = localStorage.getItem("token");
            if (token) {
                setLogged(true);
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
                setUserid(decoded.id);
            }
    }, [])

    async function handleSubmit(){
        const author = authorInput.current.value.trim();
        const content = contentInput.current.value.trim();
        if(content.length === 0){
            return alert("Must enter at least one character in content");
        }
    
        const token = localStorage.getItem("token");
        const spacetoken = localStorage.getItem("spacetoken");
    
        if (!token || !spacetoken) {
            return alert("Authentication error. Please log in again.");
        }
    
        const spaceID = jwtDecode(spacetoken).spaceid;
    
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/card/${spaceID}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Include token
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author: author || "Anonymous",
                content: content,
                user_id: userid
            })
        });
    
        if (!response.ok) {
            return alert("Error in server. Please try again");
        }
    
        navigate("/public");
    }

    function handleCancel(){
        navigate('/public')
    }

    if(!logged){
        return(
        <div>
            <h1>Please log in</h1>
            <button onClick={()=>navigate("/login")}>Go back</button>
        </div>
        );
    }

    return(
        <div className={styles.main}>
            <div className={styles.editor}>
                <input placeholder="enter displayed name" type="text" className={styles.cardTitle} ref={authorInput}></input>
                <textarea placeholder="enter card content here..." className={styles.content} ref={contentInput}></textarea>
            </div>

            <div className={styles.buttons}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            
        </div>
    )
}

export default Create;