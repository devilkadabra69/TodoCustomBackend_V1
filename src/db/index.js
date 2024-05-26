import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"


console.log(process.env.MONGODB_URL);
const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MONGODB CONNECTED :: DB HOST :: ${connectionInstance.connection.host} \n`);

    } catch (error) {
        console.log("MONGODB CONNECTION ERROR :: FROM L7 INDEX.JS", error);
        process.exit(1);
    }
}

export default connectDb;