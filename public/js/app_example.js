// Seleccionamos el formulario y los campos de entrada que utilizaremos
const form = document.querySelector("#form-datos");
const nombreUsuarioInput = document.querySelector("#nombre_usuario");
const nombreHojaInput = document.querySelector("#nombre_hoja");

// Cuando el usuario salga del campo "nombre_usuario", convertimos su valor a mayúsculas
nombreUsuarioInput.addEventListener("blur", () => {
  nombreUsuarioInput.value = nombreUsuarioInput.value.toUpperCase();
});

// Cuando se envíe el formulario, evitamos que se recargue la página y realizamos la petición al servidor
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombreUsuario = nombreUsuarioInput.value;
  const nombreHoja = nombreHojaInput.value;

  // Realizamos una petición POST a la ruta "/get-sheet-data" en el servidor utilizando axios
  const response = await axios.post("/get-sheet-data", {
    user: nombreUsuario,
    sheet: nombreHoja,
  });

  // Mostramos los resultados obtenidos del servidor en el HTML
  document.querySelector(".results").style.display = "block";
  const { falseCount, falseNames, falseNamesPositions, sheetGid } = response.data;
  document.querySelector("#mensaje_retorno").innerHTML = `
    <p>Hay ${falseCount} pickers antes de ${nombreUsuario}</p> 
    <p>Los ${falseNames.length} últimos pickers antes de ${nombreUsuario} son:</p>
    `;
  document.querySelector("#lista_espera").innerHTML = "";
  for (let i = falseNames.length - 1; i >= 0; i--) {
    document.querySelector("#lista_espera").innerHTML += `<li>${falseNamesPositions[i]}.-${falseNames[i]}</li>`;
  }

  // Modificamos el enlace con el id "link_hoja" para que redireccione al documento de Google Sheets correspondiente
  // a la hoja y fila indicadas en la respuesta del servidor
  const linkHoja = document.querySelector("#link_hoja");
  linkHoja.href = `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=${sheetGid}&range=A${falseNamesPositions[0] + 1}`;
});
