const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

// Inserir uma foto com um user relacionado
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Criar a foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // Verifica se a foto foi criada
  if (!newPhoto) {
    res
      .status(422)
      .json({ erros: ["Houve um problema, tenta novamente mais tarde"] });
    return;
  }

  res.status(201).json(newPhoto);
};

// Deletar foto do db
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // Verificar se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
      return;
    }

    // Verificar se a foto é do usuário
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({ errors: ["Ocorreu um erro tente novamente"] });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }
};

// Pegat todas as fotos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

// Pegar as fotos do user
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

// Pegar foto pelo ID
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

  // Verifica se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }

  res.status(200).json(photo);
};

// Update foto
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // Verificar se a foto é do user
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({ errors: ["Ocorreu um erro, tente novamente"] });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
};

// Likes em fotos
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // Verificar se já deu like
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["Você já curtiu a foto"] });
    return;
  }

  // Adicionar o user o array de likes

  photo.likes.push(reqUser._id);

  await photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida" });
};

// Função de comentarios
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  // Verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // adicionando comentario no array

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

// Busca de imagem por texto
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
