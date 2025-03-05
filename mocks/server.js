const jsonServer = require("json-server");
const { setupDatabase } = require("./databases/setupDatabase");
const setupRoutes = require("./routes/Routes");
const logger = require("./middlewares/logger");

const dbFilePath = setupDatabase();
const server = jsonServer.create();
const router = jsonServer.router(dbFilePath);
const middlewares = jsonServer.defaults({
  logger: true,
});
const db = router.db;

server.use(middlewares);
server.use(logger);

setupRoutes(server, db);
server.use(router);

const PORT = 3000;
server
  .listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
