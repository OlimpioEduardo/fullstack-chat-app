import User from "../models/user.model.js"
import Message from "../models/message.model.js"

import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidbar =async (req, res)=>{
    try{
    const loggedUser = req.user._id; // Pegando o usuario logado ou seja, eu OBS tem de estar autenticado
    const filterUsers = await User.find({_id: {$ne:loggedUser}}).select("-password") // buscando todos os dados exceptos o usuario logado
    // select(-password) para n retornar o password para o usuario

    return res.status(200).json(filterUsers)
    
    }catch (error){
        console.error("Error in getUsersForSidbar controller",error.message)
        res.status(500).json("Internal Server Error")
    }

}

export const getMessage = async (req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id;
        const messages = await Message.find({ // encontre em Message model, onde eu envio a sms ou onde eu sou o receptor
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessage controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async(req,res)=>{
   try {
     const {text, image} = req.body
    const {id:receiverId} = req.params
    const senderId = req.user._id

    let imageUrl;
    if(image){
         // Upload base64 image to cloudinary
         const uploadResponse = await cloudinary.uploader.upload(image)
         imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })

    await newMessage.save()
    //Realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)
   } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json("Internal Server Error");
   }

}