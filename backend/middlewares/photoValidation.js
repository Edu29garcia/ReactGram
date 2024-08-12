const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("tile")
      .not()
      .equals("undefine")
      .withMessage("O título é obrigatório")
      .isString()
      .withMessage("O título é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O título deve conter pelo menos 3 caracteres"),

    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória!");
      }
      return true;
    }),
  ];
};

module.exports = { photoInsertValidation };
