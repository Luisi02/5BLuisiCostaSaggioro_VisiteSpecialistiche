const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const database = require("./database");
database.createTable();

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/insert", async (req, res) => {
  const accident = req.body.accident;
  try {
    await database.insert(accident);
    res.json({result: "ok"});
  } catch (e) {
    res.status(500).json({result: "ko"});
  }
})

app.get('/booking', async (req, res) => {
    const list = await database.select();
    res.json(list);
});

const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
  console.log("- server running on port: " + port);
});