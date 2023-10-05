import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import User from './models/userModel.js'
import ChatModel from './models/chatModel.js'

// routes
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import PostRoute from './routes/PostRoute.js'
import UploadRoute from './routes/UploadRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'

dotenv.config()
const app = express()
// ... (використання middleware)

// Set up the express application
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(
	cors({
		origin: ['https://our-chat-my.netlify.app', 'http://localhost:3000'],
		optionsSuccessStatus: 200,
	})
)
app.use(express.static('public'))
app.use('/images', express.static('images'))

app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)

// Load environment variables
const PORT = process.env.PORT || 3000
const CONNECTION = process.env.MONGODB_CONNECTION

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: ['https://our-chat-my.netlify.app', 'http://localhost:3000'],
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
		if (!activeUsers.some(user => user.userId === user_id)) {
			activeUsers.push({ userId: user_id, socketId: socket.id })
			console.log('New User Connected', activeUsers)
		}

		if (user_id != null && Boolean(user_id)) {
			const user = await User.findById(user_id)
			if (!user) {
				console.error('User does not exist.')
				return
			}
			user.socketId = socket.id
			const newUser = await user.save()
		}

		io.emit('get-users', activeUsers)
	})

	socket.on('add-user-in-curent-chatRoom', ({ userName }) => {
		console.log('get-curent-chatRoom', userName)
		io.emit('user-added-in-chatRoom', userName)
	})
	socket.on('get-curent-chatRoom', async chat_id => {
		console.log('get-curent-chatRoom', chat_id)

		let newChatRoom = null
		if (chat_id === 'undefined' && chat_id === 'null') {
			console.error('chat_id is not defined')
			return
		}

		try {
			const chatRoom = await ChatModel.findById(chat_id)
			newChatRoom = chatRoom
			io.emit('get-chatRoom', newChatRoom)
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}
		if (!newChatRoom) {
			try {
				newChatRoom = new ChatModel({
					members: [username, 'test'],
				})
				await newChatRoom.save()
				io.emit('get-chatRoom', newChatRoom)
			} catch (error) {
				console.error("Error while processing 'get-curent-chatRoom':", error)
			}
		}
	})

	socket.on('disconnect', () => {
		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
		console.log('User Disconnected', activeUsers)
		io.emit('get-users', activeUsers)
	})

	socket.on('send-message', async ({ text, senderId, chatId, userName, userMood }) => {
		console.log(senderId, text)

		try {
			const chatRoom = await ChatModel.findById(chatId)
			console.log('chatRoom', chatRoom)

			if (chatRoom) {
				chatRoom.messages.push({ text, senderId, chatId,userName, userMood, createdAt: Date.now() })
				await chatRoom.save()
			}
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}

		// socket.emit('receive-message', data)
		// socket.broadcast.emit('receive-message', data);
		// socket.emit('receive-message', data);

		const upDatedChat = await ChatModel.findById(chatId)
		activeUsers.forEach(element => {
			console.log('element', upDatedChat)
			io.to(element.socketId).emit('receive-message', upDatedChat.messages[upDatedChat.messages.length - 1])
		})
	})
})

mongoose
	.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
	})
	.catch(error => console.log(`${error} did not connect`))
