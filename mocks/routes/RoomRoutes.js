const setupRoomRoutes = (server, db) => {
  server.get("**/rooms?*", (req, res) => {
    const rooms = db.get("rooms").value();
    res.json({ rooms });
  });
};

module.exports = setupRoomRoutes;
