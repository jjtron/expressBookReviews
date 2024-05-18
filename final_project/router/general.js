const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200);
  res.send(JSON.stringify(books,null,4));
  return;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    res.status(200);
    res.send(JSON.stringify(book));
  } else {
    res.status(400).json({message: "ISBN Not found"});
  }
  return;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksByAuthor = [];
  Object.keys(books).forEach((book) => {
    Object.keys(books[book]).forEach((detail) => {
      if (detail === 'author' && req.params.author === books[book].author) {
        booksByAuthor.push(books[book])
      }
    });
  });
  if (booksByAuthor.length === 0) {
    res.status(400).json({message: "Books by this author not found"});
  } else {
    res.status(200);
    res.send(JSON.stringify(booksByAuthor,null,4));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksByTitle = [];
  Object.keys(books).forEach((book) => {
    Object.keys(books[book]).forEach((detail) => {
      if (detail === 'author' && req.params.title === books[book].title) {
        booksByTitle.push(books[book])
      }
    });
  });
  if (booksByTitle.length === 0) {
    res.status(400).json({message: "Books by this title not found"});
  } else {
    res.status(200);
    res.send(JSON.stringify(booksByTitle,null,4));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
