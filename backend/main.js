import express from 'express'
import cors from 'cors'
import { accountRoute, transactionRoute, userRoute } from './routes/index.js';
import cookieParser from "cookie-parser";


const app = express()

app.use(express.json());
app.use(cors({credentials: true, origin: true, withCredentials: true }))
app.use(cookieParser());


app.use('/api/user', userRoute)

app.use('/api/account', accountRoute)

app.use('/api/transaction', transactionRoute)

app.listen(8000, ()  => {
    console.log("app is connected")
})