//Image schema
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    url: String,
    public_id: String,
  });
  
  const File = mongoose.model("File", fileSchema);

  module.exports = File;