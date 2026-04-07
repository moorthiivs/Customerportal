
const create = async (req, res, next) => {

    console.log(req);

    return res.json({ msg: true });
}

exports.create = create;