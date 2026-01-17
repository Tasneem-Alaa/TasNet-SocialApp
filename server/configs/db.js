import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MONGODB CONNECTED SUCCESFULLY✅'))
        await mongoose.connect(`${process.env.MOGODB_URL}/TasNet`)
    } catch (error) {
        console.log("Error connecting to MONGODB❌",error.message);
        process.exit(1); //exit with failure, and 0 means exit with succes
    }
}

export default connectDB