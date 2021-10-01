const server = require("express")();
server.set("view engine", "pug");
server.set("views", "./views");
libBooks = require("./data/books.json")

server.get("/", (req, res) => {
  res.render("main", {
    user_name: "Ruslan",
    books: libBooks.books
  })
})

server.get("/styles/:filename", (req, res) => {
  res.sendFile(__dirname + "/styles/" + req.params.filename);
})

server.get("/images/:image", (req, res) => {
  res.sendFile(__dirname + "/images/" + req.params.image);
})

const port = 3000
server.listen(port, () => {
  console.log(`Server starts listening on port ${port}`)
})