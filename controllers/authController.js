import JWT from 'jsonwebtoken'
import { comparePassword, hashPassword } from '../helpers/authHelper.js'
import userModel from '../models/userModel.js'



export const registerController = async (req, res) => {
	try {
		const { name, email, password, phone, address, answer } = req.body
		//validations
		if (!name) {
			return res.send({ message: "Name is Required" })
		}
		if (!email) {
			return res.send({ message: "Email is Required" })
		}
		if (!password) {
			return res.send({ message: "Password is Required" })
		}
		if (!phone) {
			return res.send({ message: "Phone no is Required" })
		}
		if (!address) {
			return res.send({ message: "Address is Required" })
		}
		if (!answer) {
			return res.send({ message: "Answer is Required" })
		}

		//check user
		const exisitingUser = await userModel.findOne({ email })
		//exisiting user
		if (exisitingUser) {
			return res.status(200).send({
				success: false,
				message: "Already Register please login",
			})
		}
		//register user
		const hashedPassword = await hashPassword(password)
		//save
		const user = await new userModel({
			name,
			email,
			phone,
			address,
			password: hashedPassword,
		}).save()

		res.status(201).send({
			success: true,
			message: "User Register Successfully",
			user,
		})
	} catch (error) {
		console.log(error)
		res.status(500).send({
			success: false,
			message: "Errro in Registeration",
			error,
		})
	}
}

//  POST LOGIN
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body
		// validation
		if (!email || !password) {
			return res.status(404).send({
				success: false,
				message: "Invalid email or login"
			})
		}
		// user tekshirish
		const user = await userModel.findOne({ email })
		if (!user) {
			return res.status(404).send({
				success: false,
				message: "Email is not Register"
			})
		}
		// Moslik
		const match = await comparePassword(password, user.password)
		if (!match) {
			return res.status(200).send({
				success: false,
				message: "Invalid Password",
			})
		}
		// Token
		const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d'
		})
		res.status(200).send({
			success: true,
			message: "login successfully",
			user: {
				_id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				address: user.address,
				role: user.role
			},
			token,
		})

	} catch (error) {
		console.log(error)
		res.status(500).send({
			success: false,
			message: "Error in login",
			error
		})
	}
}

// Forgot Password Controller

export const forgotPasswordController = async (req, res) => {
	try {
		const { email, answer, newPassword } = req.body
		if (!email) {
			return res.status(400).send({ message: "Emai is required" })
		}
		if (!answer) {
			return res.status(400).send({ message: "answer is required" })
		}
		if (!newPassword) {
			return res.status(400).send({ message: "New Password is required" })
		}
		//check
		const user = await userModel.findOne({ email, answer })
		//validation
		if (!user) {
			return res.status(404).send({
				success: false,
				message: "Wrong Email Or Answer",
			})
		}
		const hashed = await hashPassword(newPassword)
		await userModel.findByIdAndUpdate(user._id, { password: hashed })
		return res.status(200).send({
			success: true,
			message: "Password Reset Successfully",
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success: false,
			message: "Something went wrong",
			error,
		})
	}
}


//  test contoller - Bu middleware funksiya himoyalangan marshrutlarga kirish uchun tokenni tekshirish uchun kerak.
export const testController = (req, res) => {
	try {
		res.send("Protected Routes")
	} catch (error) {
		console.log(error)
		res.send({ error })
	}
}