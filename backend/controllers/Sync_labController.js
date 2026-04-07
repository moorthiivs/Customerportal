const { Lab } = require("../models");
var fs = require('fs');

exports.postLabData = async (req, res) => {
  try {
    const { lab, brand_logo_base64Image } = req.body;

    if (!lab || !lab.lab_id || !lab.brand_logo_filename) {
      return res.status(400).json({ message: "Lab data or brand logo filename is missing" });
    }

    const existingLab = await Lab.findOne({ where: { lab_id: lab.lab_id } })

    if (existingLab) {
      return res.status(200).json({ message: "Lab data has already been synced!" });
    }

    if (brand_logo_base64Image) {
      try {
        fs.writeFileSync("public/images/" + lab.brand_logo_filename, brand_logo_base64Image, 'base64');
      } catch (err) {
        console.log(err);
      }
    }

    const newLab = await Lab.create(lab);
    res.status(201).json({ message: "Lab data synced successfully!" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
