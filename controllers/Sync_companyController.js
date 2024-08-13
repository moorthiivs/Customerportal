const { Company } = require("../models")

exports.postCompanyData = async (req, res) => {
  try {
    const { calibmaster_customer_id } = req.body
    const existingCompany = await Company.findOne({
      where: { calibmaster_customer_id },
    })

    if (existingCompany) {
      return res.status(200).json({ message: "Company data already exists" })
    }

    const newCustomer = await Company.create(req.body)
    res.status(201).json(newCustomer)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
