const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));

// Teste de rota
router.get("/", (req, res) => {
  res.send("API working");
});

module.exports = router;
