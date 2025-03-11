exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid article ID" });
    } else if (err.code === "42703") {
        res.status(400).send({ msg: "Invalid column name"})
    }
    next(err);
};

exports.handleCustomError = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
}