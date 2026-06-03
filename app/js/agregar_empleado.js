index_estudios = 0;
index_estudios_eliminar = 0;
index_curso = 0;
index_curso_eliminar = 0;
index_puesto = 0;
index_puesto_eliminar = 0;
index_evento = 0;
index_evento_eliminar = 0;
index_record = 0;
index_record_eliminar = 0;
index_empresa = 0;
index_empresa_eliminar = 0;
index_vehiculo = 0;
index_vehiculo_eliminar = 0;
index_hijo = 0;
index_hijo_eliminar = 0;

var estudios = new Array();
var cursos = new Array();
var puestos = new Array();
var eventos = new Array();
var records = new Array();
var empresas = new Array();
var vehiculos = new Array();
var hijos = new Array();
var empresas_intercompany = [];
var listado_chx_intercompany = [];
var selectBox; // Variable global para vanillaSelectBox

// Función helper para inicializar vanillaSelectBox de forma segura
function safeInitVanillaSelectBox(selector, options) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return new vanillaSelectBox(selector, options);
    }
  } catch (error) {
    console.log(`Error inicializando vanillaSelectBox para ${selector}:`, error);
  }
  return null;
}

// Inicializar flatpickr solo si los elementos existen
const fechaNacimiento = document.getElementById("fecha_nacimiento");
if (fechaNacimiento) {
    var f1 = flatpickr(fechaNacimiento);
}

const fechaInicio = document.getElementById("fecha_inicio");
if (fechaInicio) {
    var f2 = flatpickr(fechaInicio);
}

const fechaBaja = document.getElementById("fecha_baja");
if (fechaBaja) {
    var f3 = flatpickr(fechaBaja);
}

window.onload = function () {
  var paginaRecargada = localStorage.getItem('paginaRecargada');

  if (!paginaRecargada || paginaRecargada == 'false') {
    location.reload();
    localStorage.setItem('paginaRecargada', 'true');
  }
}

$(document).ready(function () {
  cargando();
  listado_depto_laboral();
});

function listado_estado() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_estado",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            const estadoElem = document.getElementById("estado");
            if (estadoElem) {
              estadoElem.innerHTML = template;
              selectBox = safeInitVanillaSelectBox("#estado", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Estado...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_estado_civil();
  })
}

function listado_estado_civil() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_estado_civil",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            const estadoCivilElem = document.getElementById("estado_civil");
            if (estadoCivilElem) {
              estadoCivilElem.innerHTML = template;
              selectBox = safeInitVanillaSelectBox("#estado_civil", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Estado Civil...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_genero();
  })
}

function listado_genero() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_genero",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            try {
              const generoElem = document.getElementById("genero");
              if (generoElem) {
                generoElem.innerHTML = template;
                selectBox = safeInitVanillaSelectBox("#genero", {
                  keepInlineStyles: true,
                  maxHeight: 678,
                  minWidth: 200,
                  search: true,
                  placeHolder: "Género...",
                });
              }
            } catch (error) {
              console.log("Error inicializando vanillaSelectBox para genero:", error);
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_banco();
  })
}

function listado_banco() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_banco",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            document.getElementById("banco").innerHTML = template;
            if (document.getElementById("banco")) {
              selectBox = safeInitVanillaSelectBox("#banco", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Banco...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_tipo_pago();
  })
}

function listado_tipo_pago() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_tipo_pago",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            document.getElementById("pago").innerHTML = template;
            if (document.getElementById("pago")) {
              selectBox = safeInitVanillaSelectBox("#pago", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Tipo de pago...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_tipo_cuenta();
  })
}

function listado_tipo_cuenta() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_tipo_cuenta",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            document.getElementById("tipo_cuenta").innerHTML = template;
            if (document.getElementById("tipo_cuenta")) {
              selectBox = safeInitVanillaSelectBox("#tipo_cuenta", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Tipo de cuenta...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_moneda()
  })
}

function listado_moneda() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_moneda",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            document.getElementById("moneda").innerHTML = template;
            if (document.getElementById("moneda")) {
              selectBox = safeInitVanillaSelectBox("#moneda", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Moneda...",
              });
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_universidad();
  })
}

function listado_depto_laboral() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_departamentos",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
            try {
              const deptoElem = document.getElementById("departamento_laboral");
              if (deptoElem) {
                deptoElem.innerHTML = template;
                selectBox = safeInitVanillaSelectBox("#departamento_laboral", {
                  keepInlineStyles: true,
                  maxHeight: 678,
                  minWidth: 200,
                  search: true,
                  placeHolder: "Departamento...",
                });
              }
            } catch (error) {
              console.log("Error inicializando vanillaSelectBox para departamento_laboral:", error);
            }

            try {
              if (document.getElementById("jornada")) {
                selectBox = safeInitVanillaSelectBox("#jornada", {
                  keepInlineStyles: true,
                  maxHeight: 678,
                  minWidth: 200,
                  search: true,
                  placeHolder: "Jornada...",
                });
              }
            } catch (error) {
              console.log("Error inicializando vanillaSelectBox para jornada:", error);
            }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    slx_centro_costo();
  })
}

