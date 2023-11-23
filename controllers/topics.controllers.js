const { selectAllTopics } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
  console.log("Get All Topics")
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics })
  }).catch(next)
}
