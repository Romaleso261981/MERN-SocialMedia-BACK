import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import User from './models/userModel.js'

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
		origin: 'https://our-chat-my.netlify.app',
		optionsSuccessStatus: 200
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
		origin: 'http://localhost:3000', // або ваш дозволений origin
	},
})

let activeUsers = []
const username = 'lesoRoman'

io.on('connection', socket => {
	console.log('connection')
	// add new User
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
			console.log('newUser', newUser)
		}

		// send all active users to new user
		io.emit('get-users', activeUsers)
	})

	socket.on('disconnect', () => {
		// remove user from active users
		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
		console.log('User Disconnected', activeUsers)
		// send all active users to all users
		io.emit('get-users', activeUsers)
	})

	// send message to a specific user
	socket.on('send-message', data => {
		// const { text, senderId, chatId } = data
		// console.log(senderId, text)
		console.log('data', data)

		socket.emit('receive-message', data)
		// const user = activeUsers.find((user) => user.userId === senderId);

		// if (user) {
		//   io.to(user.socketId).emit("recieve-message", data);
		// }
	})
})

mongoose
	.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
	})
	.catch(error => console.log(`${error} did not connect`))
