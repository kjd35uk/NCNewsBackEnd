const express = require("express");
const app = require("express")();
const mongoose = require("mongoose");
const { DB_URL } = process.env.NODE_ENV === 'production' ? process.env : require("./config");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/apiRouter");

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  res.send({ msg: "This is the homepage of Northcoders News" });
});

app.use((err, req, res, next) => {
  console.log('hey in next')
  console.log(err)
  if(err.status === 404) res.status(404).send({msg: err.msg});
  else if (err.status === 400) res.status(400).send({msg: err.msg})
  else res.status(500).send({msg: 'Internal server error'})
  });


module.exports = app;
