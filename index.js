const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r0hn7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let productsCollection, ordersCollection;

app.get("/", (req, res) => {
  res.send("Node Express");
});

app.post("/addproducts", (req, res) => {
  const products = req.body;
  productsCollection
    .insertMany(products)
    .then((result) => res.send("Products added"));
});

app.post("/orders", (req, res) => {
  const order = req.body;
  console.log(order);
  ordersCollection
    .insertOne(order)
    .then((result) => res.send("Order completed"));
});

app.get("/products", (req, res) => {
  productsCollection.find({}).toArray((err, documents) => res.send(documents));
});

app.get("/products/:key", (req, res) => {
  productsCollection
    .findOne({ key: req.params.key })
    .then((product) => res.send(product))
    .catch((err) => res.send(err));
});

app.post("/cartproducts", (req, res) => {
  const productKeys = req.body;

  productsCollection
    .find({ key: { $in: productKeys } })
    .toArray((err, products) => res.send(products));
});

client.connect((err) => {
  // perform actions on the collection object
  productsCollection = client.db("ema-john").collection("products");
  ordersCollection = client.db("ema-john").collection("orders");

  if (!err) {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } else {
    console.log(err);
  }
});
