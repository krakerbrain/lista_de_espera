const { google } = require("googleapis");
const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function getSheetData(sheet, nombre) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const sheet_name = sheet;
  const sheetGid = await getSheetGid(sheet);
  // const uniqueNames = await getUniqueNames(sheet_name, "B");
  const range = sheet_name + "!A3:B500";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
  });

  let falseCount = 0;
  let lastMarioIndex = -1;
  let nextTrueIndex = response.data.values.length;
  const nombre_usuario = nombre;
  const falseNames = [];
  const falseNamesPositions = [];

  // Buscar el índice del último "MARIO MONTENEGRO"
  for (let i = response.data.values.length - 1; i >= 0; i--) {
    if (response.data.values[i][1] === nombre_usuario) {
      lastMarioIndex = i;
      break;
    }
  }

  // Buscar el índice del próximo "TRUE" después del último "MARIO MONTENEGRO"
  if (lastMarioIndex !== -1) {
    for (let i = lastMarioIndex + 1; i < response.data.values.length; i++) {
      if (response.data.values[i][0] === "TRUE") {
        nextTrueIndex = i;
        break;
      }
    }
  }

  // Contar el número de usuarios en "FALSE" hasta el próximo "TRUE" después del último "MARIO MONTENEGRO"
  for (let i = lastMarioIndex - 1; i >= 0 && i < nextTrueIndex; i--) {
    if (response.data.values[i][0] === "FALSE") {
      falseCount++;
      if (falseNames.length < 9) {
        falseNames.push(response.data.values[i][1]);
        falseNamesPositions.push(i + 3); // Sumar 3 para ajustar el índice de base cero
      }
    }
  }

  return { falseCount, falseNames, falseNamesPositions, sheetGid };
}

async function getSheetGid(sheetName) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: false,
  });

  const sheet = response.data.sheets.find((sheet) => sheet.properties.title === sheetName);

  if (sheet) {
    return sheet.properties.sheetId;
  } else {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }
}

async function getUniqueNames(sheet) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const sheet_name = sheet;
  const range = sheet_name + "!B2:B";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
  });

  const namesSet = new Set(response.data.values.flat());
  const uniqueNames = Array.from(namesSet);
  return uniqueNames;
}
module.exports = { getSheetData, getUniqueNames };
