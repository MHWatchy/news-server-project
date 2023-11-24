const { selectAllTopics, createTopic } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.postTopic = (req, res, next) => {
  const {body} = req
  createTopic(body)
    .then((topic) => {
      res.status(201).send({ topic })
    })
    .catch(next)
}
