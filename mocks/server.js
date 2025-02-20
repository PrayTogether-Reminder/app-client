const fs = require("fs");
const path = require("path");
const indexData = require("./data/index")();

// Write the data from index.js to db.json
const dbFilePath = path.join(__dirname, "data/db.json");
fs.writeFileSync(dbFilePath, JSON.stringify(indexData, null, 2), "utf-8");

// json-server
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(dbFilePath);
const middlewares = jsonServer.defaults();
const db = router.db;

server.get("**/rooms?*", (req, res, next) => {
  if (req.method === "GET") {
    const rooms = db.get("rooms").value();
    res.json({ rooms });
  } else {
    next();
  }
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
