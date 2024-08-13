// controllers/userController.js
const { User } = require("../models")

const postUserData = async (req, res) => {
  try {
    const { email } = req.body
    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.status(200).json({ message: "User data already exists" })
    }

    const newUser = await User.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.postUserData = postUserData
