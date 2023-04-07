const { google } = require("googleapis");
const fs = require("fs");
const xlsx = require("xlsx");
const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function getAllSheetData(sheet, isDevMode = false) {
  let auth;
  if (isDevMode) {
    const workbook = xlsx.readFile("./pruebas/ubicacion.xlsx");
    const sheet = workbook.Sheets["prueba"];
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    return sheetData
      .slice(1)
      .map((row) => {
        const active = row[0] === 1;
        const name = row[1] || ""; // Usar una cadena vacía si el valor es nulo o indefinido

        // Verificar si el campo "name" no está vacío antes de incluirlo en el resultado
        if (name.trim() !== "") {
          return {
            active,
            name,
          };
        }

        return null; // Omitir filas con campos vacíos
      })
      .filter(Boolean); // Filtrar los resultados nulos generados por las filas con campos vacíos
  } else {
    // En producción, utiliza las credenciales del entorno
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheet_name = sheet;
    const range = sheet_name + "!A:B";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: range,
    });

    return response.data.values.slice(2).map((row) => {
      return {
        active: row[0] === "TRUE",
        name: row[1],
      };
    });
  }
}

async function getSheetData(sheet, nombre) {
  const sheetData = await getAllSheetData(sheet);
  let lastMarioIndex = -1;
  let nextTrueIndex = sheetData.length;
  const nombre_usuario = nombre;
  const falseNames = [];
  const falseNamesPositions = [];

  // Buscar el índice del último "MARIO MONTENEGRO"
  for (let i = sheetData.length - 1; i >= 0; i--) {
    if (sheetData[i].name === nombre_usuario) {
      lastMarioIndex = i;
      break;
    }
  }

  // Buscar el índice del próximo "TRUE" después del último "MARIO MONTENEGRO"
  if (lastMarioIndex !== -1) {
    for (let i = lastMarioIndex + 1; i < sheetData.length; i++) {
      if (sheetData[i].active === true) {
        nextTrueIndex = i;
        break;
      }
    }
  }

  // Contar el número de usuarios en "FALSE" hasta el próximo "TRUE" después del último "MARIO MONTENEGRO"
  for (let i = lastMarioIndex - 1; i >= 0 && i < nextTrueIndex; i--) {
    if (sheetData[i].active === false) {
      falseNames.push(sheetData[i].name);
      falseNamesPositions.push(i + 2); // Sumar 2 para ajustar el índice de base cero
    } else {
      break; // Detener el bucle cuando se encuentre el primer "TRUE"
    }
  }

  return { falseCount: falseNames.length, falseNames, falseNamesPositions };
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
  const data = await getAllSheetData(sheet);

  const namesSet = new Set(data.map((row) => row.name));
  const uniqueNames = Array.from(namesSet);
  return uniqueNames;
}

async function getFalseUntilLastUser(sheet, nombre) {
  const sheetData = await getAllSheetData(sheet);
  let lastMarioIndex = -1;
  let falseNames = [];
  let lastTrueName = null;
  let lastTrueNameRow = null;
  let falseNamesRows = [];

  // Buscar el índice de la última vez que se anotó el usuario consultado
  for (let i = sheetData.length - 1; i >= 0; i--) {
    if (sheetData[i].name === nombre) {
      lastMarioIndex = i;
      break;
    }
  }

  // Recorrer los datos en orden inverso desde la última vez que se anotó el usuario consultado
  if (lastMarioIndex !== -1) {
    for (let i = lastMarioIndex; i >= 0; i--) {
      if (sheetData[i].active === true) {
        lastTrueName = sheetData[i].name;
        lastTrueNameRow = i + 2; // La fila en Sheets es el índice en el array + 2
        break;
      } else {
        falseNames.push(sheetData[i].name);
        falseNamesRows.push(i + 2); // La fila en Sheets es el índice en el array + 2
      }
    }
  }

  return {
    lastTrueName: {
      name: lastTrueName,
      row: lastTrueNameRow,
    },
    falseNames: falseNames
      .map((name, index) => ({
        name: name,
        row: falseNamesRows[index],
      }))
      .reverse(),
  };
}

async function getFalseUsersUntilFirstTrue(sheet) {
  const sheetData = await getAllSheetData(sheet);
  const falseNames = [];
  const falseNamesRows = [];

  // Buscar el índice del primer "TRUE" desde abajo hacia arriba
  let firstTrueIndex = -1;
  for (let i = sheetData.length - 1; i >= 0; i--) {
    if (sheetData[i].active === true) {
      firstTrueIndex = i;
      break;
    }
  }

  // Recorrer los datos desde abajo hacia arriba hasta el primer "TRUE"
  for (let i = sheetData.length - 1; i > firstTrueIndex; i--) {
    if (sheetData[i].active === false) {
      falseNames.push(sheetData[i].name);
      falseNamesRows.push(i + 2); // La fila en Sheets es el índice en el array + 2
    }
  }

  return {
    firstTrueName: {
      name: sheetData[firstTrueIndex]?.name || null,
      row: firstTrueIndex !== -1 ? firstTrueIndex + 2 : null, // La fila en Sheets es el índice en el array + 2
    },
    falseNames: falseNames.map((name, index) => ({
      name: name,
      row: falseNamesRows[index],
    })),
  };
}

module.exports = { getSheetData, getUniqueNames, getFalseUntilLastUser, getFalseUsersUntilFirstTrue, getSheetGid };
