require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { getSheetData, getUniqueNames, getFalseUntilLastUser, getFalseUsersUntilFirstTrue, getSheetGid } = require("./getSheetData.js");
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
  res.json(sheetData);
});

app.post("/get-gid", async (req, res) => {
  const { sheet } = req.body;
  const sheetData = await getSheetGid(sheet);
  res.json(sheetData);
});

app.post("/get-todo-chofer", async (req, res) => {
  const { user, sheet } = req.body;
  const sheetData = await getFalseUntilLastUser(sheet, user);
  res.json(sheetData);
});
app.post("/get-todo", async (req, res) => {
  const { user, sheet } = req.body;
  const sheetData = await getFalseUsersUntilFirstTrue(sheet);
  res.json(sheetData);
});

// Iniciamos el servidor en el puerto 3000
app.listen(port, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
