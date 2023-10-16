import { errorsMidleware } from './middlewares/errorsMiddleware.js'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import http from 'http'
import { dbConnect } from './services/dbConnect.js'
import cors from 'cors' // Додайте імпорт бібліотеки CORS

// routes
import {
	globalRouter,
	authRouter,
	roomsRouter,
	userRouter,
	privateChatsRouter,
	roomsChatRouter,
} from './routes/index.js'

dotenv.config()
const app = express()

// Load environment variables
const PORT = process.env.SERVER_PORT || 8880

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: { // Додайте налаштування CORS для socket.io
    origin: ['http://localhost:3000', 'https://our-chat-my.netlify.app'], // Вкажіть джерело, яке має мати доступ
    methods: ['GET', 'POST'],
  }
})

dbConnect()

// Set up the express application
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use(express.static('public'))
app.use('/images', express.static('images'))

// routes
app.use('/', globalRouter)
app.use('/auth', authRouter)
app.use('/rooms', roomsRouter)
app.use('/user', userRouter)

roomsChatRouter(io)
privateChatsRouter(io)

// Necessary to resolve server crash when an error occurs
app.use(errorsMidleware)

httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
