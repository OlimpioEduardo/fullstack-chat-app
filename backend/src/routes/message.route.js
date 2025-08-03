import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import { getMessage, getUsersForSidbar, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/users", protectRoute,getUsersForSidbar) //Pegando Usuarios Para a minha barra de navegação
router.get("/:id", protectRoute, getMessage)

router.post("/sender/:id", protectRoute, sendMessage)


export default router