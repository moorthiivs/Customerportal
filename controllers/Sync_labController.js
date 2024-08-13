const { Lab } = require("../models")

exports.postLabData = async (req, res) => {
  try {
    const { lab_id } = req.body
    const existingLab = await Lab.findOne({ where: { lab_id } })

    if (existingLab) {
      return res.status(200).json({ message: "Lab data already exists" })
    }

    const newLab = await Lab.create(req.body)
    res.status(201).json(newLab)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
