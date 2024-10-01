const Certificate = require("../models").Certificate;

const create = async (req, res) => {

    try {
        const customer_obj = {
            filename: req.files.file[0].filename,

            srfId: req.body.srfId,
            srfNo: req.body.srfNo,

            name: req.body.name,
            make: req.body.make,
            model: req.body.model,
            serialno: req.body.serialno,

            idno: req.body.idno,
            rstatus: 1,

            companyId: req.body.companyId,
            master_certificate_filename: req.files?.masterfile?.[0]?.filename || null
        }
        const newCertificate = new Certificate(customer_obj);
        const result = await newCertificate.save();
        return res.json(result);

    } catch (err) {
        console.log(err);
    }
}

exports.create = create;