import Card from '../card/card.jsx';
import styles from './public.module.css';
import { jwtDecode} from 'jwt-decode';
import React, {useEffect, useState } from 'react';
import Logout from '../logout.jsx';
import {useNavigate} from 'react-router-dom';


function Public(){
    
    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("");
    const [cards, setCards] = useState([]);
    const [spaceName, setSpaceName] = useState(""); 
    const [tooltip, setTooltip] = useState(true);
    const [spacePermit, setPermit] = useState(false);
    const [code, setCode] = useState("");
    //Put in state so can access globally   
    const [UID, setUID] = useState();
    
    async function getCards(spaceid) {
        const token = localStorage.getItem("token");
    
        const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/card/${spaceid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,  // Include token
                "Content-Type": "application/json"
            }
        });
    
        const { data } = await result.json();
        setCards(data);
    }

    //Check if loggedin / there is a token
    
    useEffect(()=>{
      
        const token = localStorage.getItem("token");
        const spacetoken = localStorage.getItem("spacetoken");
        if (token) {
            setLogged(true);
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
            setUID(decoded.id);
        }

        if(spacetoken){
            setPermit(true)
            const spaceDecode = jwtDecode(spacetoken);
            setSpaceName(spaceDecode.spacename);
            getCards(spaceDecode.spaceid);
            setCode(spaceDecode.code)
        }
        
    }, []);

    async function handleCopy(event){
        const copyText = event.target.textContent;
        
        try{
            await navigator.clipboard.writeText(copyText);
            alert("copied code");
        }catch(error){
            alert("failed to copy");
        }
    }

    if(logged && spacePermit){
        return(
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.profile}>
                        <h4>{username}</h4>
                        <div className={styles.logout}><Logout/></div>
                    </div>

                <div className={styles.center}>
                    <h1>{spaceName}</h1>
                    
                    <button className={styles.createButton} onClick={()=>{navigate("/create")}}>
                        +
                    <h4 onClick={(event)=>{event.stopPropagation(); setTooltip(false);}} className={tooltip ? styles.animate : styles.invisible}>👈</h4>
                    </button>
                </div>
                    <div className={styles.codewrapper}>
                        <h5 className={styles.codetitle}>Code</h5>
                        <p onClick={handleCopy}className={styles.spacecode}>{code}</p>
                    </div>
                    <p onClick={handleCopy}className={styles.phoneCode}>{code}</p>
                </div>

                <div className={styles.cardsContainer}>
                    {cards.map((card, index) => {
                        //Iterate through all fetched cards in THIS SPACE
                        return <Card id={index} author={card.author} content={card.content} cardid={card.cardid} likes={card.likes}/>
                    })}
                </div>

                

            </div>
        );
    }else if(!logged){
        return(
            <div className={styles.goback}>
                <h1>Please Log In</h1>
                <button onClick={()=>{navigate("/login")}}>Login Page</button>
            </div>
        )
    }else if(!spacePermit){
        return(
        <div className={styles.goback}>
            <h1>Please Use Code To Enter Space</h1>
            <button onClick={()=>{navigate("/spaces")}}>Go back</button>
        </div>  
        )
    }
    
}

export default Public;