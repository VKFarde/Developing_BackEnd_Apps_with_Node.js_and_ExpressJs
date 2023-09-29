const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

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

  async function fetchBooks() {
    try {
      const response = await axios.get('URL_TO_FETCH_BOOKS');
      // Replace 'URL_TO_FETCH_BOOKS' with the actual URL of your API
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch books: ' + error.message);
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
  //Write your code here
  //return res.status(200).send(JSON.stringify(books,null,4));
  try {
    const books = await fetchBooks();
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).send('Error: ' + error.message);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  return res.status(200).send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authers = Object.values(books).filter((book)=>{
    return book.author === author 
  });

  return res.status(200).send(authers)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titles = Object.values(books).filter((book)=>{
      return book.title === title 
    });
  
    return res.status(200).send(titles)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book.reviews)
});

module.exports.general = public_users;
