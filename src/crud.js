///// 
/////
/////
// Local let url = 'http://localhost:5001/'
// Servidor
export let url = 'http://node.daw.iesevalorpego.es:3001/';

////////////////////// Hi ha usuari registrat /////////////////////
export function thereIsUser() {
   const currentUser= localStorage.getItem("currentUser");
   if (currentUser === null) {
    window.location.href = "/access/login.html";
   }
}



////////////////////// Alta Element /////////////////////

export async function postData(url,endPoint, data = {}) {
  try {
    const response = await fetch(url + endPoint, {
      method: 'POST',  // Método HTTP
      headers: {
        'Content-Type': 'application/json'  // Tipo de contenido
      },
      body: JSON.stringify(data)  // Datos JSON a enviar
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud POST');
    }

    const result = await response.json();  // Espera la conversión de la respuesta a JSON
    console.log(result);  // Trabaja con la respuesta

  } catch (error) {
    console.error('Error:', error);  // Manejo de errores
  }
}

////////////////////// Obtindre nou ID de la taula /////////////////////

export async function getNewId(url,endPoint) {
  try {
    const response = await fetch(url + endPoint );  // Reemplaza 'data.json' con la ruta de tu archivo

    if (!response.ok) {
      throw new Error('Error al obtener el archivo JSON');
    }

    const data =  await response.json();
    const maxId = data.reduce((max, ele) => 
      (ele.id > max.id ? ele: max), data[0]);
    const newId= ++ maxId.id;
    return newId + '' ;

  } catch (error) {
    console.error('Error:', error);  // Manejo de errores
  }
}

////////////////////// Otindre tota la taula /////////////////////

export async function getData(url, endPoint) {
  try {
    const response = await fetch(url + endPoint );  // Reemplaza 'data.json' con la ruta de tu archivo

    if (!response.ok) {
      throw new Error('Error al obtener el archivo JSON');
    }

    return  await response.json();

  } catch (error) {
    console.error('Error:', error);  // Manejo de errores
  }
}

////////////////////// Eliminar Element /////////////////////
export async function deleteData(url, endPoint, id) {
  try {
    const response = await fetch(url + endPoint + '/' + id, {
      method: 'DELETE'  // Configuramos el método HTTP como DELETE
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud DELETE');
    }

    const result = await response.json();  // Si el servidor devuelve JSON en la respuesta
    console.log('Recurso eliminado:', result);

  } catch (error) {
    console.error('Error:', error);  // Manejo de errores
  }
}

////////////////////// Actualitzar Element /////////////////////

export async function updateId(url, endPoint, id,data) {
  try {
    const response = await fetch(url + endPoint + '/'+ id, {
      method: 'PATCH',  // Configuramos el método HTTP como PATCH
      headers: {
        'Content-Type': 'application/json'  // Tipo de contenido
      },
      body: JSON.stringify(data)  // Datos JSON a enviar
    });  

    if (!response.ok) {
      throw new Error('Error al actualizar el archivo JSON');
    }

    return  await response.json();

  } catch (error) {
    console.error('Error:', error);  // Manejo de errores
  }
}

//////
//////
//////

