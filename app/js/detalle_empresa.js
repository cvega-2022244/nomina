//--------------------------- Inputs ----------------------------//

apartado_postal = document.getElementById('apartado_postal');
apto = document.getElementById('apto');
calle = document.getElementById('calle');
colonia = document.getElementById('colonia');
departamento = document.getElementById('departamento');
direccion = document.getElementById('direccion');
direccion_patrono = document.getElementById('direccion_patrono');
email = document.getElementById('email');
fax = document.getElementById('fax');
municipio = document.getElementById('municipio');
nit = document.getElementById('nit');
nit_patrono = document.getElementById('nit_patrono');
nombre_comercial = document.getElementById('nombre_comercial');
nombre_patrono = document.getElementById('nombre_patrono');
nomenclatura = document.getElementById('nomenclatura');
numero = document.getElementById('numero');
numero_patrono = document.getElementById('numero_patrono');
razon_social = document.getElementById('razon_social');
telefono = document.getElementById('telefono');
boton = document.getElementById('boton_guardar');
banco = document.getElementById('banco');
txt_select = document.getElementsByClassName('title');

//--------------------------------------------------------------//

$(document).ready(function () {
    cargando();
    listado_bancos();
    activar_inputs();
    detalle_empresa();
});

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

function activar_inputs() {
    editar = sessionStorage.getItem('editar');
    if (editar != 'true') {
        apartado_postal.disabled = true;
        apto.disabled = true;
        calle.disabled = true;
        colonia.disabled = true;
        departamento.disabled = true;
        direccion.disabled = true;
        direccion_patrono.disabled = true;
        email.disabled = true;
        fax.disabled = true;
        municipio.disabled = true;
        nit.disabled = true;
        nit_patrono.disabled = true;
        nombre_comercial.disabled = true;
        nombre_patrono.disabled = true;
        nomenclatura.disabled = true;
        numero.disabled = true;
        numero_patrono.disabled = true;
        razon_social.disabled = true;
        telefono.disabled = true;
        boton.disabled = true;
    } else {
        apartado_postal.disabled = false;
        apto.disabled = false;
        calle.disabled = false;
        colonia.disabled = false;
        departamento.disabled = false;
        direccion.disabled = false;
        direccion_patrono.disabled = false;
        email.disabled = false;
        fax.disabled = false;
        municipio.disabled = false;
        nit.disabled = false;
        nit_patrono.disabled = false;
        nombre_comercial.disabled = false;
        nombre_patrono.disabled = false;
        nomenclatura.disabled = false;
        numero.disabled = false;
        numero_patrono.disabled = false;
        razon_social.disabled = false;
        telefono.disabled = false;
        boton.disabled = false;
    }
}

function detalle_empresa() {
    return new Promise((resolve) => {
        cargando();
        id_empresa = sessionStorage.getItem('id_empresa');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_empresa',
                id_empresa,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Empresa',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos De La Empresa',
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
                        lista.forEach(lista => {
                            apartado_postal.value = lista.apartado_postal;
                            apto.value = lista.apto;
                            calle.value = lista.calle;
                            colonia.value = lista.colonia;
                            departamento.value = lista.departamento;
                            direccion.value = lista.direccion;
                            direccion_patrono.value = lista.direccion_patrono;
                            email.value = lista.email;
                            fax.value = lista.fax;
                            municipio.value = lista.municipio;
                            nit.value = lista.nit;
                            nit_patrono.value = lista.nit_patrono;
                            nombre_comercial.value = lista.nombre_comercial;
                            nombre_patrono.value = lista.nombre_patrono;
                            nomenclatura.value = lista.nomenclatura;
                            numero.value = lista.numero;
                            numero_patrono.value = lista.numero_patrono;
                            razon_social.value = lista.razon_social;
                            telefono.value = lista.telefono;
                            banco.value = lista.id_banco;
                            txt_select[0].innerHTML = lista.nombre_banco;
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

function editar_empresa() {
    cargando();
    
    if (apartado_postal.value == "" || apto.value == "" || calle.value == "" || colonia.value == "" || departamento.value == "" || direccion.value == "" || direccion_patrono.value == "" || email.value == "" || fax.value == "" || municipio.value == "" || nit.value == "" || nit_patrono.value == "" || nombre_comercial.value == "" || nombre_patrono.value == "" || nomenclatura.value == "" || numero.value == "" || numero_patrono.value == "" || razon_social.value == "" || telefono.value == "" || txt_select[0].innerHTML == "Banco...") {
        Swal.fire({
            title: 'Campos Vacíos',
            text: 'Asegúrese de haber llenado todos los campos',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true
        });
        return;
    }
    
    id_empresa = sessionStorage.getItem('id_empresa');
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'editar_empresa',
            id_empresa,
            apartado_postal: apartado_postal.value,
            apto: apto.value,
            calle: calle.value,
            colonia: colonia.value,
            departamento: departamento.value,
            direccion: direccion.value,
            direccion_patrono: direccion_patrono.value,
            email: email.value,
            fax: fax.value,
            municipio: municipio.value,
            nit: nit.value,
            nit_patrono: nit_patrono.value,
            nombre_comercial: nombre_comercial.value,
            nombre_patrono: nombre_patrono.value,
            nomenclatura: nomenclatura.value,
            numero: numero.value,
            numero_patrono: numero_patrono.value,
            razon_social: razon_social.value,
            telefono: telefono.value,
            id_banco: banco.value
        },
        success: function (res) {
            console.log('Respuesta del servidor:', res);
            console.log('Tipo de respuesta:', typeof res);
            
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                Swal.fire({
                    title: 'Empresa Editada',
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
                    title: 'Error Al Editar Empresa',
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

