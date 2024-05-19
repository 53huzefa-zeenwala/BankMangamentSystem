import express from "express";
import { addTransaction, deleteTransaction, getTransaction, getTransactions, updateTransaction } from "../controller/transaction.controller.js";

const router = express.Router();

router.post("/", addTransaction);
router.delete('/:id', deleteTransaction)
router.put('/:id', updateTransaction)
router.get('/', getTransactions)
router.get('/:id', getTransaction)

export default router;