const logger = (req, res, next) => {
  console.log(`\n${new Date().toISOString()}`);

  next();
};

module.exports = logger;
