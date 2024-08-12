const User = require("../models/User");

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

module.exports = {
  register,
  login,
};
