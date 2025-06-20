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
        }).sort({ createdAt: 1 }) // Sort messages by time
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

        // Create and save the message
        const newMessage = new Message({
            senderId,
            receiverId,
            text
        })

        const savedMessage = await newMessage.save()

        // Emit to receiver via socket
        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId){
            // Send the complete saved message object with ID
            io.to(receiverSocketId).emit("newMessage", savedMessage)
        }
        
        // Return the saved message with its ID
        res.status(201).json(savedMessage)

    } catch (error) {
        console.log("Error in sendMessage controller",error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
module.exports = {getMessages, sendMessage}