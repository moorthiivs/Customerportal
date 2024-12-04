const fs = require('fs').promises;
const { Certificate } = require('../models');

exports.postCertificateData = async (req, res) => {
  try {
    const { srfitems } = req.body;
    let updated_count = 0;

    for (const each_item of srfitems) {
      const { srfId, srfNo, srf_item_id, filename, certificates_base64, master_certificates_base64, master_certificate_filename } = each_item;

      // Check if the certificate already exists
      const existssrfitem = await Certificate.findOne({ where: { srfId, srfNo, srf_item_id, filename } });

      if (!existssrfitem) {
        // Write certificate files if base64 data exists
        if (certificates_base64) {
          await fs.writeFile(`certificates/${filename}`, certificates_base64, 'base64');
          delete each_item.certificates_base64;
        }

        if (master_certificates_base64) {
          await fs.writeFile(`mastercertificates/${master_certificate_filename}`, master_certificates_base64, 'base64');
          delete each_item.master_certificates_base64;
        }

        // Update or create certificate in database
        const existingCertificate = await Certificate.findOne({ where: { srfId, srfNo, srf_item_id } });
        if (existingCertificate) {
          await Certificate.update({ filename }, { where: { id: existingCertificate.id } });
        } else {
          await Certificate.create(each_item);
        }

        updated_count++;
      }
    }
    if (!updated_count) {
      return res.status(201).json({ message: "All Certificate is up to date!" });
    }
    res.status(200).json({ message: `Certificate synced successfully! Synced count: ${updated_count}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
