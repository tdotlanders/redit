const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const dbUrl = process.env.DB_URL;

const client = new MongoClient(dbUrl);

// Database Name
const dbName = "Cluster0";

app.use(express.json());

async function start(app) {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("subreddits");
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.post("/subreddits", async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and description are required" });
      }
      const newSubreddit = { name, description };
      const result = await collection.insertOne(newSubreddit);

      res.status(201).json({
        message: "Subreddit created successfully",
        subreddit: result.subredditId,
      });
    } catch (error) {
      console.error("Error creating subreddit:", error);
      res.status(500).json({ error: "Unable to create subreddit" });
    }
  });

  app.post("/subreddits/:subredditId/posts", async (req, res) => {
    try {
      const { subredditId } = req.params; // Extract subredditId from URL params
      const { name, description } = req.body;

      if (!name || !description) {
        return res
          .status(400)
          .json({ mensagem: "Name and description are required" });
      }
      const newPost = { name, description, comments, subredditId };
      // Verify that the subreddit exists
      const subreddit = await collection.findOne({
        _id: ObjectId(subredditId),
      });
      if (!subreddit) {
        return res.status(404).json({ error: "Subreddit not found" });
      }
      // Add subredditId to the post data
      newPost.subredditId = ObjectId(subredditId);
      // Insert the post data into the posts collection
      const result = await collection.insertOne(newPost);
      res
        .status(201)
        .json({ message: "Post created successfully", post: result.newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Unable to create post" });
    }
  });

  app.listen(process.env.PORT, () => {
    console.log("server is running (express)");
  });
}

start(app)
  .then(() => console.log("start routine complete"))
  .catch((err) => console.log("star routine error: ", err));
