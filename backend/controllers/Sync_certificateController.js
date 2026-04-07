const fs = require('fs').promises;
const { Certificate } = require('../models');
const { CALIBMASTER_PORTAL_SERVER } = require("../utils/config");

exports.postCertificateData = async (req, res) => {
  try {
    const { srfitems } = req.body;
    let updated_count = 0;

    for (const each_item of srfitems) {
      const { srfId, srfNo, srf_item_id, filename, master_certificate_filename } = each_item;

      // Check if the certificate already exists
      const existssrfitem = await Certificate.findOne({ where: { srfId, srfNo, srf_item_id, filename } });

      if (!existssrfitem) {
        try {
          const post_data = {
            method: 'POST', headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename, master_certificate_filename })
          };

          const response = await fetch(CALIBMASTER_PORTAL_SERVER + '/api/certificate_sync/get_certificate', post_data);
          const certificates = await response.json();

          await fs.writeFile(`certificates/${filename}`, certificates.certificate_base64, 'base64');

          if (master_certificate_filename) {
            await fs.writeFile(`mastercertificates/${master_certificate_filename}`, certificates.master_certificate_base64, 'base64');
          }
        }
        catch (err) {
          console.log(err)
          return;
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
