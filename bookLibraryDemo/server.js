// server.js
var application_root = __dirname;
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

// create server
var app = express();

// connect to database
mongoose.connect('mongodb://localhost/library_db');

// schemas
var Keywords = new mongoose.Schema({
    keyword: String
});

var Book = new mongoose.Schema({
    title: String,
    author: String,
    releaseDate: Date,
    keywords: [Keywords]
});


// models
var BookModel = mongoose.model('Book', Book);

// server configurations
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.Router());
app.use(express.static(path.join(application_root, 'site')));
app.use(errorHandler());

// Routes
app.get('/api', function(request, response) {
    response.send('Library API is running!');
});
// get a list of all books
app.get('/api/books', function(request, response) {
    return BookModel.find(function(err, books) {
        if(!err) {
            return response.send(books);
        } else {
            return console.log(err);
        }
    });
});

// insert a new book
app.post('/api/books', function(request, response) {
    var book = new BookModel({
        title: request.body.title,
        author: request.body.author,
        releaseDate: request.body.releaseDate,
        keywords: request.body.keywords
    });

    book.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
    return response.send(book);
});

// get a single book by id
app.get('/api/books/:id', function(request, response) {
    return BookModel.findById(request.params.id, function(err, book) {
        if(!err) {
            return response.send(book);
        } else {
            return console.log(err);
        }
    });
});


// jQuery.get('/api/books/59184c825d50be120ec47e96', function(data, textStatus, jqXHR){
// console.log('get response:');
// console.dir(data);
// console.log(textStatus);
// console.dir(jqXHR);
// });

// update a book
app.put('/api/books/:id', function(request, response) {
    console.log('Updating book ' + request.body.title);
    return BookModel.findById(request.params.id, function(err, book) {
        book.title = request.body.title;
        book.author = request.body.author;
        book.releaseDate = request.body.releaseDate;
        book.keywords = request.body.keywords;

        return book.save(function(err) {
            if(!err) {
                console.log('book updated!');
            } else {
                console.log(err);
            }
            return response.send(book);
        });
    });
});

// delete a book
app.delete('/api/books/:id', function(request, response) {
    console.log('Deleting book with id: ' + request.params.id);
    return BookModel.findById(request.params.id, function(err, book) {
        return book.remove(function(err) {
            if(!err) {
                console.log('Book removed!');
                return response.send('');
            } else {
                console.log(err);
            }
        });
    });
});

// start server
var port = 4711;
app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
