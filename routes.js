const router = require("express").Router();

const userName = "Ruslan";

// Get the books data from the server
let libBooks = require("./data/books.json");

// Main page
router.get("/", (req, res) => {
  res.render("main", {
    user_name: userName,
    books: libBooks.books
  });
});

router.get("/books/:id", (req, res) => {
  res.render("book", {
    user_name: userName,
    book: libBooks.books[req.params.id - 1]
  });
});

// Access to the style
router.get("/styles/:css_file_name", (req, res) => {
  res.sendFile(__dirname + "/styles/" + req.params.css_file_name);
});

// Access to the image
router.get("/images/:image", (req, res) => {
  res.sendFile(__dirname + "/images/" + req.params.image);
});

module.exports = router;

/*
TODO:
  Error handling
 */
