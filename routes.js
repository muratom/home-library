const router = require("express").Router();

let userName = "anonymous";

// Get the books data from the server
let libBooks = require("./data/books.json").books;
let curId = libBooks.length + 1;

// Introduction page
router.get("/", (req, res) => {
  res.render("intro2", {
    user_name: ""
  });
});

router.post("/auth", (req, res) => {
  userName = req.body.user_name === "" ? "anonymous" : req.body.user_name;
  res.redirect("/books");
});

// router.post("/books", (req, res) => {
//   res.render("main", {
//     user_name: userName,
//     books: libBooks
//   });
// });

router.get("/books", (req, res) => {
  res.render("main", {
    user_name: userName,
    books: libBooks
  });
});

router.get("/books/add_book", (req, res) => {
  res.render("add_new_book", {
    user_name: userName
  });
});

router.get("/books/delete_book", (req, res) => {
  res.render("delete_book", {
    user_name: userName
  });
});

// For adding a new book
router.post("/books/adding", (req, res) => {
  let newBook = {
    "id": curId,
    "title": req.body.title,
    "author": req.body.author,
    "published": req.body.published,
    "coverUrl": req.body.coverUrl === "" ? null : req.body.coverUrl,
    "isInStock": true,
    "whoTook": null,
    "whenMustReturn": null
  };
  if (!newBook.title ||
    !newBook.author ||
    !newBook.published) {
    res.status(400);
    res.json({message: "Bad request"});
  } else {
    ++curId;
    libBooks.push(newBook);
    res.redirect("/books");
  }
});

router.post("/books/deleting", (req, res) => {
  console.log("router.post /books/deleting");

  const removeIndex = libBooks.map((book) => {
    return parseInt(book.id);
  }).indexOf(parseInt(req.body.id));

  if (removeIndex === -1) {
    // console.log("In condition");
    res.send("Invalid ID: cannot find the book")
  } else {
    // console.log("After condition")
    libBooks.splice(removeIndex, 1);
    res.redirect("/books");
  }
});

// router.get("/books", (req, res) => {
//   res.render("main", {
//     user_name: userName,
//     books: libBooks.books
//   });
// });

router.get("/books/:id([0-9]{1,})", (req, res) => {
  let reqBook = libBooks.filter(b => {
    if (b.id === Number(req.params.id)) {
      return true;
    }
  });
  if (reqBook.length === 0) {
    res.status(404).send("Book not found");
  }
  res.render("book", {
    user_name: userName,
    book: reqBook[0]
  })
});

router.get("/books/:id([0-9]{1,})/edit", (req, res) => {
  let reqBook = libBooks.filter(b => {
    if (b.id === Number(req.params.id)) {
      return true;
    }
  });
  if (reqBook.length === 0) {
    res.status(404).send("Book not found");
  }

  res.render("book_edit", {
    user_name: userName,
    book: reqBook[0]
  });
});

router.post("/books/:id([0-9]{1,})/update", (req, res) => {
  const reqBookIndex = libBooks.map((book) => {
    return parseInt(book.id);
  }).indexOf(parseInt(req.params.id));

  // Check validation
  const body = req.body;
  libBooks[reqBookIndex].title = body.title !== "" ? body.title : libBooks[reqBookIndex].title;
  libBooks[reqBookIndex].author = body.author !== "" ? body.author : libBooks[reqBookIndex].author;
  libBooks[reqBookIndex].published = body.published !== "" ? body.published : libBooks[reqBookIndex].published;
  libBooks[reqBookIndex].coverUrl = body.coverUrl === "" ? null : body.coverUrl;

  res.redirect("/books/" + req.params.id);
});

router.get("/books/:id([0-9]{1,})/take", (req, res) => {
  if (userName === "anonymous") {
    res.status(400).send("You didn't enter your name so you cannot take the book")
  } else {
    const curBookIndex = libBooks.map((book) => {
      return parseInt(book.id);
    }).indexOf(parseInt(req.params.id));

    libBooks[curBookIndex].isInStock = false;
    libBooks[curBookIndex].whoTook = userName;
    let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    let today = new Date();
    let returnDate = new Date();
    returnDate.setDate(today.getDate() + 30);
    libBooks[curBookIndex].whenMustReturn = returnDate.toLocaleString("ru-RU", dateOptions);

    res.redirect("/books/" + req.params.id);
  }
});

router.get("/books/:id([0-9]{1,})/return", (req, res) => {
  const curBookIndex = libBooks.map((book) => {
    return parseInt(book.id);
  }).indexOf(parseInt(req.params.id));

  if (libBooks[curBookIndex].whoTook === userName) {
    libBooks[curBookIndex].isInStock = true;
    libBooks[curBookIndex].whoTook = null;
    libBooks[curBookIndex].whenMustReturn = null;
    res.redirect("/books/" + req.params.id);
  } else {
    res.send("You cannot return book which you didn't take")
  }
});

router.post("/books/filter", (req, res) => {
  const type = req.body.option;
  let copyLibBooks = libBooks.slice();
  switch (type) {
    case "all":
      break;
    case "by_title":
      copyLibBooks.sort((a, b) => (a.title > b.title) ? 1 : (a.title < b.title ? -1 : 0));
      break;
    case "by_stock":
      // copyLibBooks.sort((a, b) => (a.isInStock && !b.isInStock) ? -1 : ((!a.isInStock && b.isInStock) ? 1 : 0));
      copyLibBooks = copyLibBooks.filter((b) => {
        return b.isInStock;
      });
      break;
    case "by_return_date":
      copyLibBooks = copyLibBooks.filter((b) => {
        return !b.isInStock;
      });
      copyLibBooks.sort((a, b) => {
        if (a.whenMustReturn && b.whenMustReturn) {
          return (Date.parse(a.whenMustReturn) > Date.parse(b.whenMustReturn)) ? 1 :
            (Date.parse(a.whenMustReturn) < Date.parse(b.whenMustReturn) ? -1 : 0);
        } else if (a.whenMustReturn) {
          return 1;
        } else if (b.whenMustReturn) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    default:
      res.render("book_list", {
        user_name: userName,
        books: copyLibBooks
      });
  }

  res.render("book_list", {
    user_name: userName,
    books: copyLibBooks
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

router.get("/:js_file_name", (req, res) => {
  res.sendFile(__dirname + "/" + req.params.js_file_name);
})

module.exports = router;


