const { google } = require("googleapis");
const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function getAllSheetData(sheet) {
  const auth = new google.auth.GoogleAuth({
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

async function getSheetData(sheet, nombre) {
  const sheetData = await getAllSheetData(sheet);
  let falseCount = 0;
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
      falseCount++;
      if (falseNames.length < 9) {
        falseNames.push(sheetData[i].name);
        falseNamesPositions.push(i + 3); // Sumar 3 para ajustar el índice de base cero
      }
    }
  }

  return { falseCount, falseNames, falseNamesPositions };
}

// async function getSheetData(sheet, nombre) {
//   const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const sheets = google.sheets({ version: "v4", auth });
//   const sheet_name = sheet;
//   const sheetGid = await getSheetGid(sheet);
//   // const uniqueNames = await getUniqueNames(sheet_name, "B");
//   const range = sheet_name + "!A3:B500";

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     range: range,
//   });

//   let falseCount = 0;
//   let lastMarioIndex = -1;
//   let nextTrueIndex = response.data.values.length;
//   const nombre_usuario = nombre;
//   const falseNames = [];
//   const falseNamesPositions = [];

//   // Buscar el índice del último "MARIO MONTENEGRO"
//   for (let i = response.data.values.length - 1; i >= 0; i--) {
//     if (response.data.values[i][1] === nombre_usuario) {
//       lastMarioIndex = i;
//       break;
//     }
//   }

//   // Buscar el índice del próximo "TRUE" después del último "MARIO MONTENEGRO"
//   if (lastMarioIndex !== -1) {
//     for (let i = lastMarioIndex + 1; i < response.data.values.length; i++) {
//       if (response.data.values[i][0] === "TRUE") {
//         nextTrueIndex = i;
//         break;
//       }
//     }
//   }

//   // Contar el número de usuarios en "FALSE" hasta el próximo "TRUE" después del último "MARIO MONTENEGRO"
//   for (let i = lastMarioIndex - 1; i >= 0 && i < nextTrueIndex; i--) {
//     if (response.data.values[i][0] === "FALSE") {
//       falseCount++;
//       if (falseNames.length < 9) {
//         falseNames.push(response.data.values[i][1]);
//         falseNamesPositions.push(i + 3); // Sumar 3 para ajustar el índice de base cero
//       }
//     }
//   }

//   return { falseCount, falseNames, falseNamesPositions, sheetGid };
// }

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

module.exports = { getSheetData, getUniqueNames, getFalseUntilLastUser };
