const router = require("express").Router();

// Get the books data from the server
let libBooks = require("./data/books.json")

// Main page
router.get("/", (req, res) => {
  res.render("main", {
    user_name: "Ruslan",
    books: libBooks.books
  })
})

// Access to the certain style
router.get("/styles/:css_file_name", (req, res) => {
  res.sendFile(__dirname + "/styles/" + req.params.css_file_name);
})

// Access to an image
router.get("/images/:image", (req, res) => {
  res.sendFile(__dirname + "/images/" + req.params.image);
})

module.exports = router