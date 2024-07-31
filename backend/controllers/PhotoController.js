const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

// Insirir uma foto com usuario relacionado

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Criando a foto

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // Verificar se a foto foi criada com sucesso

  if (!newPhoto) {
    res.status(422).json({ errors: ["Houve um problema, tente novamente"] });
    return;
  }

  res.status(201).json(newPhoto);
};

// Excluir foto do DB

const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    // // Verificar se a foto existe

    if (!photo) {
      res.status(404).json({ erros: ["Foto não encontrada"] });
      return;
    }

    // Verificar se a foto é do user

    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({ errors: ["Ocorreu um erro, tente novamente"] });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluida com sucesso" });
  } catch (error) {
    res.status(404).json({ erros: ["Foto não encontrada!!!!!!!"] });
    return;
  }
};

// Pegar todas as fotos do DB

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Pegar todas as fotos do user

const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
};
