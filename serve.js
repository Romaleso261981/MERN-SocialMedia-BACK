// import User from './models/userModel.js'

// import { Server } from 'socket.io'

// const io = new Server(8800, {
// 	cors: {
// 		origin: 'http://localhost:3000',
// 	},
// })

// let activeUsers = []
// const username = 'lesoRoman'

// io.on('connection', socket => {
// 	console.log('connection')
// 	// add new User
// 	socket.on('new-user-add', 
//   async user_id => {
// 		// if user is not added previously
// 		// if (!activeUsers.some(user => user.userId === user_id)) {
// 		// 	activeUsers.push({ userId: user_id, socketId: socket.id })
// 		// 	console.log('New User Connected', activeUsers)
// 		// }
// 		if (user_id != null && Boolean(user_id)) {
//       console.log('username', username)
// 			const user = await User.findById(user_id)
// 			console.log('user', user)
// 			if (!user) {
// 				console.error('User does not exist.')
// 				return
// 			}
// 			user.socketId = socket.id
// 			await user.save()
// 		}
// 		// send all active users to new user
// 		io.emit('get-users', activeUsers)
// 	}
//   )

// 	socket.on('disconnect', () => {
// 		// remove user from active users
// 		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
// 		console.log('User Disconnected', activeUsers)
// 		// send all active users to all users
// 		io.emit('get-users', activeUsers)
// 	})

// 	// send message to a specific user
// 	socket.on('send-message', data => {
// 		const { text, senderId, chatId } = data
// 		// const user = activeUsers.find((user) => user.userId === receiverId);
// 		console.log('Sending from socket to :', text)
// 		// if (user) {
// 		//   io.to(user.socketId).emit("recieve-message", data);
// 		// }
// 	})
// })
