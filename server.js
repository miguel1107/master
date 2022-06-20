const express = require("express");
const bodyParser = require("body-parser");

// App
const app = express();
app.use(bodyParser.json());

// Constants
const hostname = "localhost"; // host
const port = 3000; // port
const MongoClient = require("mongodb").MongoClient; // Connect to mongodb server
const url = "mongodb://docker:mongopw@localhost:49153"; //Your url connection to mongodb container
const jsonData = require("./data.json"); // data for database

/* Get DateTime, timezone and offset */
function returnTimestamp() {
  const date = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var offset_minutes = date.getTimezoneOffset();
  if (offset_minutes <= 0) {
    var offset = "UTC+" + (offset_minutes / -60).toString();
  } else {
    var offset = "UTC" + (offset_minutes / -60).toString();
  }
  /** formato fecha */
  let fecha;
  fecha =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  return [fecha, timezone, offset];
}

// GET method route
// Set collection
app.get("/setdata", function (req, res) {
  jsonData.forEach((element) => {
    let myobj = {
      message: element.message,
      country: element.country,
      name: element.name,
      date: returnTimestamp()[0],
      location: returnTimestamp()[1],
      offset: returnTimestamp()[2],
    };
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("master_task");
      dbo.collection("test").insertOne(myobj, function (errs, resp) {
        if (errs) {
          res.status(500).json({
            code: 500,
            message: errs,
          });
          throw errs;
        }
        db.close();
      });
    });
  });
  res.status(200).json({
    code: 200,
    message: `Document inserted in database.`,
  });
});

// GET method route
// Retrieve all documents in collection
app.get("/", function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("master_task");
    dbo
      .collection("test")
      .find()
      .toArray()
      .then((results) => {
        res.status(200).json({ code: 200, data: results });
      })
      .catch((error) => console.error(error));
  });
});

// GET method route
// Query by country
app.get("/find/:country", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("master_task");
    dbo
      .collection("test")
      .find({
        country: req.params.country,
      })
      .toArray()
      .then((results) => {
        res.statusCode = 200;
        res.send(results);
      })
      .catch((error) => console.error(error));
  });
});

/* PUT method.
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
app.put("/update/:name", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("master_task");
    var myquery = { name: req.params.name };
    var newvalues = {
      $set: {
        message: "update",
        name: req.body.name,
        country: req.body.country,
        date: returnTimestamp()[0],
        location: returnTimestamp()[1],
        offset: returnTimestamp()[2],
      },
    };
    const options = { upsert: true };
    dbo
      .collection("test")
      .updateOne(myquery, newvalues, options, function (errs, resp) {
        if (errs) {
          res.status(500).json({
            code: 500,
            message: errs,
          });
          throw errs;
        }
        if (resp.modifiedCount == 1) {
          res.status(200).json({
            code: 200,
            message: "edited correctly!!",
          });
        } else {
          res.status(201).json({
            code: 201,
            message: "registered correctly!!",
          });
        }
        db.close();
      });
  });
});

/* DELETE method.
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
app.delete("/delete/:name", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("master_task");
    var del = { name: req.params.name };
    dbo.collection("test").deleteOne(del, function (errs, resp) {
      if (errs) throw errs;
      if (resp.deletedCount == 1) {
        console.log("1");
        res.status(200).json({
          code: 200,
          message: "deleted correctly!!",
        });
      } else {
        res.status(204).json({
          code: 204,
          message: "not found, do nothing!!",
        });
      }
      db.close();
    });
  });
});
// ...

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);