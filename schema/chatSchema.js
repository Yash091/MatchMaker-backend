import mongoose from "mongoose"
// import User from "./userSchema"

const chatSchema = new mongoose.Schema({
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
})

const Chat = new mongoose.model('Chat' , chatSchema);
export default Chat;