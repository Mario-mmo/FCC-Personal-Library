/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const { Book } = require('../schemas/book.js');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book
        .find({})
        .then(data => {
          return res.json(data);
        })
        .catch(err => {
          return res.send(err);
        });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) return res.send('missing required field title'); 

      const book = new Book({
        title,
        comments: [],
        commentcount: 0
      });

      book
        .save()
        .then((b) => {
          return res.json({
          title: b.title,
          _id: b._id
          })
        })
        .catch(err => {
          return res.send(err);
        });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book
        .deleteMany({})
        .then(data => {
          return res.send('complete delete successful');
        })
        .catch(err => {
          return res.send(err);
        });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book
      .findById(bookid)
      .then(book => {
        if (!book) return res.send('no book exists');
        return res.json(book);
      })
      .catch(err => {
        return res.send('no book exists');
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send('missing required field comment');

      Book
        .findById(bookid)
        .then(book => {
          book.comments.push(comment);
          book.commentcount = book.comments.length;
          book.save();
          return res.json(book);
        })
        .catch(err => {
          return res.send('no book exists');
        });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book
        .findByIdAndDelete(bookid)
        .then((book) => {
          if (!book) return res.send('no book exists');
          return res.send('delete successful');
        })
        .catch(() => {
          return res.send('no book exists');
        });
    });
  
};
