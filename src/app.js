import express, { urlencoded } from 'express';
import cors from 'cors';
import { LIMIT_16KB } from './constants';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.static('public'));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({
    limit: LIMIT_16KB
}));
app.use(urlencoded({
    extended: true,
    limit: LIMIT_16KB
}))
app.use(cookieParser())

export { app };