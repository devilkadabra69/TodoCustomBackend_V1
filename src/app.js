import express, { urlencoded } from 'express';
import cors from 'cors';
import { LIMIT_16KB } from './constants.js';
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


// Debugging middleware for logging requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

// Error handling middleware for body size limits
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).send('Payload too large');
    }
    next(err);
});


//routes import

import { router } from './routes/user.routes.js';

//routes declarations
app.use("/api/v1/users", router)

// https://localhost/api/v1/users/register

export { app };