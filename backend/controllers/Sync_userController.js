// controllers/userController.js
const { User } = require("../models")

const postUserData = async (req, res) => {
  try {
    const users = req.body;
    let updated_count = 0;

    for (const eachuser of users) {

      const existingUser = await User.findOne({ where: { email: eachuser.email } })

      if (!existingUser) {
        delete eachuser.department;
        delete eachuser.id;

        const newUser = await User.create(eachuser)
        updated_count++;
      }
    }
    if (!updated_count) {
      return res.status(201).json({ message: 'All client users is up to date!' });
    }
    res.status(201).json({ message: `Client Users data synced successfully! Synced count: ${updated_count}` });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.postUserData = postUserData
