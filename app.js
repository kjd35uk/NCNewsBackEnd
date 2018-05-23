process.env.NODE_ENV = !process.env.NODE_ENV ? "dev" : "test"
const express = require('express');
const app = require('express')();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const {DB_URL} = require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter')

mongoose.connect(DB_URL)


app.use(bodyParser.json());
app.use('/api', apiRouter)



module.exports = app;
