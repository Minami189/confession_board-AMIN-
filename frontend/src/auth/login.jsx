import styles from "./auth.module.css";
import {NavLink, useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";


function Login(){
    const usernameInput = useRef("");
    const passwordInput = useRef("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    async function handleLogin(){
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        if(username.length <= 0){
           return setMsg("Must enter username");
        }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password}),
            credentials: "include" //Cookies for JWT 
        });
        try{
            
        const {message, token} = await response.json();
        setMsg(message);
        if(!token){
            return;
        }
        localStorage.setItem("token", token);
        navigate("/spaces");
            
            
        }catch(error){
            setMsg("Something went wrong. Please try again");
        }
        
        
    }

    return(
    <div className={styles.wrapper}>
        <div className={styles.loginmain}>
            <h1 className={styles.title}>Login</h1>
            <label for="username">Username</label>
            <input ref={usernameInput} id="username" placeholder="Username"></input>
            <label for="password">Password</label>
            <input type="password" ref={passwordInput} id="password" placeholder="Password"></input>
            <p className={styles.message}>{msg}</p>
            <button className={styles.loginbutton} onClick={handleLogin}>Login</button>
            <button className={styles.phonereg} onClick={()=>navigate("/register")}>Register</button>
        </div>

        <div className={styles.loginside}>
            <h2 className={styles.title}>Welcome to A.M.I.N.</h2>
            <p className={styles.subtitle}>Don't have an account?</p>
          
                <button className={styles.signup} onClick={()=>navigate("/register")}>Sign up</button>
            
        </div>
        
    </div>
        
    );
}

export default Login;