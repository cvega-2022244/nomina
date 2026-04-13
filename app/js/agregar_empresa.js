$(document).ready(function () {
    cargando();
    listado_bancos();
})

function listado_bancos() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_banco'
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Bancos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Bancos Registrados',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('banco').innerHTML = template;
                        selectBox = new vanillaSelectBox("#banco", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 350,
                            "search": true,
                            "placeHolder": "Banco..."
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function agregar_empresa() {
    cargando();
    
    if (!validar_inputs()) {
        Swal.fire({
            title: 'Campos Vacíos',
            text: 'Asegúrese de haber llenado todos los campos',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true
        });
        return;
    }
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'agregar_empresa',
            apartado_postal,
            apto,
            calle,
            colonia,
            departamento,
            direccion,
            direccion_patrono,
            email,
            fax,
            municipio,
            nit,
            nit_patrono,
            nombre_comercial,
            nombre_patrono,
            nomenclatura,
            numero,
            numero_patrono,
            razon_social,
            telefono,
            id_banco
        },
        success: function (res) {
            console.log('Respuesta del servidor:', res);
            console.log('Tipo de respuesta:', typeof res);
            
            // Convertir a string si no lo es
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                Swal.fire({
                    title: 'Empresa Ingresada',
                    icon: 'success',
                    showCancelButton: false,
                    showCloseButton: false,
                    showConfirmButton: false,
                    timer: 1500,
                    allowOutsideClick: false
                }).then(() => {
                    window.location.href = "./empresas.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Ingresar La Empresa',
                    text: 'Ha ocurrido un error. Por favor, contacte con sistemas.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                console.error('Error en la respuesta:', respuesta);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error AJAX:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
            
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                allowOutsideClick: false,
                showConfirmButton: true
            });
        }
    });
}

function validar_inputs() {
    apartado_postal = document.getElementById('apartado_postal').value;
    apto = document.getElementById('apto').value;
    calle = document.getElementById('calle').value;
    colonia = document.getElementById('colonia').value;
    departamento = document.getElementById('departamento').value;
    direccion = document.getElementById('direccion').value;
    direccion_patrono = document.getElementById('direccion_patrono').value;
    email = document.getElementById('email').value;
    fax = document.getElementById('fax').value;
    municipio = document.getElementById('municipio').value;
    nit = document.getElementById('nit').value;
    nit_patrono = document.getElementById('nit_patrono').value;
    nombre_comercial = document.getElementById('nombre_comercial').value;
    nombre_patrono = document.getElementById('nombre_patrono').value;
    nomenclatura = document.getElementById('nomenclatura').value;
    numero = document.getElementById('numero').value;
    numero_patrono = document.getElementById('numero_patrono').value;
    razon_social = document.getElementById('razon_social').value;
    telefono = document.getElementById('telefono').value;
    id_banco = document.getElementById('banco').value;
    txt_select = document.getElementsByClassName('title');
    banco = txt_select[0].innerHTML;

    if ((apartado_postal && apto && calle && colonia && departamento && direccion && direccion_patrono && email && fax && municipio && nit && nit_patrono && nombre_comercial && nombre_patrono && nomenclatura && numero && numero_patrono && razon_social && telefono) == "" && banco == "Banco...") {
        return false;
    } else {
        return true;
    }
}

function cargando() {
    Swal.fire({
        title: 'Procesando...',
        html: 'Esto puede demorar unos momentos',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}
