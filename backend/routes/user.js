import express from "express";
import { addUser, isUserAvailable, loginUser, logout } from "../controller/user.controller.js";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const q = "SELECT * FROM user";
  db.query(q, (err, data) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json(data);
  });
});

router.post("/login", loginUser);

router.post("/signup", addUser);

router.get('/isAvailable', isUserAvailable)

router.post('/logout', logout)

export default router;

