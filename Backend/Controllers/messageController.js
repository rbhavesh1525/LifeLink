const Message = require("../Models/messageModel")
const Hospital = require("../Models/HospitalAuthModel")
const {getReceiverSocketId, io} = require("../utils/socket.js")

const getMessages = async(req,res) => {
    try {
        const {id: userToChatId} = req.params
        const myId = req.user.id
        const message = await Message.find({
            $or: [
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getting messages",error.message);
        res.status(500).json({error: "Internal server error"})
        
    }
}
const sendMessage = async(req,res) => {
    try {
        const {text} = req.body
        const {id: receiverId} = req.params
        const senderId = req.user.id

        const newMessage = new Message({
            senderId,
            receiverId,
            text
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller",error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
module.exports = {getMessages, sendMessage}