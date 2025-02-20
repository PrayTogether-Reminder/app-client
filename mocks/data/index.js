const roomsData = require("./rooms")();

module.exports = () => {
  return {
    rooms: roomsData.rooms,
  };
};
