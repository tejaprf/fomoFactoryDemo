import mongoose from "mongoose";

const connect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Successfully connected to MongoDB');
    }catch(err){
        console.log("Connection to MongoDB failed ",err);
    }
}

export default connect;