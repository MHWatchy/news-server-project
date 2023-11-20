const { selectArticle } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    selectArticle().then((article) => {
        res.status(200).send({article})
    })
}