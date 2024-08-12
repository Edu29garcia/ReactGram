const Photo = require("../models/Photo");
const mongoose = require("mongoose");

// Inserir uma foto com um user relacionado
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  console.log(req.body);

  res.send("photo insert");
};

module.exports = {
  insertPhoto,
};
