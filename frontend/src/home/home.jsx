import styles from "./home.module.css";
import React, {useState} from "react";
import Card from "../card/card.jsx";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    let contents = [
        "You can post anonymously or if you're brave post with your display name.",
        "If the text of a card overflows you can always scroll through it to read more... test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out test it out YEYYYY ",
        "Oy, kayo ah reminder lang. Wag naman sana kayo maglagay ng explicit content dito ah, baka kung ano ano na sabihin niyo dito porke anonymous kayo",
        "Sana matapos ng developer yung website na toh bago mag feb 14 para sakto. Kung nakkita nyo ngayon toh at di pa feb 14 edi nice"
    ]
    console.log("test");
    return(
    <div className={styles.main}>

        <div className={styles.cards}>
            <div className={styles.card1}><Card author="Anonymous" content={contents[0]}></Card></div>
            <div className={styles.card2}><Card author="Izumi" content={contents[1]}></Card></div>
            <div className={styles.card3}><Card author="Yuki" content={contents[2]}></Card></div>
            <div className={styles.card4}><Card author="Bogart" content={contents[3]}></Card></div>
        </div>
        
        <h1 className={styles.title}>A.M.I.N.</h1>
        <h2 className={styles.subtitle}>Anonymous Messaging In Network</h2>

        <button className={styles.button} onClick={()=>navigate("/login")}>Start Now</button> 
        
        


    </div>

    
    );
}

export default Home;