const setupRoomRoutes = require("./RoomRoutes");

const setupRoutes = (server, db) => {
  setupRoomRoutes(server, db);
};

module.exports = setupRoutes;
