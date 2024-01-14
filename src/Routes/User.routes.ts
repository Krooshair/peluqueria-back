import { Router } from "express";
import UserController from "../Controllers/UserController";

const router = Router()
const user = new UserController()

router.post('/register', user.register)
router.post('/login', user.login)

export default router