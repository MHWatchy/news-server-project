exports.selectArticle = () => {
    return db.query("SELECT * FROM articles").then((data) => {
        console.log(data.rows)
        return data.rows
    })
}