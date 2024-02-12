const Certificate = require("../models").Certificate;

const create = async (req, res) => {

    try {

        const file = req.file;

        // console.log(req.file.filename);
        console.log(req.body);

        // return res.json({ msg: "File uploaded successfully" });

        const customer_obj = {
            filename: req.file.filename,

            srfId: req.body.srfId,
            srfNo: req.body.srfNo,

            name: req.body.name,
            make: req.body.make,
            model: req.body.model,
            serialno: req.body.serialno,

            idno: req.body.idno,
            rstatus: 1,

            companyId: req.body.companyId,
        }
        // return res.json(customer_obj);

        const newCertificate = new Certificate(customer_obj);
        const result = await newCertificate.save();
        return res.json(result);

    } catch (err) {
        console.log(err);
    }
}

exports.create = create;