import mysql from 'mysql2';
import pool from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const jwt_key = process.env.JWTKEY;

// Register User
export async function registerUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Invalid credentials" });
    if (username.length > 25) return res.status(400).json({ message: "Username must not exceed 25 characters" });

    try {
        const [existingUser] = await pool.query("SELECT username FROM user WHERE username = ?", [username]);
        if (existingUser.length > 0) return res.json({ message: `Username ${username} already exists` });

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO user(username, password) VALUES(?, ?)", [username, hashedPassword]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Login User
export async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query("SELECT * FROM user WHERE username = ?", [username]);
        if (users.length === 0) return res.status(401).json({ message: "Username does not exist, please register" });
        
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.userid, username: user.username }, jwt_key, { expiresIn: "8h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Cards
export async function getCards(req, res) {
    const { spaceid } = req.params;
    try {
        const [cards] = await pool.query("SELECT * FROM card WHERE space_id = ?", [spaceid]);
        res.json({ data: cards });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create Card
export async function createCard(req, res) {
    const { spaceid } = req.params;
    const { author, content, user_id } = req.body;
    try {
        await pool.query("INSERT INTO card(author, content, user_id, space_id) VALUES(?, ?, ?, ?)", [author, content, user_id, spaceid]);
        res.status(201).json({ message: "Card created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Space
export async function getSpace(req, res) {
    const { spacecode } = req.params;
    try {
        const [spaces] = await pool.query("SELECT * FROM space WHERE code = ?", [spacecode]);
        if (spaces.length === 0) return res.status(404).json({ message: "Space not found" });
        
        const { spacename, code, spaceid } = spaces[0];
        const spacetoken = jwt.sign({ spacename, code, spaceid }, jwt_key, { expiresIn: "8h" });
        res.json({ spacetoken, code, spacename });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create Space
export async function createSpace(req, res) {
    const { spacecode } = req.params;
    const { spacename, user_id } = req.body;
    try {
        const [existingSpace] = await pool.query("SELECT spaceid FROM space WHERE user_id = ?", [user_id]);
        if (existingSpace.length > 0) {
            
            const [codes] = await pool.query("SELECT code FROM space WHERE user_id = ?", [user_id]);
            return res.json({ exists: true, spacecode: codes });
        }
        
        await pool.query("INSERT INTO space(code, spacename, user_id) VALUES(?, ?, ?)", [spacecode, spacename, user_id]);
        res.status(201).json({ exists: false, message: "Space created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Likes
export async function getLikes(req, res) {
    const { cardid } = req.params;
    try {
        const [likes] = await pool.query("SELECT userid FROM likes WHERE cardid = ?", [cardid]);
        res.json({ data: likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Like Card
export async function likeCard(req, res) {
    const { cardid, userid } = req.body;
    try {
        await pool.query("INSERT INTO likes(userid, cardid) VALUES(?, ?)", [userid, cardid]);
        await pool.query("UPDATE card SET likes = likes + 1 WHERE cardid = ?", [cardid]);
        res.json({ message: "Liked successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Dislike Card
export async function dislikeCard(req, res) {
    const { cardid, userid } = req.body;
    try {
        await pool.query("DELETE FROM likes WHERE userid = ? AND cardid = ?", [userid, cardid]);
        await pool.query("UPDATE card SET likes = likes - 1 WHERE cardid = ?", [cardid]);
        res.json({ message: "Disliked successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
