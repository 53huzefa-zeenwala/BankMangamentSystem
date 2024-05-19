import express from "express";
import { addAccount, joinAccount, switchAccount } from "../controller/account.controller.js";

const router = express.Router();

router.post("/add", addAccount);
router.post('/join', joinAccount)
router.get('/switch/:id', switchAccount)

export default router;