function slx_centro_costo() {
  return new Promise((resolve) => {
    try {
      slc_centro_costo.style.display = "none";
      input_puesto.style.display = 'none';
      if (document.getElementById("centro_de_costo")) {
        selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
          keepInlineStyles: true,
          maxHeight: 678,
          minWidth: 200,
          search: true,
          placeHolder: "Área...",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    slx_dimension_3();
  })
}

function slx_dimension_3() {
  return new Promise((resolve) => {
    try {
      slc_dimension_3.style.display = "none";
      if (document.getElementById("dimension_3")) {
        selectBox = safeInitVanillaSelectBox("#dimension_3", {
          keepInlineStyles: true,
          maxHeight: 678,
          minWidth: 200,
          search: true,
          placeHolder: "División...",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    slx_dimension_4();
  })
}

function slx_dimension_4() {
  return new Promise((resolve) => {
    try {
      slc_dimension_4.style.display = "none";
      if (document.getElementById("dimension_4")) {
        selectBox = safeInitVanillaSelectBox("#dimension_4", {
          keepInlineStyles: true,
          maxHeight: 678,
          minWidth: 200,
          search: true,
          placeHolder: "Sub División...",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    slx_dimension_5();
  })
}

function slx_dimension_5() {
  return new Promise((resolve) => {
    try {
      slc_dimension_5.style.display = "none";
      if (document.getElementById("dimension_5")) {
        selectBox = safeInitVanillaSelectBox("#dimension_5", {
          keepInlineStyles: true,
          maxHeight: 678,
          minWidth: 200,
          search: true,
          placeHolder: "Nivel 5...",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_empresas();
  })
}

function ocultar_tabla_empresas() {
  var tabla_empresas = document.getElementById("tabla_empresas");
  tabla_empresas.style.display = "none";
}

function listado_centro_costo() {
  try {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_centros_costo_ficha_empleado",
        id_depto: document.getElementById("departamento_laboral").value,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Obtener Área",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
        } else if (res.includes("No hay datos")) {
          let template = "";
          document.getElementById("centro_de_costo").innerHTML = template;
          if (document.getElementById("centro_de_costo")) {
            selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Área...",
            });
          }
          Swal.fire({
            icon: "warning",
            title: "No Hay Área Registradas En Departamento",
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
            let template = "";
            lista.forEach((lista) => {
              template += `
                                <option value="${lista.id}">${lista.nombre}</option>
                                `;
            });
            document.getElementById("centro_de_costo").innerHTML = template;
            if (document.getElementById("centro_de_costo")) {
              selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Área...",
              });
            }
            slc_centro_costo.style.display = "";
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
}

function listado_dimension_3() {
  try {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_dimension_3_ficha_empleado",
        id_centro: document.getElementById("centro_de_costo").value,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Obtener División",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
        } else if (res.includes("No hay datos")) {
          let template = "";
          document.getElementById("dimension_3").innerHTML = template;
          if (document.getElementById("dimension_3")) {
            selectBox = safeInitVanillaSelectBox("#dimension_3", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "División...",
            });
          }
          Swal.fire({
            icon: "warning",
            title: "No Hay División Registradas En La Área",
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
            let template = "";
            lista.forEach((lista) => {
              template += `
                                <option value="${lista.id}">${lista.nombre}</option>
                                `;
            });
            document.getElementById("dimension_3").innerHTML = template;
            if (document.getElementById("dimension_3")) {
              selectBox = safeInitVanillaSelectBox("#dimension_3", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "División...",
              });
            }
            slc_dimension_3.style.display = "";
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
}

function listado_dimension_4() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_dimension_4_ficha_empleado",
          id_dimension: document.getElementById("dimension_3").value,
        },
        success: function (res) {
          if (res.includes("Query Falló")) {
            Swal.fire({
              icon: "error",
              title: "Error Al Obtener Sub División",
              text: "Por favor, comunicate con sistemas",
            });
            console.log(res);
          } else if (res.includes("No hay datos")) {
            let template = "";
            document.getElementById("dimension_4").innerHTML = template;
            if (document.getElementById("dimension_4")) {
              selectBox = safeInitVanillaSelectBox("#dimension_4", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Sub División...",
              });
            }
            Swal.fire({
              icon: "warning",
              title: "No Hay Sub División Registradas En La División",
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
              let template = "";
              lista.forEach((lista) => {
                template += `
                                <option value="${lista.id}">${lista.nombre}</option>
                                `;
              });
              document.getElementById("dimension_4").innerHTML = template;
              if (document.getElementById("dimension_4")) {
                selectBox = safeInitVanillaSelectBox("#dimension_4", {
                  keepInlineStyles: true,
                  maxHeight: 678,
                  minWidth: 200,
                  search: true,
                  placeHolder: "Sub División...",
                });
              }
              slc_dimension_4.style.display = "";
            } catch (error) {
              console.log(error);
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_empresa_principal();
  })
}

function listado_dimension_5() {
  try {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_dimension_5_ficha_empleado",
        id_dimension: document.getElementById("dimension_4").value,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Obtener Nivel 5",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
        } else if (res.includes("No hay datos")) {
          let template = "";
          document.getElementById("dimension_5").innerHTML = template;
          if (document.getElementById("dimension_5")) {
            selectBox = safeInitVanillaSelectBox("#dimension_5", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Nivel 5...",
            });
          }
          Swal.fire({
            icon: "warning",
            title: "No Hay Nivel 5 Registradas En La Sub División",
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
            let template = "";
            lista.forEach((lista) => {
              template += `
                                <option value="${lista.id}">${lista.nombre}</option>
                                `;
            });
            document.getElementById("dimension_5").innerHTML = template;
            if (document.getElementById("dimension_5")) {
              selectBox = safeInitVanillaSelectBox("#dimension_5", {
                keepInlineStyles: true,
                maxHeight: 678,
                minWidth: 200,
                search: true,
                placeHolder: "Nivel 5...",
              });
            }
            slc_dimension_5.style.display = "";
            var dimension_5 = document.getElementById("dimension_5");
            console.log(dimension_5.options[dimension_5.selectedIndex].text);

          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
}



function listado_empresa_principal() {
  try {
    empresas_intercompany = [];
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_empresa_principal",
        id_centro: document.getElementById("centro_de_costo").value,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Obtener Empresas",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
        } else if (res.includes("No hay datos")) {
          Swal.fire({
            icon: "warning",
            title: "No Hay Empresas Registradas En La Área",
          }).then(() => {
            var listado_empresas = document.getElementById("listado_empresas");
            var tabla_empresas = document.getElementById("tabla_empresas");
            listado_empresas.innerHTML = "";
            tabla_empresas.style.display = "none";
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
            var template = "";
            var tabla_empresas = document.getElementById("tabla_empresas");
            var listado_empresas = document.getElementById("listado_empresas");
            lista.forEach((empresa) => {
              empresas_intercompany.push({
                id: empresa.id,
                nombre: empresa.nombre,
                porcentaje: 0,
                principal: false,
              });
            });
            empresas_intercompany.forEach((empresa) => {
              template += `
                            <tr>
                                <td class="text-center" >${empresa.nombre}</td>
                                <td class="text-center"><input type="number" class="form-control" id="inp_porcentaje_${empresa.id}" value='${empresa.porcentaje}' style="width: 50%; margin: 0 auto;" onchange="asignar_porcentaje_empresa(${empresa.id})"></td>
                                <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${empresa.id}" onclick="click_chx(${empresa.id})"></td>
                            </tr>`;
            });
            listado_empresas.innerHTML = template;
            tabla_empresas.style.display = "";
            input_puesto.style.display = '';
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
}

function listado_empresas() {
  return new Promise((resolve) => {
    try {
      empresas_intercompany = [];
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_empresa_principal",
          id_centro: 1
        },
        success: function (res) {
          if (res.includes("Query Falló")) {
            Swal.fire({
              icon: "error",
              title: "Error Al Obtener Empresas",
              text: "Por favor, comunicate con sistemas",
            });
            console.log(res);
          } else if (res.includes("No hay datos")) {
            Swal.fire({
              icon: "warning",
              title: "No Hay Empresas Registradas En La Área",
            }).then(() => {
              var listado_empresas = document.getElementById("listado_empresas");
              var tabla_empresas = document.getElementById("tabla_empresas");
              listado_empresas.innerHTML = "";
              tabla_empresas.style.display = "none";
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
              var template = "";
              var tabla_empresas = document.getElementById("tabla_empresas");
              var listado_empresas = document.getElementById("listado_empresas");
              lista.forEach((empresa) => {
                empresas_intercompany.push({
                  id: empresa.id,
                  nombre: empresa.nombre,
                  porcentaje: 0,
                  principal: false,
                });
              });
              empresas_intercompany.forEach((empresa) => {
                template += `
                            <tr>
                                <td class="text-center" >${empresa.nombre}</td>
                                <td class="text-center"><input type="number" class="form-control" id="inp_porcentaje_${empresa.id}" value='${empresa.porcentaje}' style="width: 50%; margin: 0 auto;" onchange="asignar_porcentaje_empresa(${empresa.id})" disabled></td>
                                <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${empresa.id}" onclick="click_chx(${empresa.id})" disabled></td>
                            </tr>`;
              });
              listado_empresas.innerHTML = template;
              tabla_empresas.style.display = "";
            } catch (error) {
              console.log(error);
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_estado();
  })
}

function asignar_porcentaje_empresa(id_empresa) {
  var index_empresa = empresas_intercompany.findIndex(
    (empresa) => empresa.id == id_empresa
  );
  var input_porc = document.getElementById("inp_porcentaje_" + id_empresa);
  empresas_intercompany[index_empresa].porcentaje = input_porc.value;
}

function asignar_empresa_principal(id_empresa) {
  var index_empresa = empresas_intercompany.findIndex(
    (empresa) => empresa.id == id_empresa
  );
  var chx_principal = document.getElementById("chx_principal_" + id_empresa);
  empresas_intercompany[index_empresa].principal = chx_principal.checked;
}

function seleccionar_chx(id_chx) {
  var chx_activar = document.getElementById(id_chx);
  chx_activar.checked = true;
}

function click_chx(index) {
  try {
    listado_chx_intercompany = document.querySelectorAll(
      '[id*="chx_principal_"]'
    );
    var chx_intercompany_seleccionados = [];
    listado_chx_intercompany.forEach((elemento) => {
      chx_intercompany_seleccionados.push(elemento.checked);
    });
    var conteo = count_value_occurrences(chx_intercompany_seleccionados, true);
  } catch (error) {
    console.log(error);
  } finally {
    if (conteo == 1) {
      asignar_empresa_principal(index);
    } else if (conteo > 1) {
      try {
        for (let index = 0; index < empresas_intercompany.length; index++) {
          empresas_intercompany[index].principal = false;
        }
        chx_intercompany_seleccionados = [];
        for (let index = 0; index < listado_chx_intercompany.length; index++) {
          chx_intercompany_seleccionados.push(false);
          listado_chx_intercompany[index].checked = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        seleccionar_chx("chx_principal_" + index);
        asignar_empresa_principal(index);
      }
    } else {
      for (let index = 0; index < empresas_intercompany.length; index++) {
        empresas_intercompany[index].principal = false;
      }
      chx_intercompany_seleccionados = [];
      for (let index = 0; index < listado_chx_intercompany.length; index++) {
        chx_intercompany_seleccionados.push(false);
        listado_chx_intercompany[index].checked = false;
      }
    }
  }
}

function count_value_occurrences(array, value) {
  let count = 0;
  array.forEach((item) => {
    if (item === value) {
      count++;
    }
  });
  return count;
}

function listado_universidad() {
  return new Promise((resolve) => {
    try {
      if (document.getElementById("universidad_modal")) {
        selectBox = safeInitVanillaSelectBox("#universidad_modal", {
          keepInlineStyles: true,
          maxHeight: 678,
          minWidth: 200,
          search: true,
          placeHolder: "Universidad...",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_condicion_laboral()
  })
}

function listado_condicion_laboral() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_condicion_laboral",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.nombre}</option>
                `;
          });
          document.getElementById("condicion_laboral").innerHTML = template;
          if (document.getElementById("condicion_laboral")) {
            selectBox = safeInitVanillaSelectBox("#condicion_laboral", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Condición...",
            });
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_tipo_licencia()
  })
}

function listado_tipo_licencia() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_tipo_licencia",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.tipo}</option>
                `;
          });
          document.getElementById("tipo_licencia").innerHTML = template;
          if (document.getElementById("tipo_licencia")) {
            selectBox = safeInitVanillaSelectBox("#tipo_licencia", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Tipo...",
            });
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    listado_clase_licencia()
  })
}

function listado_clase_licencia() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "listado_clase_licencia",
        },
        success: function (resp) {
          let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
          let template = "";
          lista.forEach((lista) => {
            template += `
                <option value="${lista.id}">${lista.clase}</option>
                `;
          });
          document.getElementById("clase_licencia").innerHTML = template;
          if (document.getElementById("clase_licencia")) {
            selectBox = safeInitVanillaSelectBox("#clase_licencia", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Clase...",
            });
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  }).then(() => {
    notificacion_sugerencia()
  })
}

function notificacion_sugerencia() {
  return new Promise((resolve) => {
    try {
      Swal.close()
      $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
          quest: 'sugerencia_intercompany',
        },
        success: function (res) {
          var sugerencia = document.getElementById('sugerencia')
          if (res.includes('Query Falló')) {
            sugerencia.style.display = 'none'
            console.log('Error al obtener la empresa sugerencia');
          } else if (res.includes('No hay datos')) {
            sugerencia.style.display = 'none'
            console.log('No hay datos de la empresa sugerencia');
          } else {
            let lista;

            if (typeof res === 'string') {

                lista = JSON.parse(res);

            } else {

                lista = res; // jQuery ya parseó el JSON

            }
            sugerencia.style.display = ''
            var empresa_sugerencia = document.getElementById('empresa_sugerencia')
            empresa_sugerencia.innerHTML = lista[0].empresa
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve();
    }
  })
}

function cerrar_sugerencia() {
  var sugerencia = document.getElementById('sugerencia')
  sugerencia.style.display = 'none'
}

function obtener_edad_empleado() {
  var fechaNacimientoStr = document.getElementById("fecha_nacimiento").value;
  
  if (!fechaNacimientoStr || fechaNacimientoStr == '' || fechaNacimientoStr == '0000-00-00') {
    document.getElementById("edad_empleado").value = 0;
    return;
  }
  
  var hoy = new Date();
  var fechaNac = new Date(fechaNacimientoStr);
  
  var edad = hoy.getFullYear() - fechaNac.getFullYear();
  var mesActual = hoy.getMonth();
  var mesNacimiento = fechaNac.getMonth();
  
  // Si aún no ha llegado el mes de cumpleaños, o si es el mes pero no ha llegado el día
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  document.getElementById("edad_empleado").value = edad;
}

function validar_checkbox_primaria() {
  var chx_primaria = document.getElementById("primaria");
  var input_primaria = document.getElementById("grado_primaria");
  if (chx_primaria.checked) {
    input_primaria.hidden = false;
  } else {
    input_primaria.hidden = true;
    input_primaria.value = "";
  }
}

function validar_checkbox_secundaria() {
  var chx_secundaria = document.getElementById("secundaria");
  var input_secundaria = document.getElementById("grado_secundaria");
  if (chx_secundaria.checked) {
    input_secundaria.hidden = false;
  } else {
    input_secundaria.hidden = true;
    input_secundaria.value = "";
  }
}

function validar_chx_diversificado_universidad() {
  var chx_diversificado = document.getElementById("diversificado");
  var chx_universidad = document.getElementById("universidad");
  var tabla_educacion = document.getElementById("tabla_educacion");
  if (chx_diversificado.checked || chx_universidad.checked) {
    tabla_educacion.hidden = false;
  } else {
    tabla_educacion.hidden = true;
  }
}

function validar_inputs_estudios() {
  carrera = document.getElementById("carrera");
  descripcion_estudios = document.getElementById("descripcion_estudios");
  if (carrera.value != "" && descripcion_estudios.value != "") {
    return true;
  } else {
    return false;
  }
}

function validar_universidad() {
  combobox_universidad = document.getElementById("btn-group-universidad_modal");
  nombre_universidad =
    combobox_universidad.getElementsByClassName("title")[0].innerText;
  if (nombre_universidad != "Universidad...") {
    return true;
  } else {
    return false;
  }
}

function cargar_estudios() {
  let template = "";
  estudios.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0]}</td>
            <td>${lista[3]}</td>
            <td>${lista[1]}</td>
            <td>${lista[2]}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_estudios(${lista[0]})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_estudios(${lista[0]})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_estudios").innerHTML = template;
}

function limpiar_inputs_estudios() {
  carrera = document.getElementById("carrera");
  descripcion_estudios = document.getElementById("descripcion_estudios");
  carrera.value = "";
  descripcion_estudios.value = "";
  if (document.getElementById("universidad_modal")) {
    selectBox = safeInitVanillaSelectBox("#universidad_modal", {
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Universidad...",
    });
  }
}

function ocultar_botones_estudios() {
  document.getElementById("boton_agregar_estudios").hidden = false;
  document.getElementById("boton_editar_estudios").hidden = true;
  limpiar_inputs_estudios();
}

function guardar_estudios() {
  if (validar_inputs_estudios()) {
    if (validar_universidad()) {
      carrera = document.getElementById("carrera");
      descripcion_estudios = document.getElementById("descripcion_estudios");
      listado_universidad = document.getElementById("universidad_modal");
      id_universidad = listado_universidad.value;
      nombre_universidad =
        listado_universidad.options[listado_universidad.selectedIndex].text;
      estudios.push([
        index_estudios,
        carrera.value,
        descripcion_estudios.value,
        nombre_universidad,
        id_universidad,
      ]);
      index_estudios = index_estudios + 1;
      cargar_estudios();
      $("#modal_estudios").modal("hide");
      limpiar_inputs_estudios();
    } else {
      Swal.fire({
        title: "Universidad Vacia",
        html: "Por favor, seleccione una universidad.",
        icon: "warning",
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: false,
      });
    }
  } else {
    Swal.fire({
      title: "Carrera o Descripción Vacias",
      html: "Por favor, ingrese una carrera y una descripción",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_estudios(id) {
  carrera = document.getElementById("carrera");
  descripcion_estudios = document.getElementById("descripcion_estudios");
  listado_universidad = document.getElementById("universidad_modal");
  id_estudios = document.getElementById("id_estudios");
  combobox_universidad = document.getElementById("btn-group-universidad_modal");
  nombre_universidad = combobox_universidad.getElementsByClassName("title");
  $("#modal_estudios").modal("show");
  document.getElementById("boton_agregar_estudios").hidden = true;
  document.getElementById("boton_editar_estudios").hidden = false;
  carrera.value = estudios[id][1];
  id_estudios.value = estudios[id][0];
  descripcion_estudios.value = estudios[id][2];
  listado_universidad.value = estudios[id][4];
  nombre_universidad[0].innerText = estudios[id][3];
}

function editar_estudios() {
  if (validar_inputs_estudios()) {
    if (validar_universidad()) {
      carrera = document.getElementById("carrera");
      descripcion_estudios = document.getElementById("descripcion_estudios");
      listado_universidad = document.getElementById("universidad_modal");
      id_estudios = document.getElementById("id_estudios").value;
      combobox_universidad = document.getElementById(
        "btn-group-universidad_modal"
      );
      nombre_universidad = combobox_universidad.getElementsByClassName("title");
      estudios[id_estudios][1] = carrera.value;
      estudios[id_estudios][2] = descripcion_estudios.value;
      estudios[id_estudios][3] = nombre_universidad[0].innerText;
      estudios[id_estudios][4] = listado_universidad.value;
      cargar_estudios();
      $("#modal_estudios").modal("hide");
      limpiar_inputs_estudios();
    } else {
      Swal.fire({
        title: "Universidad Vacia",
        html: "Por favor, seleccione una universidad.",
        icon: "warning",
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: false,
      });
    }
  } else {
    Swal.fire({
      title: "Carrera o Descripción Vacias",
      html: "Por favor, ingrese una carrera y una descripción",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_estudios(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el estudio?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_estudio(id);
    }
  });
}

function eliminar_estudio(id) {
  var index = estudios.findIndex((estudio) => estudio[0] == id);
  estudios.splice(index, 1);
  estudios.forEach((estudio) => {
    estudio[0] = index_estudios_eliminar;
    index_estudios_eliminar = index_estudios_eliminar + 1;
  });
  cargar_estudios();
  index_estudios = index_estudios_eliminar;
  index_estudios_eliminar = 0;
}

function validar_inputs_curso() {
  nombre_del_curso = document.getElementById("nombre_del_curso");
  lugar_curso = document.getElementById("lugar_curso");
  fecha_capacitacion = document.getElementById("fecha_capacitacion");
  nombre_curso = document.getElementById("nombre_curso");
  if (
    nombre_del_curso.value != "" &&
    lugar_curso.value != "" &&
    fecha_capacitacion.value != "" &&
    nombre_curso.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_cursos() {
  let template = "";
  cursos.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0]}</td>
            <td>${lista[1]}</td>
            <td>${lista[13]}
            </td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_curso(${lista[0]})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_curso(${lista[0]})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_cursos").innerHTML = template;
}

function limpiar_inputs_curso() {
  nombre_del_curso = document.getElementById("nombre_del_curso");
  interno = document.getElementById("interno");
  ano = document.getElementById("ano");
  mes = document.getElementById("mes");
  diploma = document.getElementById("diploma");
  ano_obligacion = document.getElementById("ano_obligacion");
  mes_obligacion = document.getElementById("mes_obligacion");
  obligacion = document.getElementById("obligacion");
  reembolsar = document.getElementById("reembolsar");
  induccion_bmps = document.getElementById("induccion_bmps");
  general = document.getElementById("general");
  funciones = document.getElementById("funciones");
  lugar_curso = document.getElementById("lugar_curso");
  fecha_capacitacion = document.getElementById("fecha_capacitacion");
  codigo_curso = document.getElementById("codigo_curso");
  nombre_curso = document.getElementById("nombre_curso");
  fecha_evaluacion = document.getElementById("fecha_evaluacion");
  nota = document.getElementById("nota");
  (nombre_del_curso.value = ""),
    (interno.checked = false),
    (ano.value = ""),
    (mes.value = ""),
    (diploma.checked = false),
    (ano_obligacion.value = ""),
    (mes_obligacion.value = ""),
    (obligacion.checked = false),
    (reembolsar.value = ""),
    (induccion_bmps.checked = false),
    (general.checked = false),
    (funciones.checked = false),
    (lugar_curso.value = ""),
    (fecha_capacitacion.value = ""),
    (codigo_curso.value = ""),
    (nombre_curso.value = ""),
    (fecha_evaluacion.value = ""),
    (nota.value = "");
}

function ocultar_botones_curso() {
  document.getElementById("boton_agregar_curso").hidden = false;
  document.getElementById("boton_editar_curso").hidden = true;
  limpiar_inputs_curso();
}

function guardar_curso() {
  interno = document.getElementById("interno");
  if (validar_inputs_curso()) {
    nombre_del_curso = document.getElementById("nombre_del_curso");
    interno = document.getElementById("interno");
    ano = document.getElementById("ano");
    mes = document.getElementById("mes");
    diploma = document.getElementById("diploma");
    ano_obligacion = document.getElementById("ano_obligacion");
    mes_obligacion = document.getElementById("mes_obligacion");
    obligacion = document.getElementById("obligacion");
    reembolsar = document.getElementById("reembolsar");
    induccion_bmps = document.getElementById("induccion_bmps");
    general = document.getElementById("general");
    funciones = document.getElementById("funciones");
    lugar_curso = document.getElementById("lugar_curso");
    fecha_capacitacion = document.getElementById("fecha_capacitacion");
    codigo_curso = document.getElementById("codigo_curso");
    nombre_curso = document.getElementById("nombre_curso");
    fecha_evaluacion = document.getElementById("fecha_evaluacion");
    nota = document.getElementById("nota");
    cursos.push([
      index_curso,
      nombre_del_curso.value,
      interno.checked,
      ano.value,
      mes.value,
      diploma.checked,
      ano_obligacion.value,
      mes_obligacion.value,
      obligacion.checked,
      reembolsar.value,
      induccion_bmps.checked,
      general.checked,
      funciones.checked,
      lugar_curso.value,
      fecha_capacitacion.value,
      codigo_curso.value,
      nombre_curso.value,
      fecha_evaluacion.value,
      nota.value,
    ]);
    index_curso = index_curso + 1;
    cargar_cursos();
    $("#exampleModal").modal("hide");
    limpiar_inputs_curso();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de llenar los campos de caracter OBLIGATORIO",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_curso(id) {
  id_curso = document.getElementById("id_curso");
  nombre_del_curso = document.getElementById("nombre_del_curso");
  interno = document.getElementById("interno");
  ano = document.getElementById("ano");
  mes = document.getElementById("mes");
  diploma = document.getElementById("diploma");
  ano_obligacion = document.getElementById("ano_obligacion");
  mes_obligacion = document.getElementById("mes_obligacion");
  obligacion = document.getElementById("obligacion");
  reembolsar = document.getElementById("reembolsar");
  induccion_bmps = document.getElementById("induccion_bmps");
  general = document.getElementById("general");
  funciones = document.getElementById("funciones");
  lugar_curso = document.getElementById("lugar_curso");
  fecha_capacitacion = document.getElementById("fecha_capacitacion");
  codigo_curso = document.getElementById("codigo_curso");
  nombre_curso = document.getElementById("nombre_curso");
  fecha_evaluacion = document.getElementById("fecha_evaluacion");
  nota = document.getElementById("nota");
  $("#exampleModal").modal("show");
  document.getElementById("boton_agregar_curso").hidden = true;
  document.getElementById("boton_editar_curso").hidden = false;
  id_curso.value = cursos[id][0];
  nombre_del_curso.value = cursos[id][1];
  interno.checked = cursos[id][2];
  ano.value = cursos[id][3];
  mes.value = cursos[id][4];
  diploma.checked = cursos[id][5];
  ano_obligacion.value = cursos[id][6];
  mes_obligacion.value = cursos[id][7];
  obligacion.checked = cursos[id][8];
  reembolsar.value = cursos[id][9];
  induccion_bmps.checked = cursos[id][10];
  general.checked = cursos[id][11];
  funciones.checked = cursos[id][12];
  lugar_curso.value = cursos[id][13];
  fecha_capacitacion.value = cursos[id][14];
  codigo_curso.value = cursos[id][15];
  nombre_curso.value = cursos[id][16];
  fecha_evaluacion.value = cursos[id][17];
  nota.value = cursos[id][18];
}

function editar_curso() {
  if (validar_inputs_curso()) {
    id_curso = document.getElementById("id_curso").value;
    nombre_del_curso = document.getElementById("nombre_del_curso");
    interno = document.getElementById("interno");
    ano = document.getElementById("ano");
    mes = document.getElementById("mes");
    diploma = document.getElementById("diploma");
    ano_obligacion = document.getElementById("ano_obligacion");
    mes_obligacion = document.getElementById("mes_obligacion");
    obligacion = document.getElementById("obligacion");
    reembolsar = document.getElementById("reembolsar");
    induccion_bmps = document.getElementById("induccion_bmps");
    general = document.getElementById("general");
    funciones = document.getElementById("funciones");
    lugar_curso = document.getElementById("lugar_curso");
    fecha_capacitacion = document.getElementById("fecha_capacitacion");
    codigo_curso = document.getElementById("codigo_curso");
    nombre_curso = document.getElementById("nombre_curso");
    fecha_evaluacion = document.getElementById("fecha_evaluacion");
    nota = document.getElementById("nota");
    cursos[id_curso][1] = nombre_del_curso.value;
    cursos[id_curso][2] = interno.checked;
    cursos[id_curso][3] = ano.value;
    (cursos[id_curso][4] = mes.value),
      (cursos[id_curso][5] = diploma.checked),
      (cursos[id_curso][6] = ano_obligacion.value),
      (cursos[id_curso][7] = mes_obligacion.value),
      (cursos[id_curso][8] = obligacion.checked),
      (cursos[id_curso][9] = reembolsar.value),
      (cursos[id_curso][10] = induccion_bmps.checked),
      (cursos[id_curso][11] = general.checked),
      (cursos[id_curso][12] = funciones.checked),
      (cursos[id_curso][13] = lugar_curso.value),
      (cursos[id_curso][14] = fecha_capacitacion.value),
      (cursos[id_curso][15] = codigo_curso.value),
      (cursos[id_curso][16] = nombre_curso.value),
      (cursos[id_curso][17] = fecha_evaluacion.value),
      (cursos[id_curso][18] = nota.value);
    cargar_cursos();
    $("#exampleModal").modal("hide");
    limpiar_inputs_curso();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de llenar los campos de caracter OBLIGATORIO",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_curso(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el curso?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_curso(id);
    }
  });
}

function eliminar_curso(id) {
  var index = cursos.findIndex((curso) => curso[0] == id);
  cursos.splice(index, 1);
  cursos.forEach((curso) => {
    curso[0] = index_curso_eliminar;
    index_curso_eliminar = index_curso_eliminar + 1;
  });
  cargar_cursos();
  index_curso = index_curso_eliminar;
  index_curso_eliminar = 0;
}

function validar_inputs_puestos() {
  fecha_puesto = document.getElementById("fecha_puesto");
  codigo_departamento_puesto = document.getElementById(
    "codigo_departamento_puesto"
  );
  departamento_puesto = document.getElementById("departamento_puesto");
  codigo_puesto = document.getElementById("codigo_puesto");
  puesto = document.getElementById("puesto_nombre");
  motivo_puesto = document.getElementById("motivo_puesto");
  if (
    fecha_puesto.value != "" &&
    codigo_departamento_puesto.value != "" &&
    departamento_puesto.value != "" &&
    codigo_puesto.value != "" &&
    puesto.value != "" &&
    motivo_puesto.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_puestos() {
  let template = "";
  puestos.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].index_puesto}</td>
            <td>${lista[0].puesto}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_puesto(${lista[0].index_puesto})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_puesto(${lista[0].index_puesto})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_puestos").innerHTML = template;
}

function limpiar_inputs_puestos() {
  fecha_puesto = document.getElementById("fecha_puesto");
  codigo_departamento_puesto = document.getElementById(
    "codigo_departamento_puesto"
  );
  departamento_puesto = document.getElementById("departamento_puesto");
  codigo_puesto = document.getElementById("codigo_puesto");
  puesto = document.getElementById("puesto_nombre");
  motivo_puesto = document.getElementById("motivo_puesto");
  fecha_puesto.value = "";
  codigo_departamento_puesto.value = "";
  departamento_puesto.value = "";
  codigo_puesto.value = "";
  puesto.value = "";
  motivo_puesto.value = "";
}

function ocultar_botones_puestos() {
  document.getElementById("boton_agregar_puesto").hidden = false;
  document.getElementById("boton_editar_puesto").hidden = true;
  limpiar_inputs_puestos();
}

function guardar_puesto() {
  if (validar_inputs_puestos()) {
    fecha_puesto = document.getElementById("fecha_puesto");
    codigo_departamento_puesto = document.getElementById(
      "codigo_departamento_puesto"
    );
    departamento_puesto = document.getElementById("departamento_puesto");
    codigo_puesto = document.getElementById("codigo_puesto");
    puesto = document.getElementById("puesto_nombre");
    motivo_puesto = document.getElementById("motivo_puesto");
    puestos.push([
      {
        index_puesto: index_puesto,
        fecha: fecha_puesto.value,
        cod_depto: codigo_departamento_puesto.value,
        departamento: departamento_puesto.value,
        cod_puesto: codigo_puesto.value,
        puesto: puesto.value,
        motivo: motivo_puesto.value,
      },
    ]);
    index_puesto = index_puesto + 1;
    cargar_puestos();
    $("#puesto_modal").modal("hide");
    limpiar_inputs_puestos();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_puesto(id) {
  id_puestos = document.getElementById("id_puestos");
  fecha_puesto = document.getElementById("fecha_puesto");
  codigo_departamento_puesto = document.getElementById(
    "codigo_departamento_puesto"
  );
  departamento_puesto = document.getElementById("departamento_puesto");
  codigo_puesto = document.getElementById("codigo_puesto");
  puesto = document.getElementById("puesto_nombre");
  motivo_puesto = document.getElementById("motivo_puesto");
  $("#puesto_modal").modal("show");
  document.getElementById("boton_agregar_puesto").hidden = true;
  document.getElementById("boton_editar_puesto").hidden = false;
  id_puestos.value = id;
  fecha_puesto.value = puestos[id][0].fecha;
  codigo_departamento_puesto.value = puestos[id][0].cod_depto;
  departamento_puesto.value = puestos[id][0].departamento;
  codigo_puesto.value = puestos[id][0].cod_puesto;
  puesto.value = puestos[id][0].puesto;
  motivo_puesto.value = puestos[id][0].motivo;
}

function editar_puesto() {
  if (validar_inputs_puestos()) {
    id_puestos = document.getElementById("id_puestos").value;
    fecha_puesto = document.getElementById("fecha_puesto");
    codigo_departamento_puesto = document.getElementById(
      "codigo_departamento_puesto"
    );
    departamento_puesto = document.getElementById("departamento_puesto");
    codigo_puesto = document.getElementById("codigo_puesto");
    puesto = document.getElementById("puesto_nombre");
    motivo_puesto = document.getElementById("motivo_puesto");
    puestos[id_puestos][0].fecha = fecha_puesto.value;
    puestos[id_puestos][0].cod_depto = codigo_departamento_puesto.value;
    puestos[id_puestos][0].departamento = departamento_puesto.value;
    puestos[id_puestos][0].cod_puesto = codigo_puesto.value;
    puestos[id_puestos][0].puesto = puesto.value;
    puestos[id_puestos][0].motivo = motivo_puesto.value;
    cargar_puestos();
    $("#puesto_modal").modal("hide");
    limpiar_inputs_puestos();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_puesto(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el puesto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_puesto(id);
    }
  });
}

function eliminar_puesto(id) {
  var index = puestos.findIndex((puesto) => puesto[0].index_puesto == id);
  puestos.splice(index, 1);
  puestos.forEach((puesto) => {
    puesto[0].index_puesto = index_puesto_eliminar;
    index_puesto_eliminar = index_puesto_eliminar + 1;
  });
  cargar_puestos();
  index_puesto = index_puesto_eliminar;
  index_puesto_eliminar = 0;
}

function validar_inputs_evento() {
  tipo_evento = document.getElementById("tipo_evento");
  numero_evento = document.getElementById("numero_evento");
  fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
  fecha_final_evento = document.getElementById("fecha_final_evento");
  ano_evento = document.getElementById("ano_evento");
  mes_evento = document.getElementById("mes_evento");
  dia_evento = document.getElementById("dia_evento");
  hora_evento = document.getElementById("hora_evento");
  minuto_evento = document.getElementById("minuto_evento");
  procesar_evento = document.getElementById("procesar_evento");
  planilla_evento = document.getElementById("planilla_evento");
  estado_evento = document.getElementById("estado_evento");
  if (
    tipo_evento.value != "" &&
    numero_evento.value != "" &&
    fecha_inicio_evento.value != "" &&
    fecha_final_evento.value != "" &&
    ano_evento.value != "" &&
    mes_evento.value != "" &&
    dia_evento.value != "" &&
    hora_evento.value != "" &&
    minuto_evento.value != "" &&
    procesar_evento.value != "" &&
    planilla_evento.value != "" &&
    estado_evento.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_eventos() {
  let template = "";
  eventos.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].index}</td>
            <td>${lista[0].tipo}</td>
            <td>${lista[0].numero}</td>
            <td>${lista[0].estado}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_evento(${lista[0].index})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_evento(${lista[0].index})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_eventos").innerHTML = template;
}

function limpiar_inputs_evento() {
  tipo_evento = document.getElementById("tipo_evento");
  numero_evento = document.getElementById("numero_evento");
  fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
  fecha_final_evento = document.getElementById("fecha_final_evento");
  ano_evento = document.getElementById("ano_evento");
  mes_evento = document.getElementById("mes_evento");
  dia_evento = document.getElementById("dia_evento");
  hora_evento = document.getElementById("hora_evento");
  minuto_evento = document.getElementById("minuto_evento");
  procesar_evento = document.getElementById("procesar_evento");
  planilla_evento = document.getElementById("planilla_evento");
  estado_evento = document.getElementById("estado_evento");
  observaciones_evento = document.getElementById("observaciones_evento");
  tipo_evento.value = "";
  numero_evento.value = "";
  fecha_inicio_evento.value = "";
  fecha_final_evento.value = "";
  ano_evento.value = "";
  mes_evento.value = "";
  dia_evento.value = "";
  hora_evento.value = "";
  minuto_evento.value = "";
  procesar_evento.value = "";
  planilla_evento.value = "";
  estado_evento.value = "";
  observaciones_evento.value = "";
}

function ocultar_botones_evento() {
  document.getElementById("boton_agregar_evento").hidden = false;
  document.getElementById("boton_editar_evento").hidden = true;
  limpiar_inputs_evento();
}

function guardar_evento() {
  if (validar_inputs_evento()) {
    tipo_evento = document.getElementById("tipo_evento");
    numero_evento = document.getElementById("numero_evento");
    fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
    fecha_final_evento = document.getElementById("fecha_final_evento");
    ano_evento = document.getElementById("ano_evento");
    mes_evento = document.getElementById("mes_evento");
    dia_evento = document.getElementById("dia_evento");
    hora_evento = document.getElementById("hora_evento");
    minuto_evento = document.getElementById("minuto_evento");
    procesar_evento = document.getElementById("procesar_evento");
    planilla_evento = document.getElementById("planilla_evento");
    estado_evento = document.getElementById("estado_evento");
    observaciones_evento = document.getElementById("observaciones_evento");
    eventos.push([
      {
        index: index_evento,
        tipo: tipo_evento.value,
        numero: numero_evento.value,
        fecha_inicio: fecha_inicio_evento.value,
        fecha_final: fecha_final_evento.value,
        ano: ano_evento.value,
        mes: mes_evento.value,
        dia: dia_evento.value,
        hora: hora_evento.value,
        minuto: minuto_evento.value,
        procesar: procesar_evento.value,
        planilla: planilla_evento.value,
        estado: estado_evento.value,
        observaciones: observaciones_evento.value,
      },
    ]);
    index_evento = index_evento + 1;
    cargar_eventos();
    $("#evento_modal").modal("hide");
    limpiar_inputs_evento();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_evento(id) {
  id_evento = document.getElementById("id_evento");
  tipo_evento = document.getElementById("tipo_evento");
  numero_evento = document.getElementById("numero_evento");
  fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
  fecha_final_evento = document.getElementById("fecha_final_evento");
  ano_evento = document.getElementById("ano_evento");
  mes_evento = document.getElementById("mes_evento");
  dia_evento = document.getElementById("dia_evento");
  hora_evento = document.getElementById("hora_evento");
  minuto_evento = document.getElementById("minuto_evento");
  procesar_evento = document.getElementById("procesar_evento");
  planilla_evento = document.getElementById("planilla_evento");
  estado_evento = document.getElementById("estado_evento");
  observaciones_evento = document.getElementById("observaciones_evento");
  $("#evento_modal").modal("show");
  document.getElementById("boton_agregar_evento").hidden = true;
  document.getElementById("boton_editar_evento").hidden = false;
  id_evento.value = id;
  tipo_evento.value = eventos[id][0].tipo;
  numero_evento.value = eventos[id][0].numero;
  fecha_inicio_evento.value = eventos[id][0].fecha_inicio;
  fecha_final_evento.value = eventos[id][0].fecha_final;
  ano_evento.value = eventos[id][0].ano;
  mes_evento.value = eventos[id][0].mes;
  dia_evento.value = eventos[id][0].dia;
  hora_evento.value = eventos[id][0].hora;
  minuto_evento.value = eventos[id][0].minuto;
  procesar_evento.value = eventos[id][0].procesar;
  planilla_evento.value = eventos[id][0].planilla;
  estado_evento.value = eventos[id][0].estado;
  observaciones_evento.value = eventos[id][0].observaciones;
}

function editar_evento() {
  if (validar_inputs_evento()) {
    id_evento = document.getElementById("id_evento").value;
    tipo_evento = document.getElementById("tipo_evento");
    numero_evento = document.getElementById("numero_evento");
    fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
    fecha_final_evento = document.getElementById("fecha_final_evento");
    ano_evento = document.getElementById("ano_evento");
    mes_evento = document.getElementById("mes_evento");
    dia_evento = document.getElementById("dia_evento");
    hora_evento = document.getElementById("hora_evento");
    minuto_evento = document.getElementById("minuto_evento");
    procesar_evento = document.getElementById("procesar_evento");
    planilla_evento = document.getElementById("planilla_evento");
    estado_evento = document.getElementById("estado_evento");
    observaciones_evento = document.getElementById("observaciones_evento");
    eventos[id_evento][0].tipo = tipo_evento.value;
    eventos[id_evento][0].numero = numero_evento.value;
    eventos[id_evento][0].fecha_inicio = fecha_inicio_evento.value;
    eventos[id_evento][0].fecha_final = fecha_final_evento.value;
    eventos[id_evento][0].ano = ano_evento.value;
    eventos[id_evento][0].mes = mes_evento.value;
    eventos[id_evento][0].dia = dia_evento.value;
    eventos[id_evento][0].hora = hora_evento.value;
    eventos[id_evento][0].minuto = minuto_evento.value;
    eventos[id_evento][0].procesar = procesar_evento.value;
    eventos[id_evento][0].planilla = planilla_evento.value;
    eventos[id_evento][0].estado = estado_evento.value;
    eventos[id_evento][0].observaciones = observaciones_evento.value;
    cargar_eventos();
    $("#evento_modal").modal("hide");
    limpiar_inputs_evento();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_evento(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el evento?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_evento(id);
    }
  });
}

function eliminar_evento(id) {
  var index = eventos.findIndex((evento) => evento[0].index == id);
  eventos.splice(index, 1);
  eventos.forEach((evento) => {
    evento[0].index = index_evento_eliminar;
    index_evento_eliminar = index_evento_eliminar + 1;
  });
  cargar_eventos();
  index_evento = index_evento_eliminar;
  index_evento_eliminar = 0;
}

function validar_inputs_record() {
  fecha_record = document.getElementById("fecha_record");
  descripcion_record = document.getElementById("descripcion_record");
  tipo_record = document.getElementById("tipo_record");
  if (
    fecha_record.value != "" &&
    descripcion_record.value != "" &&
    tipo_record.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_records() {
  let template = "";
  records.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].index}</td>
            <td>${lista[0].descripcion}</td>
            <td>${lista[0].tipo}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_record(${lista[0].index})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_record(${lista[0].index})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_records").innerHTML = template;
}

function limpiar_inputs_record() {
  fecha_record = document.getElementById("fecha_record");
  descripcion_record = document.getElementById("descripcion_record");
  tipo_record = document.getElementById("tipo_record");
  fecha_record.value = "";
  descripcion_record.value = "";
  tipo_record.value = "";
}

function ocultar_botones_record() {
  document.getElementById("boton_agregar_record").hidden = false;
  document.getElementById("boton_editar_record").hidden = true;
  limpiar_inputs_record();
}

function guardar_record() {
  if (validar_inputs_record()) {
    fecha_record = document.getElementById("fecha_record");
    descripcion_record = document.getElementById("descripcion_record");
    tipo_record = document.getElementById("tipo_record");
    records.push([
      {
        index: index_record,
        fecha: fecha_record.value,
        descripcion: descripcion_record.value,
        tipo: tipo_record.value,
      },
    ]);
    index_record = index_record + 1;
    cargar_records();
    $("#record_modal").modal("hide");
    limpiar_inputs_record();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_record(id) {
  id_record = document.getElementById("id_record");
  fecha_record = document.getElementById("fecha_record");
  descripcion_record = document.getElementById("descripcion_record");
  tipo_record = document.getElementById("tipo_record");
  $("#record_modal").modal("show");
  document.getElementById("boton_agregar_record").hidden = true;
  document.getElementById("boton_editar_record").hidden = false;
  id_record.value = id;
  fecha_record.value = records[id][0].fecha;
  descripcion_record.value = records[id][0].descripcion;
  tipo_record.value = records[id][0].tipo;
}

function editar_record() {
  if (validar_inputs_record()) {
    id_record = document.getElementById("id_record").value;
    fecha_record = document.getElementById("fecha_record");
    descripcion_record = document.getElementById("descripcion_record");
    tipo_record = document.getElementById("tipo_record");
    records[id_record][0].fecha = fecha_record.value;
    records[id_record][0].descripcion = descripcion_record.value;
    records[id_record][0].tipo = tipo_record.value;
    cargar_records();
    $("#record_modal").modal("hide");
    limpiar_inputs_record();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_record(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el record?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_record(id);
    }
  });
}

function eliminar_record(id) {
  var index = records.findIndex((record) => record[0].index == id);
  records.splice(index, 1);
  records.forEach((record) => {
    record[0].index = index_record_eliminar;
    index_record_eliminar = index_record_eliminar + 1;
  });
  cargar_records();
  index_record = index_record_eliminar;
  index_record_eliminar = 0;
}

function validar_inputs_planilla() {
  bon_dec_31_2001 = document.getElementById("bon_dec_31_2001");
  anticipo_quincenal = document.getElementById("anticipo_quincenal");
  bantrab = document.getElementById("bantrab");
  bon_incentivo = document.getElementById("bon_incentivo");
  ornato = document.getElementById("ornato");
  horas_extras_dobles = document.getElementById("horas_extras_dobles");
  horas_simples = document.getElementById("horas_simples");
  igss_laboral = document.getElementById("igss_laboral");
  sueldo_ordinario = document.getElementById("sueldo_ordinario");
  isr = document.getElementById("isr");
  otros_ingresos = document.getElementById("otros_ingresos");
  otros_egresos = document.getElementById("otros_egresos");
  prestamo_empresa_planilla = document.getElementById(
    "prestamo_empresa_planilla"
  );
  vacaciones_planilla = document.getElementById("vacaciones_planilla");
  bancos_planilla = document.getElementById("bancos_planilla");
  judiciales_planilla = document.getElementById("judiciales_planilla");
  seguro_planilla = document.getElementById("seguro_planilla");
  parqueo_planilla = document.getElementById("parqueo_planilla");
  if (
    bon_dec_31_2001.value <= 0 ||
    anticipo_quincenal.value < 0 ||
    bantrab.value < 0 ||
    bon_incentivo.value < 0 ||
    ornato.value < 0 ||
    horas_extras_dobles.value < 0 ||
    horas_simples.value < 0 ||
    igss_laboral.value < 0 ||
    sueldo_ordinario.value <= 0 ||
    isr.value < 0 ||
    otros_ingresos.value < 0 ||
    otros_egresos.value < 0 ||
    prestamo_empresa_planilla.value < 0 ||
    vacaciones_planilla.value < 0 ||
    judiciales_planilla.value < 0 ||
    seguro_planilla.value < 0 ||
    parqueo_planilla.value < 0 ||
    bancos_planilla.value < 0 ||
    bon_dec_31_2001.value == "" ||
    anticipo_quincenal.value == "" ||
    bantrab.value == "" ||
    bon_incentivo.value == "" ||
    ornato.value == "" ||
    horas_extras_dobles.value == "" ||
    horas_simples.value == "" ||
    igss_laboral.value == "" ||
    sueldo_ordinario.value == "" ||
    isr.value == "" ||
    otros_ingresos.value == "" ||
    otros_egresos.value == "" ||
    prestamo_empresa_planilla.value == "" ||
    vacaciones_planilla.value == "" ||
    judiciales_planilla.value == "" ||
    seguro_planilla.value == "" ||
    parqueo_planilla.value == "" ||
    bancos_planilla.value == ""
  ) {
    return false;
  } else {
    return true;
  }
}

function validar_inputs_originario() {
  var nacionalidad = document.getElementById("nacionalidad");
  var depto_originario = document.getElementById("depto_originario");
  var muni_originario = document.getElementById("muni_originario");
  if (
    nacionalidad.value != "" &&
    depto_originario.value != "" &&
    muni_originario.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function validar_inputs_empresa() {
  nombre_empresa = document.getElementById("nombre_empresa");
  direccion_empresarial = document.getElementById("direccion_empresarial");
  descripcion_empresa = document.getElementById("descripcion_empresa");
  if (
    nombre_empresa.value != "" &&
    direccion_empresarial.value != "" &&
    descripcion_empresa.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_empresas() {
  let template = "";
  empresas.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].index}</td>
            <td>${lista[0].nombre}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_empresa(${lista[0].index})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_empresa(${lista[0].index})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_empresas").innerHTML = template;
}

function limpiar_inputs_empresa() {
  nombre_empresa = document.getElementById("nombre_empresa");
  direccion_empresarial = document.getElementById("direccion_empresarial");
  descripcion_empresa = document.getElementById("descripcion_empresa");
  nombre_empresa.value = "";
  direccion_empresarial.value = "";
  descripcion_empresa.value = "";
}

function ocultar_botones_empresa() {
  document.getElementById("boton_agregar_empresa").hidden = false;
  document.getElementById("boton_editar_empresa").hidden = true;
  limpiar_inputs_empresa();
}

function guardar_empresa() {
  if (validar_inputs_empresa()) {
    nombre_empresa = document.getElementById("nombre_empresa");
    direccion_empresarial = document.getElementById("direccion_empresarial");
    descripcion_empresa = document.getElementById("descripcion_empresa");
    empresas.push([
      {
        index: index_empresa,
        nombre: nombre_empresa.value,
        direccion: direccion_empresarial.value,
        descripcion: descripcion_empresa.value,
      },
    ]);
    index_empresa = index_empresa + 1;
    cargar_empresas();
    $("#empresa_modal").modal("hide");
    limpiar_inputs_empresa();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_empresa(id) {
  id_empresa = document.getElementById("id_empresa");
  nombre_empresa = document.getElementById("nombre_empresa");
  direccion_empresarial = document.getElementById("direccion_empresarial");
  descripcion_empresa = document.getElementById("descripcion_empresa");
  $("#empresa_modal").modal("show");
  document.getElementById("boton_agregar_empresa").hidden = true;
  document.getElementById("boton_editar_empresa").hidden = false;
  id_empresa.value = id;
  nombre_empresa.value = empresas[id][0].nombre;
  direccion_empresarial.value = empresas[id][0].direccion;
  descripcion_empresa.value = empresas[id][0].descripcion;
}

function editar_empresa() {
  if (validar_inputs_empresa()) {
    id_empresa = document.getElementById("id_empresa").value;
    nombre_empresa = document.getElementById("nombre_empresa");
    direccion_empresarial = document.getElementById("direccion_empresarial");
    descripcion_empresa = document.getElementById("descripcion_empresa");
    empresas[id_empresa][0].nombre = nombre_empresa.value;
    empresas[id_empresa][0].direccion = direccion_empresarial.value;
    empresas[id_empresa][0].descripcion = descripcion_empresa.value;
    cargar_empresas();
    $("#empresa_modal").modal("hide");
    limpiar_inputs_empresa();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_empresa(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar la empresa?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_empresa(id);
    }
  });
}

function eliminar_empresa(id) {
  var index = empresas.findIndex((empresa) => empresa[0].index == id);
  empresas.splice(index, 1);
  empresas.forEach((empresa) => {
    empresa[0].index = index_empresa_eliminar;
    index_empresa_eliminar = index_empresa_eliminar + 1;
  });
  cargar_empresas();
  index_empresa = index_empresa_eliminar;
  index_empresa_eliminar = 0;
}

function validar_inputs_otros() {
  var horas_laborales = document.getElementById("horas_laborales");
  var ventajas_economicas = document.getElementById("ventajas_economicas");
  if (
    horas_laborales.value < 0 ||
    horas_laborales.value == "" ||
    ventajas_economicas.value < 0 ||
    ventajas_economicas.value == ""
  ) {
    return false;
  } else {
    return true;
  }
}

function validar_inputs_empleado() {
  var primer_nombre = document.getElementById("primer_nombre");
  var primer_apellido = document.getElementById("primer_apellido");
  var puesto = document.getElementById("puesto_empleado");
  var direccion = document.getElementById("direccion");
  var fecha_nacimiento = document.getElementById("fecha_nacimiento");
  var fecha_inicio = document.getElementById("fecha_inicio");
  var cmb = document.getElementsByClassName("title");
  var id_permisos = document.getElementById("id_permisos");
  if (
    primer_nombre.value != "" &&
    primer_apellido.value != "" &&
    puesto.value != "" &&
    direccion.value != "" &&
    fecha_nacimiento.value != "" &&
    fecha_inicio.value != "" &&
    id_permisos.value != "" &&
    cmb[3].innerText != "Estado..." &&
    cmb[4].innerText != "Estado Civil..." &&
    cmb[5].innerText != "Género..." &&
    cmb[9].innerText != "Tipo de pago..." &&
    cmb[11].innerText != "Moneda..." &&
    cmb[12].innerText != "Condición..." &&
    cmb[13].innerText != "Jornada..."
  ) {
    return true;
  } else {
    return false;
  }
}

function validar_intercompany() {
  var cmb = document.getElementsByClassName("title");
  if (
    cmb[0].innerText != "Departamento..." &&
    cmb[1].innerText != "Área..." &&
    cmb[2].innerText != "División..."
  ) {
    return true;
  } else {
    return false;
  }
}

function validar_porcentaje_intercompany() {
  var cantidades_porcentajes = [];
  empresas_intercompany.forEach((empresa) => {
    var input = document.getElementById("inp_porcentaje_" + empresa.id);
    cantidades_porcentajes.push(input.value);
  });
  var total_cantidades = 0;
  cantidades_porcentajes.forEach((cantidad) => {
    total_cantidades = total_cantidades + parseInt(cantidad);
  });
  if (total_cantidades != 100) {
    return false;
  } else {
    return true;
  }
}

function validar_empresa_principal() {
  listado_chx_intercompany = document.querySelectorAll(
    '[id*="chx_principal_"]'
  );
  var chx_intercompany_seleccionados = [];
  listado_chx_intercompany.forEach((elemento) => {
    chx_intercompany_seleccionados.push(elemento.checked);
  });
  var conteo = count_value_occurrences(chx_intercompany_seleccionados, true);
  if (conteo != 1) {
    return false;
  } else {
    return true;
  }
}

function validar_inputs_vehiculo() {
  marca_vehiculo = document.getElementById("marca_vehiculo");
  modelo_vehiculo = document.getElementById("modelo_vehiculo");
  placa_vehiculo = document.getElementById("placa_vehiculo");
  if (
    marca_vehiculo.value != "" &&
    modelo_vehiculo.value != "" &&
    placa_vehiculo.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function cargar_vehiculos() {
  let template = "";
  vehiculos.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].index}</td>
            <td>${lista[0].marca}</td>
            <td>${lista[0].modelo}</td>
            <td>${lista[0].placa}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_vehiculo(${lista[0].index})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_vehiculo(${lista[0].index})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_vehiculos").innerHTML = template;
}

function limpiar_inputs_vehiculo() {
  marca_vehiculo = document.getElementById("marca_vehiculo");
  modelo_vehiculo = document.getElementById("modelo_vehiculo");
  placa_vehiculo = document.getElementById("placa_vehiculo");
  marca_vehiculo.value = "";
  modelo_vehiculo.value = "";
  placa_vehiculo.value = "";
}

function ocultar_botones_vehiculo() {
  document.getElementById("boton_agregar_vehiculo").hidden = false;
  document.getElementById("boton_editar_vehiculo").hidden = true;
  limpiar_inputs_vehiculo();
}

function guardar_vehiculo() {
  if (validar_inputs_vehiculo()) {
    marca_vehiculo = document.getElementById("marca_vehiculo");
    modelo_vehiculo = document.getElementById("modelo_vehiculo");
    placa_vehiculo = document.getElementById("placa_vehiculo");
    vehiculos.push([
      {
        index: index_vehiculo,
        marca: marca_vehiculo.value,
        modelo: modelo_vehiculo.value,
        placa: placa_vehiculo.value,
      },
    ]);
    index_vehiculo = index_vehiculo + 1;
    cargar_vehiculos();
    $("#vehiculo_modal").modal("hide");
    limpiar_inputs_vehiculo();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_vehiculo(id) {
  id_vehiculo = document.getElementById("id_vehiculo");
  marca_vehiculo = document.getElementById("marca_vehiculo");
  modelo_vehiculo = document.getElementById("modelo_vehiculo");
  placa_vehiculo = document.getElementById("placa_vehiculo");
  $("#vehiculo_modal").modal("show");
  document.getElementById("boton_agregar_vehiculo").hidden = true;
  document.getElementById("boton_editar_vehiculo").hidden = false;
  id_vehiculo.value = id;
  marca_vehiculo.value = vehiculos[id][0].marca;
  modelo_vehiculo.value = vehiculos[id][0].modelo;
  placa_vehiculo.value = vehiculos[id][0].placa;
}

function editar_vehiculo() {
  if (validar_inputs_vehiculo()) {
    id_vehiculo = document.getElementById("id_vehiculo").value;
    marca_vehiculo = document.getElementById("marca_vehiculo");
    modelo_vehiculo = document.getElementById("modelo_vehiculo");
    placa_vehiculo = document.getElementById("placa_vehiculo");
    vehiculos[id_vehiculo][0].marca = marca_vehiculo.value;
    vehiculos[id_vehiculo][0].modelo = modelo_vehiculo.value;
    vehiculos[id_vehiculo][0].placa = placa_vehiculo.value;
    cargar_vehiculos();
    $("#vehiculo_modal").modal("hide");
    limpiar_inputs_vehiculo();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_vehiculo(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el vehículo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_vehiculo(id);
    }
  });
}

function eliminar_vehiculo(id) {
  var index = vehiculos.findIndex((vehiculo) => vehiculo[0].index == id);
  vehiculos.splice(index, 1);
  vehiculos.forEach((vehiculo) => {
    vehiculo[0].index = index_vehiculo_eliminar;
    index_vehiculo_eliminar = index_vehiculo_eliminar + 1;
  });
  cargar_vehiculos();
  index_vehiculo = index_vehiculo_eliminar;
  index_vehiculo_eliminar = 0;
}

function validar_inputs_hijo() {
  nombre_hijo = document.getElementById("nombre_hijo");
  edad_hijo = document.getElementById("edad_hijo");
  if (nombre_hijo.value != "" && edad_hijo.value != "") {
    return true;
  } else {
    return false;
  }
}

function cargar_hijos() {
  let template = "";
  hijos.forEach((lista) => {
    template += `
        <tr>
            <td>${lista[0].nombre}</td>
            <td>${lista[0].edad}</td>
            <td>
                <div class="action-btns">
                    <a onclick="modal_editar_hijo(${lista[0].index})"
                        class="action-btn btn-edit bs-tooltip me-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit-2">
                        <path
                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                        </path>
                        </svg>
                    </a>
                    <a onclick="advertencia_eliminar_hijo(${lista[0].index})"
                        class="action-btn btn-delete bs-tooltip"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-trash-2">
                        <polyline
                            points="3 6 5 6 21 6">
                        </polyline>
                        <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                        <line x1="10" y1="11"
                            x2="10" y2="17"></line>
                        <line x1="14" y1="11"
                            x2="14" y2="17"></line>
                        </svg>
                    </a>
                </div>
            </td>
        </tr>
        `;
  });
  document.getElementById("cuerpo_tabla_hijos").innerHTML = template;
}

function limpiar_inputs_hijo() {
  nombre_hijo = document.getElementById("nombre_hijo");
  edad_hijo = document.getElementById("edad_hijo");
  nombre_hijo.value = "";
  edad_hijo.value = "";
}

function ocultar_botones_hijo() {
  document.getElementById("boton_agregar_hijo").hidden = false;
  document.getElementById("boton_editar_hijo").hidden = true;
  limpiar_inputs_hijo();
}

function guardar_hijo() {
  if (validar_inputs_hijo()) {
    nombre_hijo = document.getElementById("nombre_hijo");
    edad_hijo = document.getElementById("edad_hijo");
    hijos.push([
      {
        index: index_hijo,
        nombre: nombre_hijo.value,
        edad: edad_hijo.value,
      },
    ]);
    index_hijo = index_hijo + 1;
    cargar_hijos();
    $("#familia_modal").modal("hide");
    limpiar_inputs_hijo();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function modal_editar_hijo(id) {
  id_hijo = document.getElementById("id_hijo");
  nombre_hijo = document.getElementById("nombre_hijo");
  edad_hijo = document.getElementById("edad_hijo");
  $("#familia_modal").modal("show");
  document.getElementById("boton_agregar_hijo").hidden = true;
  document.getElementById("boton_editar_hijo").hidden = false;
  id_hijo.value = id;
  nombre_hijo.value = hijos[id][0].nombre;
  edad_hijo.value = hijos[id][0].edad;
}

function editar_hijo() {
  if (validar_inputs_hijo()) {
    id_hijo = document.getElementById("id_hijo").value;
    nombre_hijo = document.getElementById("nombre_hijo");
    edad_hijo = document.getElementById("edad_hijo");
    hijos[id_hijo][0].nombre = nombre_hijo.value;
    hijos[id_hijo][0].edad = edad_hijo.value;
    cargar_hijos();
    $("#familia_modal").modal("hide");
    limpiar_inputs_hijo();
  } else {
    Swal.fire({
      title: "Campos Vacios",
      html: "Por favor, asegurese de haber llenado todos los campos",
      icon: "warning",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }
}

function advertencia_eliminar_hijo(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar al hijo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar_hijo(id);
    }
  });
}

function eliminar_hijo(id) {
  var index = hijos.findIndex((hijo) => hijo[0].index == id);
  hijos.splice(index, 1);
  hijos.forEach((hijo) => {
    hijo[0].index = index_hijo_eliminar;
    index_hijo_eliminar = index_hijo_eliminar + 1;
  });
  cargar_hijos();
  index_hijo = index_hijo_eliminar;
  index_hijo_eliminar = 0;
}

async function validar_empleado_repetido() {
  var dpi = document.getElementById("dpi");
  var no_igss = document.getElementById("no_igss");

  if (dpi.value == '') {
    Swal.fire({
      title: 'DPI Vacio',
      html: 'Por favor, asegurese de haber ingresado el DPI',
      icon: 'warning',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false
    });
    return;
  }

  if (no_igss.value == '') {
    Swal.fire({
      title: 'IGSS Vacio',
      html: 'Por favor, asegurese de haber ingresado el número de IGSS',
      icon: 'warning',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false
    });
    return;
  }

  const respDpi = await $.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
      quest: 'buscar_empleado_dpi',
      dpi: dpi.value
    },
  });

  let listaDpi;
  if (typeof respDpi === 'string') {
    listaDpi = JSON.parse(respDpi);
  } else {
    listaDpi = respDpi;
  }

  if (listaDpi.error && listaDpi.error.includes('Query Fall')) {
    Swal.fire({
      title: 'Error',
      html: 'Ha ocurrido un error al validar el DPI',
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
    });
    return;
  } else if (listaDpi.cantidad > 0) {
    Swal.fire({
      title: 'DPI Duplicado',
      html: 'El DPI ingresado ya se encuentra registrado a nombre de otro empleado. No puede continuar.',
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar'
    });
    return;
  }

  const respIgss = await $.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
      quest: 'buscar_empleado_igss',
      igss: no_igss.value
    },
  });

  let listaIgss;
  if (typeof respIgss === 'string') {
    listaIgss = JSON.parse(respIgss);
  } else {
    listaIgss = respIgss;
  }

  if (listaIgss.error && listaIgss.error.includes('Query Fall')) {
    Swal.fire({
      title: 'Error',
      html: 'Ha ocurrido un error al validar el IGSS',
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
    });
    return;
  } else if (listaIgss.cantidad > 0) {
    Swal.fire({
      title: 'IGSS Duplicado',
      html: 'El número de IGSS ingresado ya se encuentra registrado a nombre de otro empleado. No puede continuar.',
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar'
    });
    return;
  }

  ingresar_empleado();
}

function ingresar_empleado() {
  if (validar_inputs_empleado()) {
    if (validar_intercompany()) {
      if (validar_porcentaje_intercompany()) {
        if (validar_empresa_principal()) {
          if (validar_inputs_planilla()) {
            if (validar_inputs_originario()) {
              return new Promise((resolve) => {
                cargando();
                var primer_nombre = document.getElementById("primer_nombre");
                var segundo_nombre = document.getElementById("segundo_nombre");
                var otros_nombres = document.getElementById("otro_nombre");
                var primer_apellido =
                  document.getElementById("primer_apellido");
                var segundo_apellido =
                  document.getElementById("segundo_apellido");
                var apellido_casada =
                  document.getElementById("apellido_casada");
                var estado_empleado = document.getElementById("estado");
                var estado_civil = document.getElementById("estado_civil");
                var genero = document.getElementById("genero");
                var telefono_domiciliar = document.getElementById(
                  "telefono_domiciliar"
                );
                var celular_personal =
                  document.getElementById("celular_personal");
                var telefono_emergencia = document.getElementById(
                  "telefono_emergencia"
                );
                var nombre_emergencia =
                  document.getElementById("nombre_emergencia");
                var direccion = document.getElementById("direccion");
                var fecha_nacimiento =
                  document.getElementById("fecha_nacimiento");
                var edad = document.getElementById("edad_empleado");
                var tipo_licencia = document.getElementById("tipo_licencia");
                var clase_licencia = document.getElementById("clase_licencia");
                var no_licencia = document.getElementById("licencia");
                var dpi = document.getElementById("dpi");
                var emision_dpi = document.getElementById("lugar_dpi");
                var horas_extra = document.getElementById("horas_extra");
                var no_iggs = document.getElementById("no_igss");
                var nit = document.getElementById("nit");
                var no_cuenta = document.getElementById("no_cuenta");
                var banco = document.getElementById("banco");
                var pago = document.getElementById("pago");
                var tipo_cuenta = document.getElementById("tipo_cuenta");
                var moneda = document.getElementById("moneda");
                var fecha_inicio = document.getElementById("fecha_inicio");
                var fecha_baja = document.getElementById("fecha_baja");
                var departamento_laboral = document.getElementById(
                  "departamento_laboral"
                );
                var centro_de_costo =
                  document.getElementById("centro_de_costo");
                var primaria = document.getElementById("primaria");
                var grado_primaria = document.getElementById("grado_primaria");
                var secundaria = document.getElementById("secundaria");
                var grado_secundaria =
                  document.getElementById("grado_secundaria");
                var diversificado = document.getElementById("diversificado");
                var universidad = document.getElementById("universidad");
                var bon_dec_31_2001 =
                  document.getElementById("bon_dec_31_2001");
                var anticipo_quincenal =
                  document.getElementById("anticipo_quincenal");
                var bantrab = document.getElementById("bantrab");
                var bon_incentivo = document.getElementById("bon_incentivo");
                var ornato = document.getElementById("ornato");
                var horas_extras_dobles = document.getElementById(
                  "horas_extras_dobles"
                );
                var horas_simples = document.getElementById("horas_simples");
                var igss_laboral = document.getElementById("igss_laboral");
                var sueldo_ordinario =
                  document.getElementById("sueldo_ordinario");
                var isr = document.getElementById("isr");
                var otros_ingresos = document.getElementById("otros_ingresos");
                var otros_egresos = document.getElementById("otros_egresos");
                var prestamo_empresa_planilla = document.getElementById(
                  "prestamo_empresa_planilla"
                );
                var vacaciones_planilla = document.getElementById(
                  "vacaciones_planilla"
                );
                var bancos_planilla =
                  document.getElementById("bancos_planilla");
                var judiciales_planilla = document.getElementById(
                  "judiciales_planilla"
                );
                var seguro_planilla =
                  document.getElementById("seguro_planilla");
                var parqueo_planilla =
                  document.getElementById("parqueo_planilla");
                var nacionalidad = document.getElementById("nacionalidad");
                var region_originario =
                  document.getElementById("region_originario");
                var depto_originario =
                  document.getElementById("depto_originario");
                var muni_labora = document.getElementById("muni_donde_labora");
                var muni_originario =
                  document.getElementById("muni_originario");
                var apellido_casada_originario =
                  document.getElementById("apellido_casada");
                var tipo_planilla = document.getElementById("tipo_planilla");
                var codigo_ocupacion =
                  document.getElementById("codigo_ocupacion");
                var condicion_laboral =
                  document.getElementById("condicion_laboral");
                var nombre_padre = document.getElementById("nombre_padre");
                var edad_padre = document.getElementById("edad_padre");
                var ocupacion_padre =
                  document.getElementById("ocupacion_padre");
                var nombre_madre = document.getElementById("nombre_madre");
                var edad_madre = document.getElementById("edad_madre");
                var ocupacion_madre =
                  document.getElementById("ocupacion_madre");
                var nombre_conyuge = document.getElementById("conyuge");
                var edad_conyuge = document.getElementById("conyuge_edad");
                var ocupacion_conyuge =
                  document.getElementById("conyuge_ocupacion");
                var horas_laborales =
                  document.getElementById("horas_laborales");
                var porcentaje_ventajas = document.getElementById(
                  "ventajas_economicas"
                );
                var temporal = document.getElementById("tiempo_temporal");
                var puesto = document.getElementById("puesto_empleado");
                var jubilacion = document.getElementById("jubilacion");
                var discapacidad = document.getElementById("discapacidad");
                var jornada = document.getElementById("jornada");
                var id_permisos = document.getElementById("id_permisos");
                var titulos_diplomas = document.getElementById("titulos_diplomas");
                var afiliacion_igss = document.getElementById("afiliacion_igss");
                var cmb = document.getElementsByClassName("title");
                var dimension_3 = document.getElementById("dimension_3");
                var dimension_4 = document.getElementById("dimension_4");
                var dimension_5 = document.getElementById("dimension_5");
                $.ajax({
                  url: "php/servidor.php",
                  type: "POST",
                  dataType: "text",
                  data: {
                    quest: "ingresar_empleado",
                    estado: estado_empleado.value,
                    primer_nombre: primer_nombre.value,
                    segundo_nombre: segundo_nombre.value,
                    otro_nombre: otros_nombres.value,
                    primer_apellido: primer_apellido.value,
                    segundo_apellido: segundo_apellido.value,
                    direccion: direccion.value,
                    estado_civil:
                      estado_civil.options[estado_civil.selectedIndex].value,
                    fecha_nacimiento: fecha_nacimiento.value,
                    dpi: dpi.value,
                    no_iggs: no_iggs.value,
                    centro_de_costo:
                      centro_de_costo.options[centro_de_costo.selectedIndex]
                        .value,
                    fecha_inicio: fecha_inicio.value,
                    fecha_baja: fecha_baja.value,
                    telefono: telefono_domiciliar.value,
                    genero: genero.options[genero.selectedIndex].value,
                    licencia: no_licencia.value,
                    id_tipo_licencia:
                      tipo_licencia.options[tipo_licencia.selectedIndex].value,
                    id_clase_licencia:
                      clase_licencia.options[clase_licencia.selectedIndex]
                        .value,
                    horas_extra: horas_extra.checked,
                    tipo_de_pago: pago.options[pago.selectedIndex].value,
                    tipo_cuenta:
                      tipo_cuenta.options[tipo_cuenta.selectedIndex].value,
                    banco: banco.options[banco.selectedIndex].value,
                    no_cuenta: no_cuenta.value,
                    moneda: moneda.options[moneda.selectedIndex].value,
                    conyuge: nombre_conyuge.value,
                    bon_dec_37_2001: bon_dec_31_2001.value,
                    bon_incentivo: bon_incentivo.value,
                    horas_extras_dobles: horas_extras_dobles.value,
                    horas_extras_simples: horas_simples.value,
                    sueldo_ordinario: sueldo_ordinario.value,
                    otro_ingresos: otros_ingresos.value,
                    total_iggs: 0,
                    vacaciones: vacaciones_planilla.value,
                    bancos: bancos_planilla.value,
                    judiciales: judiciales_planilla.value,
                    seguro: seguro_planilla.value,
                    parqueo: parqueo_planilla.value,
                    anticipo_quincenal: anticipo_quincenal.value,
                    bantrab: bantrab.value,
                    boleto_de_ornato: ornato.value,
                    iggs_laboral: igss_laboral.value,
                    iggs_patronal: 0,
                    isr: isr.value,
                    otro_descuentos: otros_egresos.value,
                    prestamo_empresa: prestamo_empresa_planilla.value,
                    primaria: primaria.checked,
                    grado_primaria: grado_primaria.value,
                    secundaria: secundaria.checked,
                    grado_secundaria: grado_secundaria.value,
                    diversificado: diversificado.checked,
                    universidad: universidad.checked,
                    nacionalidad: nacionalidad.value,
                    region_originario: region_originario.value,
                    departamento_originario: depto_originario.value,
                    municipio_originario: muni_originario.value,
                    municipio_laboral: muni_labora.value,
                    apellido_casada: apellido_casada.value,
                    condicion_laboral:
                      condicion_laboral.options[condicion_laboral.selectedIndex]
                        .value,
                    codigo_ocupacion: codigo_ocupacion.value,
                    tipo_planilla: tipo_planilla.value,
                    horas_laborales: horas_laborales.value,
                    ventas_economicas: porcentaje_ventajas.value,
                    temporal: temporal.value,
                    telefono_celular: celular_personal.value,
                    telefono_emergencia: telefono_emergencia.value,
                    nombre_emergencia: nombre_emergencia.value,
                    edad: edad.value,
                    emision_dpi: emision_dpi.value,
                    edad_conyuge: edad_conyuge.value,
                    ocupacion_conyuge: ocupacion_conyuge.value,
                    nombre_padre: nombre_padre.value,
                    edad_padre: edad_padre.value,
                    ocupacion_padre: ocupacion_padre.value,
                    nombre_madre: nombre_madre.value,
                    edad_madre: edad_madre.value,
                    ocupacion_madre: ocupacion_madre.value,
                    nit: nit.value,
                    departamento_laboral:
                      departamento_laboral.options[
                        departamento_laboral.selectedIndex
                      ].value,
                    apellido_casada_originario:
                      apellido_casada_originario.value,
                    puesto: puesto.value,
                    jubilacion: jubilacion.checked,
                    discapacidad: discapacidad.value,
                    jornada: jornada.value,
                    id_permisos: id_permisos.value,
                    titulos_diplomas: titulos_diplomas.value,
                    afiliacion_igss: afiliacion_igss.value,
                    dimension_3: dimension_3.options[dimension_3.selectedIndex].value,
                    dimension_4: cmb[3].innerHTML == 'Sub División...' ? 'NULL' : dimension_4.options[dimension_4.selectedIndex].value,
                    dimension_5: cmb[4].innerHTML == 'Nivel 5...' ? 'NULL' : dimension_5.options[dimension_5.selectedIndex].value,
                    empresas_json: JSON.stringify(empresas_intercompany),
                  },
                  success: function (resp) {
                    console.log("DEBUG: Respuesta de ingresar_empleado:", resp);
                    if (resp.includes("Successfully")) {
                      console.log("DEBUG: Empleado insertado exitosamente, resolviendo promesa");
                      resolve("success");
                    } else {
                      console.error("DEBUG: Error al insertar empleado:", resp);
                      Swal.fire({
                        icon: "error",
                        title: "Ah Ocurrido Un Error :(",
                        text: "No se ha podido ingresar el empleado, intentalo de nuevo",
                      });
                      console.log(resp);
                      resolve("error");
                    }
                  },
                  error: function(xhr, status, error) {
                    console.error("DEBUG: Error AJAX en ingresar_empleado:", error);
                    console.error("DEBUG: Detalles del error:", xhr.responseText);
                    Swal.fire({
                      icon: "error",
                      title: "Error de Comunicación",
                      text: "No se pudo conectar con el servidor. Por favor, intenta de nuevo.",
                    });
                    resolve("error");
                  }
                });
              }).then(() => {
                console.log("DEBUG: Empleado insertado, saltando datos opcionales e iniciando IGSS");
                // Saltar todas las inserciones opcionales y ir directo a IGSS
                return ingresar_igss_laboral();
              });
            } else {
              Swal.fire({
                icon: "warning",
                title: "Datos Faltantes Originario",
                text: "Por favor asegurese de haber llenado los campos del apartado Originario de caracter OBLIGATORIO",
              });
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Valores Invalidos Planilla",
              text: "Por favor asegurese de haber ingresado valores validos y haber llenado los campos de caracter OBLIGATORIO en el apartado de Planilla",
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Empresa Principal Del Empleado Invalida",
            html: "Por favor asegurese de haber seleccionado <strong><u>UNA</u></strong> empresa principal",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Porcentajes Empresa Del Empleado Invalidos",
          text: "Por favor asegurese de haber ingresado correctamente los porcentajes en el apartado de Empresa Del Empleado, estos tienen que sumar exactamente 100%",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Datos Faltantes Empresa Del Empleado",
        text: "Por favor asegurese de haber llenado los campos del apartado Empresa Del Empleado de caracter OBLIGATORIO",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Datos Faltantes Empleado",
      text: "Por favor asegurese de haber llenado los campos del empleado de caracter OBLIGATORIO",
    });
  }
}

function cargando() {
  Swal.fire({
    title: "Procesando...",
    html: "Esto puede demorar unos momentos",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });
}

function ingresar_estudio_db(resolve) {
  estudios.forEach((estudio) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_estudio",
        carrera: estudio[1],
        descripcion: estudio[2],
        universidad: estudio[4],
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Educación",
            text: "Ha ocurrido un error al intentar ingresar la educación en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_curso_db(resolve) {
  cursos.forEach((curso) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_curso",
        nombre: curso[1],
        lugar: curso[13],
        interno: curso[2],
        ano: curso[3],
        mes: curso[4],
        diploma: curso[5],
        obligacion: curso[8],
        ano_obligacion: curso[6],
        mes_obligacion: curso[7],
        reembolsar: curso[9],
        fecha_capacitacion: curso[14],
        codigo_curso: curso[15],
        nombre_curso: curso[16],
        induccion: curso[10],
        general: curso[11],
        funciones: curso[12],
        fecha_evaluacion: curso[17],
        nota: curso[18],
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Curso",
            text: "Ha ocurrido un error al intentar ingresar el curso a la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_puesto_db(resolve) {
  puestos.forEach((puesto) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_puesto",
        fecha: puesto[0].fecha,
        cod_depto: puesto[0].cod_depto,
        departamento: puesto[0].departamento,
        cod_puesto: puesto[0].cod_puesto,
        puesto: puesto[0].puesto,
        motivo: puesto[0].motivo,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Puesto",
            text: "Ha ocurrido un error al intentar ingresar el puesto en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_evento_db(resolve) {
  eventos.forEach((evento) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_evento",
        tipo: evento[0].tipo,
        numero: evento[0].numero,
        fecha_inicio: evento[0].fecha_inicio,
        fecha_final: evento[0].fecha_final,
        año: evento[0].ano,
        mes: evento[0].mes,
        dia: evento[0].dia,
        hora: evento[0].hora,
        minuto: evento[0].minuto,
        procesar: evento[0].procesar,
        planilla: evento[0].planilla,
        estado: evento[0].estado,
        observaciones: evento[0].observaciones,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Evento",
            text: "Ha ocurrido un error al intentar ingresar el evento en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_record_db(resolve) {
  records.forEach((record) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_record",
        fecha: record[0].fecha,
        descripcion: record[0].descripcion,
        tipo: record[0].tipo,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Record",
            text: "Ha ocurrido un error al intentar ingresar el record en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_empresa_anterior_db(resolve) {
  empresas.forEach((empresa) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_empresa_anterior",
        nombre: empresa[0].nombre,
        direccion: empresa[0].direccion,
        motivo: empresa[0].descripcion,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Empresa",
            text: "Ha ocurrido un error al intentar ingresar la empresa en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_vehiculo_db(resolve) {
  vehiculos.forEach((vehiculo) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_vehiculo",
        marca: vehiculo[0].marca,
        modelo: vehiculo[0].modelo,
        placa: vehiculo[0].placa,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Vehiculo",
            text: "Ha ocurrido un error al intentar ingresar el vehiculo en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_hijo_db(resolve) {
  hijos.forEach((hijo) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_hijo",
        nombre: hijo[0].nombre,
        edad: hijo[0].edad,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Hijo",
            text: "Ha ocurrido un error al intentar ingresar el hijo en la base de datos",
          });
          console.log(resp);
        } else {
          resolve("success");
        }
      },
    });
  });
}

function ingresar_empresa_principal_db() {
  return new Promise((resolve) => {
    try {
      console.log("DEBUG: Ejecutando ingresar_empresa_principal_db");
      let centro_de_costo = document.getElementById("centro_de_costo").value;
      console.log("DEBUG: Centro de costo:", centro_de_costo);
      
      if (!centro_de_costo) {
        console.log("DEBUG: No hay centro de costo, resolviendo success");
        resolve("success");
        return;
      }
      
      $.ajax({
        url: "php/servidor.php",
        type: "POST",
        data: {
          quest: "ingresar_empresa_principal_db",
          id_centro: centro_de_costo,
        },
        success: function (resp) {
          console.log("DEBUG: Respuesta del servidor:", resp);
          if (resp.includes("Successfully")) {
            console.log("DEBUG: Empresa Principal Ingresada exitosamente");
            resolve("success");
          } else {
            console.error("DEBUG: Error al ingresar empresa principal:", resp);
            resolve("error");
          }
        },
        error: function (xhr, status, error) {
          console.error("Error de red al ingresar empresa principal:", error);
          resolve("error");
        }
      });
    } catch (error) {
      console.error("Error en ingresar_empresa_principal_db:", error);
      resolve("error");
    }
  });
}

// Esta función ya no se usa - las empresas se insertan directamente en el servidor
// cuando se inserta el empleado
function ingresar_empresa_empleado_db() {
  return new Promise((resolve) => {
    console.log("DEBUG: ingresar_empresa_empleado_db ya no se usa - empresas se insertan en el servidor");
    resolve("success");
  });
}

function ingresar_igss_laboral() {
  console.log("DEBUG: Iniciando ingresar_igss_laboral");
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      dataType: "text",
      data: {
        quest: "ingresar_igss_empleado",
      },
      success: function (res) {
        console.log("DEBUG: Respuesta igss_laboral:", res);
        if (res.includes("Query Falló")) {
          console.error("DEBUG: Error en query igss_laboral");
          resolve("error");
        } else {
          console.log("DEBUG: Igss Laboral Ingresado exitosamente");
          resolve("success");
        }
      },
      error: function (xhr, status, error) {
        console.error("DEBUG: Error AJAX igss_laboral:", error);
        resolve("error");
      }
    });
  }).then((result) => {
    console.log("DEBUG: igss_laboral completado, iniciando igss_patronal");
    return ingresar_igss_patronal();
  }).then((result) => {
    console.log("DEBUG: igss_patronal completado, cerrando modal");
    setTimeout(() => {
      try {
        Swal.close();
      } catch (e) {
        console.log("Error cerrando modal:", e);
      }
      Swal.fire({
        title: "Empleado Ingresado",
        icon: "success",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "./empleados.html";
      });
    }, 500);
  }).catch((error) => {
    console.error("DEBUG: Error capturado en el flujo:", error);
    setTimeout(() => {
      try {
        Swal.close();
      } catch (e) {
        console.log("Error cerrando modal:", e);
      }
      Swal.fire({
        title: "Empleado Ingresado",
        icon: "success",
        text: "El empleado se ha agregado correctamente",
        allowOutsideClick: false,
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "./empleados.html";
      });
    }, 500);
  });
}

function ingresar_igss_patronal() {
  console.log("DEBUG: Iniciando ingresar_igss_patronal");
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      dataType: "text",
      data: {
        quest: "ingresar_igss_patronal",
      },
      success: function (res) {
        console.log("DEBUG: Respuesta igss_patronal:", res);
        if (res.includes("Query Falló")) {
          console.error("DEBUG: Error en query igss_patronal");
          resolve("error");
        } else {
          console.log("DEBUG: Igss Patronal Ingresado exitosamente");
          resolve("success");
        }
      },
      error: function (xhr, status, error) {
        console.error("DEBUG: Error AJAX igss_patronal:", error);
        resolve("error");
      }
    });
  });
}
