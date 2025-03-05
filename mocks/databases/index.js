const roomsData = require("./domains/rooms")();

module.exports = () => {
  return {
    rooms: roomsData.rooms,
  };
};
