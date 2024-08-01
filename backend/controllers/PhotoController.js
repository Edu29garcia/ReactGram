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

// Pegando foto pelo ID
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(id);
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }
};

// Atualizar a foto

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let image;

  if (req.file) {
    image = req.file.filename;
  }

  const reqUser = req.user;

  const photo = await Photo.findById({ _id: id });

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // Verificar se pertence ao user
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// Likes nas fotos

const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // Verificar se a foto ja foi cutida

  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ erros: ["Você já curtiu a foto"] });
    return;
  }

  //Colocar o id do user num aray

  photo.likes.push(reqUser._id);
  photo.save();
  res
    .status(200)
    .json({ photo: id, userId: reqUser._id, message: "A foto foi curtida" });
};

// Comentarios
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada!"] });
    return;
  }

  // Colocar o comentario no array

  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);
  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: "O comentario foi adicionado com sucesso",
  });
};

// Busca de imagens pelo titulo
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
