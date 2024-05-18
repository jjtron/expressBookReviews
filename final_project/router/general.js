const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => { 
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve,reject) => {
    resolve(JSON.stringify(books,null,4))
  }).then((books) => {
    res.status(200);
    res.send(books);
  });
  return;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    new Promise((resolve,reject) => {
      resolve(JSON.stringify(book,null,4))
    }).then((book) => {
      res.status(200);
      res.send(book);
    });
  } else {
    res.status(400).json({message: "ISBN Not found"});
  }
  return;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve,reject) => {
    let booksByAuthor = [];
    Object.keys(books).forEach((book) => {
      Object.keys(books[book]).forEach((detail) => {
        if (detail === 'author' && req.params.author === books[book].author) {
          booksByAuthor.push(books[book])
        }
      });
    });
    if (booksByAuthor.length === 0) {
      reject();
    } else {
      resolve(JSON.stringify(booksByAuthor,null,4));
    }
  }).then((booksByAuthor) => {
    res.status(200);
    res.send(booksByAuthor);
  }).catch(() => {
    res.status(400).json({message: "Books by this author not found"});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve,reject) => {
    let booksByTitle = [];
    Object.keys(books).forEach((book) => {
      Object.keys(books[book]).forEach((detail) => {
        if (detail === 'title' && req.params.title === books[book].title) {
          booksByTitle.push(books[book])
        }
      });
    });
    if (booksByTitle.length === 0) {
      reject();
    } else {
      resolve(JSON.stringify(booksByTitle,null,4));
    }
  }).then((booksByTitle) => {
    res.status(200);
    res.send(booksByTitle);
  }).catch(() => {
    res.status(400).json({message: "Books by this title not found"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviewByISBN = null;
  Object.keys(books).forEach((isbn) => {
    if (isbn === req.params.isbn) {
      reviewByISBN = books[isbn].reviews;
    }
  });
  if (reviewByISBN) {
    res.status(200);
    res.send(reviewByISBN);
  } else {
    res.status(400).json({message: "This ISBN is not found"});
  }
});

module.exports.general = public_users;
