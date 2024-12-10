const Certificate = require("../models").Certificate;

const create = async (req, res) => {

    try {
        const customer_obj = {
            filename: req.files.file[0].filename,

            srfId: req.body.srfId,
            srfNo: req.body.srfNo,
            srf_item_id: req.body.srf_item_id,

            name: req.body.name,
            make: req.body.make,
            model: req.body.model,
            serialno: req.body.serialno,

            idno: req.body.idno,
            rstatus: 1,

            companyId: req.body.companyId,
            master_certificate_filename: req.files?.masterfile?.[0]?.filename || null
        };

        const existssrfitem = await Certificate.findOne({
            where: {
                srfId: req.body.srfId,
                srfNo: req.body.srfNo,
                srf_item_id: req.body.srf_item_id,
            }
        });
        // new srf Item creation
        if (!existssrfitem) {
            const newCertificate = new Certificate(customer_obj);
            const result = await newCertificate.save();
            return res.json(result);
        }
        
        // srf item updation
        const update = await Certificate.update({ filename: customer_obj.filename }, {
            where: {
                id: existssrfitem.id,
            }
        });
        return res.json(update);

    } catch (err) {
        console.log(err);
    }
}

exports.create = create;