exports.handleCustomError = (err, req, res, next) => {
    // console.log(err);
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
}