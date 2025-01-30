$(document).ready(function () {
    // Habilitar el botón Scrapear solo si hay una URL ingresada
    $('#url').on('input', function () {
        $('#scrapeBtn').prop('disabled', !$(this).val().trim());
    });

    // Evento para scrapear datos desde la URL
    $('#scrapeBtn').click(function () {
        const url = $('#url').val().trim();
        if (!url) {
            alert("Por favor, ingresa una URL válida.");
            return;
        }

        $.ajax({
            url: '/api/scrapear/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ url: url }),
            success: function (response) {
                if (response.error) {
                    alert("Error al scrapear: " + response.error);
                } else {
                    // Llenar automáticamente los campos con los datos obtenidos
                    $('#name').val(response.name);
                    $('#description').val(response.description);
                    $('#price').val(response.price);
                }
            },
            error: function () {
                alert("Hubo un error al procesar la solicitud.");
            }
        });
    });

    // Evento para enviar los datos manualmente
    $('#scrapeForm').submit(function (event) {
        event.preventDefault();

        const name = $('#name').val().trim();
        const description = $('#description').val().trim();
        const price = $('#price').val().trim();

        if (!name || !description || !price) {
            alert("Todos los campos deben estar completos.");
            return;
        }

        $.ajax({
            url: '/api/manual/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, description, price }),
            success: function (response) {
                $('#result').html(`
                    <div class="card mt-3">
                        <div class="card-body">
                            <h4 class="card-title">${response.name}</h4>
                            <p class="card-text"><strong>Descripción:</strong> ${response.description}</p>
                            <p class="card-text"><strong>Precio:</strong> ${response.price}</p>
                        </div>
                    </div>
                `);
            },
            error: function () {
                alert("Error al enviar los datos.");
            }
        });
    });
});
