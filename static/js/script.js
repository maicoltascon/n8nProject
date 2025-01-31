// Esperar que el documento esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Obtener los elementos del formulario y botones
  const scrapeButton = document.getElementById("scrapeButton");
  const saveButton = document.querySelector('button[type="submit"]'); // Botón de guardar
  const scrapeForm = document.getElementById("scrapeForm");
  const urlInput = document.getElementById("url");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const priceInput = document.getElementById("price");

  // Agregar evento al botón para scrapear
  scrapeButton.addEventListener("click", async () => {
    const url = urlInput.value.trim();
    console.log(url);
    

    // Validar que la URL no esté vacía
    if (!url) {
      alert("Por favor ingresa una URL válida");
      return;
    }


      // Enviar la solicitud al endpoint de scraping
      const response = await fetch("/api/scraping/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }), // Enviar la URL al endpoint
      });

      console.log(response);
      

      // Verificar si la respuesta es correcta (status 200)
      if (response.ok) {
        const data = await response.json(); 
        console.log(data);
        // Obtener los datos en JSON

        // Rellenar el formulario con los datos obtenidos
        nameInput.value = data.name || ""; // Si no hay nombre, dejarlo vacío
        descriptionInput.value = data.description || ""; // Lo mismo para la descripción
        priceInput.value = data.price || ""; // Lo mismo para el precio
      } else {
        // Si hubo algún error en la respuesta, mostrar mensaje de error
        alert("Hubo un error al obtener los datos del producto");
      }
    
  });

  // Agregar evento para manejar el envío del formulario (cuando se haga click en guardar)
  saveButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const productData = {
      name: nameInput.value,
      description: descriptionInput.value,
      price: priceInput.value,
    };

    try {
      // Enviar los datos del producto al endpoint /api/send-product/
      const response = await fetch("/api/send-product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData), // Enviar los datos del formulario
      });

      // Verificar si la respuesta es correcta (status 200)
      if (response.ok) {
        const data = await response.json(); // Obtener la respuesta en JSON
        console.log("Respuesta del servidor:", data); // Mostrar la respuesta en consola
        alert("Producto enviado correctamente");
      } else {
        // Si hubo algún error en la respuesta
        const errorData = await response.json();
        console.error("Error al guardar producto:", errorData);
        alert("Hubo un error al guardar el producto");
      }
    } catch (error) {
      // Manejar errores de la solicitud
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al intentar guardar el producto");
    }
  });
});
