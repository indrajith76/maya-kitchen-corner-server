const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0iqyqsv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const servicesCollection = client
      .db("maya-kitchen-corner")
      .collection("services");
    const reviewsCollection = client
      .db("maya-kitchen-corner")
      .collection("reviews");

    app.get("/home/services", async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).limit(3).toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).toArray();
      res.send(services);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

    // review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews/:serviceId", async (req, res) => {
      const id = req.params.serviceId;
      const query = { serviceId: id };
      const review = await reviewsCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(review);
    });

    app.get("/myreviews/:userId", async (req, res) => {
      const id = req.params.userId;
      const query = { userId: id };
      const review = await reviewsCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(review);
    });

    app.get("/myreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const myReview = await reviewsCollection.findOne(query);
      res.send(myReview);
    });

    app.put("/myreview/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const review = req.body;
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          reviewMessage: review.review,
          ratingReview: review.rating,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updatedReview,
        option
      );
      res.send(result);
    });

    app.delete("/myreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Welcome to Maya's Kitchen server!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
