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
import AuthRoute from './routes/AuthRoute.js'
import RoomsRoute from './routes/RoomsRoute.js'
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
		origin: ['https://our-chat-my.netlify.app', 'http://localhost:3000', 'http://localhost:3001'],
		optionsSuccessStatus: 200,
	})
)
app.use(express.static('public'))
app.use('/images', express.static('images'))

app.use('/auth', AuthRoute)
app.use('/rooms', RoomsRoute)


// Load environment variables
const PORT = process.env.PORT || 3000
const CONNECTION = process.env.MONGODB_CONNECTION

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
	cors: {
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
		if (activeUsers.some(user => user.useId === user_id)) {
			activeUsers.push({ userId: user_id, socketId: socket.id })
			console.log('New User Connected', activeUsers)
		}

		io.emit('get-users', activeUsers)
	})
})

mongoose
	.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
	})
	.catch(error => console.log(`${error} did not connect`))
