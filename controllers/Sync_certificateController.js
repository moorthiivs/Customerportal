const { Certificate } = require("../models")

exports.postCertificateData = async (req, res) => {
  try {
    const { srfNo, serialno, filename } = req.body
    const existingCertificate = await Certificate.findOne({
      where: { srfNo, serialno, filename },
    })

    if (existingCertificate) {
      return res
        .status(200)
        .json({ message: "Certificate data already exists" })
    }

    const newCertificate = await Certificate.create(req.body)
    res.status(201).json(newCertificate)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
