const express = require("express");
const router = express.Router();

// Controler
const { register, login } = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/userValidations");

//Rotas
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

module.exports = router;
