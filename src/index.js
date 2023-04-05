require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { getSheetData, getUniqueNames, getFalseUntilLastUser } = require("./getSheetData.js");
const bodyParser = require("body-parser");

const HTML_DIR = path.join(__dirname, "/../public/");
app.use(express.static(HTML_DIR));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ruta para el archivo HTML con los inputs
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});

// ruta para recibir los datos del formulario y llamar a getSheetData
app.post("/get-sheet-data", async (req, res) => {
  const { user, sheet } = req.body;
  const sheetData = await getSheetData(sheet, user);
  res.send(sheetData);
});

// ruta para obtener la lista de nombres
app.get("/get-nombres", async (req, res) => {
  const { sheet } = req.query;
  const sheetData = await getUniqueNames(sheet);
  // console.log("index", sheetData);
  res.json(sheetData);
});
app.post("/get-todo", async (req, res) => {
  const { user, sheet } = req.body;
  const sheetData = await getFalseUntilLastUser(sheet, user);
  // console.log("index", sheetData);
  res.json(sheetData);
});

// Iniciamos el servidor en el puerto 3000
app.listen(port, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
