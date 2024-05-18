const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  
  return res.status(200).send("User successfully logged in");
  
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbnFound = false;
  Object.keys(books).forEach((isbn) => {
    if (isbn === req.params.isbn) {
      books[isbn].reviews[req.session.authorization.username] = req.body.review;
      isbnFound = true;
      console.log(req.body.review);
    }
  });
  if (!isbnFound) {
    res.status(400).json({message: "Book by this isbn not found"});
  } else {
    return res.status(200).send("Review successfully added");
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
