import express from "express";

import { registerUser, loginUser, getCards, createCard, getSpace, likeCard, dislikeCard, getLikes, createSpace} from "../controllers/controllers.js";
import  {authenticateToken}  from "../controllers/authMiddleware.js";
const router = express.Router();
router.use(express.json());

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

router.route('/card/:spaceid').get(authenticateToken, getCards).post(authenticateToken, createCard);
router.route('/likes/:cardid').get(authenticateToken, getLikes);
router.route('/like').put(authenticateToken, likeCard);
router.route('/dislike').put(authenticateToken, dislikeCard);
router.route('/space/:spacecode').get(authenticateToken, getSpace).post(authenticateToken, createSpace);


export default router;