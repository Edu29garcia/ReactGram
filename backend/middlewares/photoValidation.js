const (body) = require("express-validator")

const photoInsertvalidation = ()=>{

    return[
        body("title")
        .not()
        .equals("undefine")
        .withmessage("O titulo é obrigatório")
        .isString()
        .withmessage("O titulo é obrigatório")
        .isLength({min: 3})
        .withmessage("O titulo deve ter pelo menos 3 caracteres"),

        body("image")
        .custom((value, {req}) => {
            if(!req.file) { throw new Error("A imagem é obrigario")} return true
        })
        
    ]
}

module.exports = {
    photoInsertvalidation
}