# Proyecto Lista de espera Boosmap

## Antecedentes

La aplicación Boosmap en Valparaíso, utiliza para llevar una lista de choferes disponibles para entrega de pedidos una hoja de Google Sheets. Esto es engorroso ya que los
choferes deben acceder a esta hoja a través de un link que está en un grupo de whatsapp, luego ir al libro que quieren consultar y luego buscar su nombre en una lista en la que pueden haber más de 300 filas donde se anotan todas las asistencias de los choferes.

## Expectativas

Lo que se busca con este proyecto es hacer más fácil esta búsqueda usando la API de Google Sheets para consultar los datos y mostrar al chofer la posición en que se encuentra en la lista, cuanto falta para su turno , cuáles son las 9 personas que están esperando antes que él y un link que te lleva a la hoja actual y a la celda donde estas registrado

## Explicación técnica

Este proyecto es una aplicación para analizar hojas de cálculo de Google Sheets y obtener información sobre ciertos datos. La aplicación utiliza la API de Google Sheets para acceder a las hojas de cálculo y analizar la información.

## Requisitos previos

Antes de utilizar esta aplicación, se deben cumplir los siguientes requisitos:

Tener acceso a una cuenta de Google con permisos para acceder a las hojas de cálculo que se deseen analizar.
Crear un proyecto de Google Cloud Platform y habilitar la API de Google Sheets.
Crear un archivo de credenciales de servicio para la cuenta de Google y guardar el archivo en una ubicación segura.
Instalar Node.js y npm en el equipo.

## Instalación

Para instalar la aplicación, siga los siguientes pasos:

Clone el repositorio de GitHub en su equipo.

Abra una terminal en la carpeta raíz del proyecto y ejecute el comando npm install para instalar las dependencias del proyecto.

Cree un archivo .env en la carpeta raíz del proyecto y añada las siguientes variables de entorno:

GOOGLE_APPLICATION_CREDENTIALS=/ruta/al/archivo/credentials.json
SPREADSHEET_ID=id_de_la_hoja_de_cálculo
Asegúrese de reemplazar /ruta/al/archivo/credentials.json con la ruta al archivo de credenciales de servicio que ha creado y id_de_la_hoja_de_cálculo con el ID de la hoja de cálculo que desea analizar.

## Uso

Para utilizar la aplicación, siga los siguientes pasos:

Abra una terminal en la carpeta raíz del proyecto.
Ejecute el comando npm start para iniciar la aplicación.
Abra un navegador web y vaya a http://localhost:3000.
Introduzca los datos requeridos en el formulario de la página y haga clic en el botón "Obtener datos".
La aplicación analizará la hoja de cálculo y mostrará los resultados en la página.

## Estructura del proyecto

El proyecto está estructurado de la siguiente manera:

credentials/: Esta carpeta contiene el archivo json que se descarga cuando creas el acceso a google Auth
src/: Esta carpeta contiene los archivos fuente de la aplicación.
getSheetData.js: Este archivo contiene el código del servidor Node.js que se encarga de manejar las solicitudes HTTP y de analizar las hojas de cálculo.
public/: Esta carpeta contiene los archivos públicos de la aplicación, como los archivos CSS y JavaScript que se utilizan en la página web.
package.json: Este archivo define las dependencias del proyecto y otros metadatos de la aplicación.

## Vista cliente

En vez de mostrar toda una hoja de excel con 300 o más filas se mostraría una imagen como esta:

![Vista Cliente](/readme_img/vista_cliente.jpg);

## Notas Finales

Espero que este proyecto haya sido útil para ti. Si tienes alguna pregunta, no dudes en crear un issue en el repositorio o enviarme un mensaje directo. Si encuentras un error o tienes sugerencias para mejorar el proyecto, también eres bienvenido a crear un issue o enviar una pull request.
