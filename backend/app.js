require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// Configurando Json e tb no form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Resolvendo CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// // Diretorio de upload de imagens
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Conexão do banco de dados
require("./config/db.js");

//Rotas
const router = require("./routes/Routes.js");
app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
