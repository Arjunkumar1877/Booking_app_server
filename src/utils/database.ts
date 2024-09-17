import mongoose from "mongoose";

console.log(process.env.MONGO_URI)
export const connectDb = async()=>{
    try {
     await  mongoose.connect(process.env.MONGO_URI as string);  
    console.log("db connected")
    } catch (error) {
        console.log(error)
    }

}
