const { returnEndpoints } = require("../models/api.models")
const endpoints = require("../endpoints.json")

exports.getApi = (req, res, err) => {
    returnEndpoints().then(() => {
        res.status(200).send({endpoints})
    })
}