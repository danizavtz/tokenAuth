
exports.secure_route =  (req, res) => {
    req.sucesso = { msg: 'server up and running secure route'};
    res.status(200).json(req.sucesso);
};

exports.index = (req, res) => {
    res.status(200).json({msg: "server up and running"});
};

exports.fallback = (req, res) => {
    res.status(404).json({ errors: [{location: req.path, msg: 'Not found', param: null}]});
};
