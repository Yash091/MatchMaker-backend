import Message from "../schema/messageSchema.js";
import Chat from "../schema/chatSchema.js";
import User from "../schema/userSchema.js";

export const allMessages = async(req,res) => {
    try {
        const id = req.params.chatId;
        const messages = await Message.find({chat:id}).populate("sender","name pic").populate("chat");
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({message : "server error",error});
    }
}

export const sendMessage = async(req , res) => {
    try {
        // console.log(req.body);
        const {content , chatId} = req.body;
        
        if(!content || !chatId) {
            return res.status(400).status("Bad request");
        }
        
        let newMessage = {
            sender : req.rootUser._id,
            content : content,
            chat : chatId
        }        
       
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name pic").execPopulate()
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message,{
            path: "chat.users",
            select: "name pic"
        });
        
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({message : "server error",error});
    }
}
