const express = require("express");
const http = require("http");
require("dotenv").config();
require("./db/connection");
const { Post } = require("./db");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use("/users", routes.users);

app.get("/posts", async (_, res) => {
  const posts = await Post.find();
  res.json({ posts });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
