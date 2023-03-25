$(document).ready(function () {
  // Obtener la fecha actual
  var today = new Date();

  // Formatear la fecha actual como "dd-mm"
  var formattedDate = $.datepicker.formatDate("dd-mm", today);

  // Establecer el valor del campo de entrada como la fecha actual formateada
  $("#nombre_hoja").val(formattedDate);

  // Inicializar el datepicker
  $("#nombre_hoja").datepicker({
    dateFormat: "dd-mm",
    // Otras opciones del datepicker aquí
  });
});
