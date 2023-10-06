import UserModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ChatModel from '../models/chatModel.js'
import User from '../models/userModel.js'

// Register new user
export const Signup = async (req, res) => {
	const { userName, userMood } = req.body
	try {
		// addition new
		const oldUser = await UserModel.findOne({ userName })

		if (!!oldUser) return res.status(400).json({ message: 'userName must be unique' })

		const newUser = new UserModel({ userName, userMood })
		// changed
		await newUser.save()

		res.status(200).json({ newUser })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
export const logOut = async (req, res) => {
	const { userId, chatId } = req.body
	console.log('userId',userId, 'chatId',chatId)

	if (chatId) {
		const chatRoom = await ChatModel.findById(chatId)
		console.log('chatRoom', chatRoom?.members)
	}
	
	if(userId) {	
	const result = await User.findByIdAndDelete({ _id: userId })
	console.log('result', result)
	}

	try {
		res.status(200).json({ message: 'User logged out' })
	} catch (err) {
		res.status(500).json(err)
	}
}
export const loginUser = async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await UserModel.findOne({ username: username })

		if (user) {
			const validity = await bcrypt.compare(password, user.password)

			if (!validity) {
				res.status(400).json('wrong password')
			} else {
				const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWTKEY, { expiresIn: '1h' })
				res.status(200).json({ user, token })
			}
		} else {
			res.status(404).json('User not found')
		}
	} catch (err) {
		res.status(500).json(err)
	}
}
