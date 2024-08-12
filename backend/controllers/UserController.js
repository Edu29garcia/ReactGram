const User = require("../models/User");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Gerar o token do user

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Registro e login do user

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o user existe
  const user = await User.findOne({ email });
  if (user) {
    res.status(422).json({ erros: ["Por favor utilize outro email"] });
    return;
  }

  // Gerar a senha criptografada
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar usuário
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // Verificar se o usuário foi criado com sucesso para retornar o token
  if (!newUser) {
    res.status(422).json({ erros: "Ocorreu um erro, tente novamente" });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Login do user
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Verificar se o user existe
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });
    return;
  }

  // Verificar se a senha está correta
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida"] });
    return;
  }

  //Retornar o user com o token
  res.status(201).json({
    _id: user.id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Pegar o user logado
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// Update do user
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

// Pegar um user pelo ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(
      mongoose.Types.ObjectId.createFromHexString(id)
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado!"] });
    return;
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
