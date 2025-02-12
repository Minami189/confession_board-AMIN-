import styles from "./auth.module.css";
import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
function Register(){
    const navigate = useNavigate();
    const usernameInput = useRef("");
    const passwordInput = useRef("");
    const [msg, setMsg] = useState("");

    async function handleRegister(){
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password}),
            credentials: "include" //Cookies for JWT 
        });
        const {message} = await response.json();
        setMsg(message);
        if(message == "User registered successfully"){
            navigate("/login");
        }
    }
    return(
        <div className={styles.registermain}>
            <h1 className={styles.title}>Register</h1>
            <label for="username">Username</label>
            <input ref={usernameInput} id="username" placeholder="Username"></input>
            <label for="password">Password</label>
            <input type="password" ref={passwordInput} id="password" placeholder="Password"></input>
            <p className={styles.message}>{msg}</p>
            
            <button className={styles.loginbutton} onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;