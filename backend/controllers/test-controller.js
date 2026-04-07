const Certificate = require("../models").Certificate;

const test = async (req, res, next) => {

    let certificates = await Certificate.findAll({});
    res.json({ certificates });
}

exports.test = test;