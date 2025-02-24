const apiVersion = require("./apiVersion");

const setupRoomRoutes = (server, db) => {
  server.get(apiVersion + "/rooms?", (req, res) => {
    const allRooms = db.get("rooms").value();
    if (req.query["after"] === "0") {
      res.json({ rooms: allRooms.slice(0, 10) });
    }

    if (req.query["after"] === "2024-04-05T07:34:38Z") {
      res.json({ rooms: allRooms.slice(11, 16) });
    }

    if (req.query["after"] === "2024-05-27T05:56:52Z") {
      res.json({ rooms: allRooms.slice(16) });
    }
  });
};

module.exports = setupRoomRoutes;
