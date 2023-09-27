// import mongoose from "mongoose";

// const UserSchema = mongoose.Schema(
//   {
//     username: {
//       type: String,
//       default: '',
//     },
//     password: {
//       type: String,
//       default: '',
//     },
//     firstname: {
//       type: String,
//       default: '',
//     },
//     lastname: {
//       type: String,
//       default: '',
//     },
//     socketId: {
//       type: String,
//       default: null,
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//    profilePicture: String,
//     coverPicture: String,
//     about: String,
//     livesIn: String,
//     worksAt: String,
//     relationship: String,
//     country: String,
//     followers: [],
//     following: [],
//   },
//   { timestamps: true }
// );

// const UserModel = new mongoose.model("User", UserSchema);

// export default UserModel;

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			default: '',
		},
		password: {
			type: String,
			default: '',
		},
		firstname: {
			type: String,
			default: '',
		},
		lastname: {
			type: String,
			default: '',
		},
		socketId: {
			type: String,
			default: null,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		profilePicture: String,
		coverPicture: String,
		about: String,
		livesIn: String,
		worksAt: String,
		relationship: String,
		country: String,
		followers: [],
		following: [],
	},
	{ timestamps: true }
)

const User = new mongoose.model('User', userSchema)

export default User;
