import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import User from './models/userModel.js'
import ChatModel from './models/chatModel.js'
import { rooms } from './data/rooms.js'

// routes
dotenv.config()
const app = express()
// ... (використання middleware)

// Set up the express application
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(
	cors({
		origin: [
			'https://our-chat-app-two.vercel.app',
			'https://our-chat-my.netlify.app',
			'http://localhost:3000',
			'http://localhost:3001',
		],
		optionsSuccessStatus: 200,
	})
)
// app.use('/rooms', roomsRouter);

// Load environment variables
const PORT = process.env.PORT || 3000
const CONNECTION = process.env.MONGODB_CONNECTION

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: [
			'https://our-chat-app-two.vercel.app',
			'https://our-chat-my.netlify.app',
			'http://localhost:3000',
			'http://localhost:3001',
		],
		optionsSuccessStatus: 200,
	},
})

let activeUsers = []
let addedUserInCurrentChat = []
const username = 'lesoRoman'

io.on('connection', socket => {
	console.log('New User Connected', socket.id)
	socket.on('new-user-add', async user_id => {
		// if user is not added previously
		console.log(!activeUsers.some(user => user.userId === user_id))
		if (!activeUsers.some(user => user.userId === user_id)) {
			activeUsers.push({ userId: user_id, socketId: socket.id })
			console.log('New User Connected', activeUsers)
		}

		io.emit('get-users', activeUsers)
	})
	socket.on('get-curent-chatRoom', async (chat_id, userId) => {
		try {
			const chatRoom = await ChatModel.findOne({ id: chat_id })
			if (!chatRoom) {
				const newChatRoom = new ChatModel({
					id: chat_id,
					members: [userId],
					messages: [],
				})
				await newChatRoom.save()
				io.emit('get-chatRoom', newChatRoom)
			} else {
				io.emit('get-chatRoom', chatRoom)
			}
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}
	})
	socket.on('send-message', async ({ text, senderId, chatId, userName, userMood }) => {
		try {
			const chatRoom = await ChatModel.findOne({ id: chatId })

			if (chatRoom) {
				chatRoom.messages.push({ text, senderId, chatId, userName, userMood })
				await chatRoom.save()
			}
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}

		const upDatedChat = await ChatModel.findOne({ id: chatId })
		activeUsers.forEach(element => {
			io.to(element.socketId).emit('receive-message', upDatedChat.messages.at(-1))
		})
	})
	socket.on('disconnect', () => {
		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
		console.log('User Disconnected', activeUsers)
		io.emit('get-users', activeUsers)
	})
})
io.of('/private-chats').on('connection', socket => {
	console.log('New User Connected', socket.id)
	console.log('New User Connected', socket)
})

mongoose
	.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
	})
	.catch(error => console.log(`${error} did not connect`))
