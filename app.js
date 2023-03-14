const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
var bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
const { json } = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const uri =
  "mongodb+srv://omkarpednekar2002:XCFYovJfWOlph5VA@testcluster.shhsf6z.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
  serverSelectionTimeoutMS: 10000,
});
const database = client.db("TodoList");

app.get("/", (req, res) => res.send("Hello world!"));
Users = database.collection("Users");
documents = database.collection("documents");

app.post("/login", async (req, res) => {
  const isuser = await Users.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (isuser) {
    res.send("OK");
  } else {
    res.send("LOGIN FAILED TRY AGAIN");
  }
});

app.post("/register", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  var rese = await Users.findOne({ email: user.email });
  if (rese) {
    res.send("USER EXISTS ALREADY");
  } else {
    Users.insertOne(user);
    res.send("USER CREATED");
  }
});

app.get("/gettodo", async (req, res) => {
  const todo = await documents.find({ email: req.query.email }).toArray();
  // console.log(todo);
  if (todo) {
    res.send(todo);
  } else {
    console.log("none");
  }
});

app.post("/posttodo", async (req, res) => {
  const added = documents.insertOne(req.body);
  res.send(added);
});

app.post("/deletenode", async (req, res) => {
  console.log(req.body.data);
  if (req.body.action === "done") {
    await documents.updateOne(
      {
        email: req.body.data.email,
        data: req.body.data.data,
        date: req.body.data.date,
      },
      {
        $set: {
          status: req.body.data.status === "Pending" ? "done" : "Pending",
        },
        // $set: { date: new Date() },
      }
    );
  } else {
    await documents.deleteOne({
      email: req.body.data.email,
      data: req.body.data.data,
      date: req.body.data.date,
    });
  }
  const todo = await documents.find({ email: req.body.data.email }).toArray();
  // console.log(todo);
  if (todo) {
    res.send(todo);
  } else {
    console.log("none");
  }
});

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Server running on port ${port}`));
