const testController = (req, res) => {
  return res.json(process.env.Mongodb_URI);
};

module.exports = testController;