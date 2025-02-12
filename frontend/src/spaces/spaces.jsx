import React, {useEffect, useState, useRef} from 'react';
import Logout from '../logout.jsx';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import styles from "./spaces.module.css"

function Spaces(){
    let username;
    let UID;
    const [logged, setLogged] = useState(false);
    const codeDisplay = useRef("");

    const navigate = useNavigate();
    
    useEffect(()=>{
        console.log("trigger");
        if(localStorage.getItem("token")){
            setLogged(true);
        }
    },[]);

    const token = localStorage.getItem("token");
    if (token) {
        const decoded = jwtDecode(token);
        username = decoded.username;
        UID = decoded.id;
    }

    // Button for going to public space
    function handlePublic(){
        fetchSpace("PUBLIC");
    }
    
    async function fetchSpace(spaceCode){
        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/space/${spaceCode}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const { spacetoken } = await result.json();
        if (spacetoken) {
            localStorage.setItem("spacetoken", spacetoken);
            navigate("/public");
        } else {
            alert("That code does not exist");
        }
    }

    function handlePrivate(){
        const code = codeDisplay.current.value;
        if (code.length !== 10) {
            return alert("Codes are always 10 characters");
        }
        fetchSpace(code);
    }

    async function createSpace(){
        const code = generateRandomCode();
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/space/${code}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                spacename: `${username}'s space`,
                user_id: UID
            })
        });

        const { exists, spacecode } = await response.json();
        if (!exists) {
            fetchSpace(code);
        } else {
            fetchSpace(spacecode[0].code);
        }
    }

    // Generate a random code for createSpace
    function generateRandomCode() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }
    
    // Handling for logins
    if (!logged) {
        return (
            <div>
                <h1>Please log in</h1>
                <button onClick={() => navigate("/login")}>Go back</button>
            </div>
        );
    } else {
        return (
            <div className={styles.main}>
                <h1 className={styles.welcome}>Welcome {username}</h1>
                <Logout />
                <div className={styles.spacecontrol}>
                    <button onClick={handlePublic}>Public Space</button>
                    <button onClick={createSpace} className={styles.createspace}>Your Space</button>
                </div>
                <div className={styles.codeForm}>
                    <input placeholder="code" ref={codeDisplay}></input>
                    <button onClick={handlePrivate}>Join Private Space</button>
                </div>
            </div>
        );
    }
}

export default Spaces;
