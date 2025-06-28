import express from "express";
import { getUserById, googleAuth, login, logout, register, searchUsers, updateInfo, validUser } from "../controllers/userControllers.js";
import { Auth } from "../middleware/user.js";

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/auth/valid',Auth, validUser);

router.get('/auth/logout',Auth, logout);

router.post('/api/google', googleAuth);

router.get('/api/user',Auth, searchUsers);

router.get('/api/users/:id',Auth, getUserById);

router.patch('/api/users/update/:id',Auth, updateInfo);

export default router;