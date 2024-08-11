const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Gerar o token do user

const generateToken = (id) => {
  return jwt.sign({ id }, jwt, { expiresIn: "7d" });
};

// Registro e login do user

const register = async (req, res) => {
  res.send("registro");
};

module.exports = {
  register,
};
