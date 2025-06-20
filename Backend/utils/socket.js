const {Server} = require("socket.io")
const http = require("http")
const express = require("express")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    }
})

const userSocketMap = {} // store online users {userId : socketId}

function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

io.on("connection", (socket) => {
    console.log("A user Connected", socket.id)
    
    // Get userId from query parameters
    const userId = socket.handshake.query.userId
    
    if(userId) {
        userSocketMap[userId] = socket.id
        console.log(`User ${userId} connected with socket ${socket.id}`)
        
        // Emit online users to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        
        // Find and remove the user from userSocketMap
        for (const [id, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[id]
                console.log(`User ${id} disconnected and removed from socket map`)
                break
            }
        }
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

module.exports = {io, app, server, getReceiverSocketId}

    