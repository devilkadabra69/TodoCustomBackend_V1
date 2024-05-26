import dotenv from 'dotenv';
import connectDb from './db/index.js'
import { app } from './app.js';

dotenv.config(
    {
        path: `./env`
    }
);

connectDb()
    .then(() => {
        // app will run in the port 3000 else it will run in 8000
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Something went wrong :: Line 13 index.js :: \n", err);
    });