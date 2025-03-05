const fs = require("fs");
const path = require("path");

const setupDatabase = () => {
  const indexData = require("./index")();
  const dbFilePath = path.join(__dirname, "./db.json");
  fs.writeFileSync(dbFilePath, JSON.stringify(indexData, null, 2), "utf-8");
  return dbFilePath;
};

module.exports = { setupDatabase };
