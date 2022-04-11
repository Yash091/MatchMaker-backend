import Chat from "../schema/chatSchema.js";
import User from "../schema/userSchema.js";

export const accessChat = async (req , res) => {
    try {
            const id1 = req.rootUser._id;
            const id2 = req.body.id;

            let chat = await Chat.find({
                $and:[
                    { users : {$elemMatch : {$eq: id1}}},
                    { users : {$elemMatch : {$eq: id2}}}
                ]
            })
            .populate("users" , "-password");
            
            if(chat.length>0)
                return res.status(200).send(chat[0]);

            let chatData = {
                users:[id1,id2],
            }
            
            const createdChat = await Chat.create(chatData);
        
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            return res.status(200).json(fullChat);
    
    } catch (error) {
        return res.status(500).json({message: "Server Error"});    
    }
}

export const allChats = async (req , res) => {
    try {
        const data = await Chat.find();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json("server error");
    }
}