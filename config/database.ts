import  mongoose from "mongoose";

export const connect = async () : Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongo success");
    } catch (error) {
        console.log("mongo fail");
    }
};