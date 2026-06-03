//------------------------Variables Globales----------------------//
var id_empleado = sessionStorage.getItem("id_empleado");
var detalle = sessionStorage.getItem("detalle_empleado");
var combobox;
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

// Función helper para actualizar el texto visible de un vanillaSelectBox
function updateSelectBoxText(selectElement) {
  if (!selectElement) return;
  
  // Buscar el contenedor del vanillaSelectBox y actualizar el .title
  const parent = selectElement.parentElement;
  if (parent) {
    const titleElement = parent.querySelector('.vsb-main .title');
    if (titleElement && selectElement.selectedIndex >= 0) {
      titleElement.innerHTML = selectElement.options[selectElement.selectedIndex].text;
    }
  }
}

// Función para calcular la edad actual basándose en la fecha de nacimiento
function calcularEdadActual(fechaNacimientoStr) {
  if (!fechaNacimientoStr || fechaNacimientoStr == '' || fechaNacimientoStr == '0000-00-00' || fechaNacimientoStr == '0000-00-00 00:00:00') {
    return 0;
  }
  
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimientoStr);
  
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = fechaNac.getMonth();
  
  // Si aún no ha llegado el mes de cumpleaños, o si es el mes pero no ha llegado el día
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad;
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

const tiempoTemporal = document.getElementById("tiempo_temporal");
if (tiempoTemporal) {
    var f4 = flatpickr(tiempoTemporal);
}
//------------------------Variables Globales----------------------//

//-------------------------INPUTS------------------------//
var primer_nombre = document.getElementById("primer_nombre");
var segundo_nombre = document.getElementById("segundo_nombre");
var otros_nombres = document.getElementById("otro_nombre");
var primer_apellido = document.getElementById("primer_apellido");
var segundo_apellido = document.getElementById("segundo_apellido");
var apellido_casada = document.getElementById("apellido_casada");
var estado_empleado = document.getElementById("estado");
var estado_civil = document.getElementById("estado_civil");
var genero = document.getElementById("genero");
var telefono_domiciliar = document.getElementById("telefono_domiciliar");
var celular_personal = document.getElementById("celular_personal");
var telefono_emergencia = document.getElementById("telefono_emergencia");
var nombre_emergencia = document.getElementById("nombre_emergencia");
var direccion = document.getElementById("direccion");
var fecha_nacimiento = document.getElementById("fecha_nacimiento");
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
var tipo_cuenta = document.getElementById("tipo_cuenta");
var banco = document.getElementById("banco");
var pago = document.getElementById("pago");
var moneda = document.getElementById("moneda");
var fecha_inicio = document.getElementById("fecha_inicio");
var fecha_baja = document.getElementById("fecha_baja");
var motivo_baja = document.getElementById("motivo_baja");
var departamento_laboral = document.getElementById("departamento_laboral");
var centro_de_costo = document.getElementById("centro_de_costo");
var dimension_3 = document.getElementById("dimension_3");
var dimension_4 = document.getElementById("dimension_4");
var dimension_5 = document.getElementById("dimension_5");
var puesto_empleado = document.getElementById("puesto_empleado");
var empresa_principal = document.getElementById("empresa_principal");
var primaria = document.getElementById("primaria");
var grado_primaria = document.getElementById("grado_primaria");
var secundaria = document.getElementById("secundaria");
var grado_secundaria = document.getElementById("grado_secundaria");
var diversificado = document.getElementById("diversificado");
var universidad = document.getElementById("universidad");
var carrera = document.getElementById("carrera");
var descripcion_estudios = document.getElementById("descripcion_estudios");
var listado_universidad = document.getElementById("universidad_modal");
var id_estudios = document.getElementById("id_estudios");
var nombre_del_curso = document.getElementById("nombre_del_curso");
var id_curso = document.getElementById("id_curso");
var interno = document.getElementById("interno");
var ano = document.getElementById("ano");
var mes = document.getElementById("mes");
var diploma = document.getElementById("diploma");
var ano_obligacion = document.getElementById("ano_obligacion");
var mes_obligacion = document.getElementById("mes_obligacion");
var obligacion = document.getElementById("obligacion");
var reembolsar = document.getElementById("reembolsar");
var induccion_bmps = document.getElementById("induccion_bmps");
var general = document.getElementById("general");
var funciones = document.getElementById("funciones");
var lugar_curso = document.getElementById("lugar_curso");
var fecha_capacitacion = document.getElementById("fecha_capacitacion");
var codigo_curso = document.getElementById("codigo_curso");
var nombre_curso = document.getElementById("nombre_curso");
var fecha_evaluacion = document.getElementById("fecha_evaluacion");
var nota = document.getElementById("nota");
var id_puestos = document.getElementById("id_puestos");
var fecha_puesto = document.getElementById("fecha_puesto");
var codigo_departamento_puesto = document.getElementById(
  "codigo_departamento_puesto"
);
var departamento_puesto = document.getElementById("departamento_puesto");
var codigo_puesto = document.getElementById("codigo_puesto");
var puesto = document.getElementById("puesto_nombre");
var motivo_puesto = document.getElementById("motivo_puesto");
var id_evento = document.getElementById("id_evento");
var tipo_evento = document.getElementById("tipo_evento");
var numero_evento = document.getElementById("numero_evento");
var fecha_inicio_evento = document.getElementById("fecha_inicio_evento");
var fecha_final_evento = document.getElementById("fecha_final_evento");
var ano_evento = document.getElementById("ano_evento");
var mes_evento = document.getElementById("mes_evento");
var dia_evento = document.getElementById("dia_evento");
var hora_evento = document.getElementById("hora_evento");
var minuto_evento = document.getElementById("minuto_evento");
var procesar_evento = document.getElementById("procesar_evento");
var planilla_evento = document.getElementById("planilla_evento");
var estado_evento = document.getElementById("estado_evento");
var observaciones_evento = document.getElementById("observaciones_evento");
var id_record = document.getElementById("id_record");
var fecha_record = document.getElementById("fecha_record");
var descripcion_record = document.getElementById("descripcion_record");
var tipo_record = document.getElementById("tipo_record");
var id_empresa = document.getElementById("id_empresa");
var nombre_empresa = document.getElementById("nombre_empresa");
var direccion_empresarial = document.getElementById("direccion_empresarial");
var descripcion_empresa = document.getElementById("descripcion_empresa");
var id_vehiculo = document.getElementById("id_vehiculo");
var marca_vehiculo = document.getElementById("marca_vehiculo");
var modelo_vehiculo = document.getElementById("modelo_vehiculo");
var placa_vehiculo = document.getElementById("placa_vehiculo");
var id_hijo = document.getElementById("id_hijo");
var nombre_hijo = document.getElementById("nombre_hijo");
var edad_hijo = document.getElementById("edad_hijo");
var bon_dec_31_2001 = document.getElementById("bon_dec_31_2001");
var anticipo_quincenal = document.getElementById("anticipo_quincenal");
var bantrab = document.getElementById("bantrab");
var bon_incentivo = document.getElementById("bon_incentivo");
var ornato = document.getElementById("ornato");
var horas_extras_dobles = document.getElementById("horas_extras_dobles");
var horas_simples = document.getElementById("horas_simples");
var igss_laboral = document.getElementById("igss_laboral");
var igss_patronal = document.getElementById("igss_patronal");
var sueldo_ordinario = document.getElementById("sueldo_ordinario");
var isr = document.getElementById("isr");
var otros_ingresos = document.getElementById("otros_ingresos");
var otros_egresos = document.getElementById("otros_egresos");
var total_IGSS = document.getElementById("total_IGSS");
var prestamo_empresa_planilla = document.getElementById(
  "prestamo_empresa_planilla"
);
var bancos_planilla = document.getElementById("bancos_planilla");
var judiciales_planilla = document.getElementById("judiciales_planilla");
var seguro_planilla = document.getElementById("seguro_planilla");
var parqueo_planilla = document.getElementById("parqueo_planilla");
var vacaciones_planilla = document.getElementById("vacaciones_planilla");
var nacionalidad = document.getElementById("nacionalidad");
var region_originario = document.getElementById("region_originario");
var depto_originario = document.getElementById("depto_originario");
var muni_labora = document.getElementById("muni_donde_labora");
var muni_originario = document.getElementById("muni_originario");
var apellido_casada_originario = document.getElementById(
  "apellido_casada_originario"
);
var tipo_planilla = document.getElementById("tipo_planilla");
var codigo_ocupacion = document.getElementById("codigo_ocupacion");
var condicion_laboral = document.getElementById("condicion_laboral");
var nombre_padre = document.getElementById("nombre_padre");
var edad_padre = document.getElementById("edad_padre");
var ocupacion_padre = document.getElementById("ocupacion_padre");
var nombre_madre = document.getElementById("nombre_madre");
var edad_madre = document.getElementById("edad_madre");
var ocupacion_madre = document.getElementById("ocupacion_madre");
var nombre_conyuge = document.getElementById("conyuge");
var edad_conyuge = document.getElementById("conyuge_edad");
var ocupacion_conyuge = document.getElementById("conyuge_ocupacion");
var horas_laborales = document.getElementById("horas_laborales");
var porcentaje_ventajas = document.getElementById("ventajas_economicas");
var temporal = document.getElementById("tiempo_temporal");
var dias_laborados = document.getElementById("dias_laborados");
var irtra = document.getElementById("irtra");
var intecap = document.getElementById("intecap");
var jubilacion = document.getElementById("jubilacion");
var discapacidad = document.getElementById("discapacidad");
var jornada = document.getElementById("jornada");
var id_permisos = document.getElementById("id_permisos");
var titulos_diplomas = document.getElementById("titulos_diplomas");
var afiliacion_igss = document.getElementById("afiliacion_igss");
var cambio_departamento;
var empresas_intercompany = [];
var listado_chx_intercompany = [];
//-------------------------INPUTS------------------------//

//-------------------------BOTONES------------------------//
var btn_agregar_empleado = document.getElementById("boton_agregar_empleado");
var botones_pestañas = document.getElementsByClassName(
  "btn btn-outline-success btn-icon mb-2 me-4 btn-rounded bs-tooltip"
);
//-------------------------BOTONES------------------------//

$(document).ready(function () {
  cargando();
  cargarEstados();
  cargarEstadosCiviles();
  cargarGeneros();
  cargarBancos();
  cargarTiposPago();
  cargarTiposCuenta();
  cargarMonedas();
  cargarDepartamentos();
  cargarCentrosCosto();
  cargarDimension3();
  cargarDimension4();
  cargarDimension5();
  cargarCondiciones();
  cargarTiposLicencia();
  cargarClasesLicencia();
  activar_inputs();

});

function cargando() {
  Swal.fire({
    title: "Procesando...",
    html: "Esto puede demorar unos momentos, de tardar demasiado recargue la pagina",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });
}

function obtenerListaEstados() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarEstados() {
  try {
    let lista = await obtenerListaEstados();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("estado").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#estado", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Estado...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }

    document.getElementById("estado").addEventListener('change', function(e) {
      var selectedText = this.options[this.selectedIndex] ? this.options[this.selectedIndex].text : "";
      if (this.value == "2" || selectedText === "De Baja") {
          var modal_input = document.getElementById("modal_input_motivo_baja");
          var motivo_baja = document.getElementById("motivo_baja");
          if (modal_input && motivo_baja) {
              modal_input.value = motivo_baja.value;
          }
          $('#modal_motivo_baja').modal('show');
      }
    });
  } catch (error) {
    console.error("Error al cargar estados:", error);
  }
}

function obtenerListaEstadosCiviles() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarEstadosCiviles() {
  try {
    let lista = await obtenerListaEstadosCiviles();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("estado_civil").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#estado_civil", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Estado Civil...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar estados civiles:", error);
  }
}

function obtenerListaGeneros() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarGeneros() {
  try {
    let lista = await obtenerListaGeneros();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("genero").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#genero", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Genero...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar generos:", error);
  }
}

function obtenerListaBancos() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarBancos() {
  try {
    let lista = await obtenerListaBancos();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("banco").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#banco", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Banco...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar bancos:", error);
  }
}


function obtenerListaTiposPago() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarTiposPago() {
  try {
    let lista = await obtenerListaTiposPago();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("pago").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#pago", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Tipo de pago...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar tipos de pago:", error);
  }
}

function obtenerListaTiposCuenta() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarTiposCuenta() {
  try {
    let lista = await obtenerListaTiposCuenta();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("tipo_cuenta").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#tipo_cuenta", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Tipo de cuenta...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar tipos de cuentas:", error);
  }
}

function obtenerListaMonedas() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarMonedas() {
  try {
    let lista = await obtenerListaMonedas();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("moneda").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#moneda", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Moneda...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar monedas:", error);
  }
}

function obtenerListaDepartamentos() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_departamentos",
      },
      success: function (resp) {
        if (resp.includes('No hay datos')) {
          let lista = resp;
          resolve(lista)
        } else {
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
          resolve(lista);
        }
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarDepartamentos() {
  try {
    let lista = await obtenerListaDepartamentos();
    if (lista.includes('No hay datos')) {
      let template = "";
      template += `<option value=""></option>`;
      document.getElementById("departamento_laboral").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#departamento_laboral", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Departamento...",
      });
    } else {
      let template = "";
      lista.forEach((item) => {
        template += `<option value="${item.id}">${item.nombre}</option>`;
      });
      document.getElementById("departamento_laboral").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#departamento_laboral", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Departamento...",
      });
    }

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar departamentos:", error);
  }
}

function obtenerListaCentrosCosto() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_centros_costo",
      },
      success: function (resp) {
        if (resp.includes('No hay datos')) {
          let lista = resp;
          resolve(lista)
        } else {
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
          resolve(lista);
        }
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

function obtenerListaDimension3() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_dimension_3",
      },
      success: function (resp) {
        if (resp.includes('No hay datos')) {
          let lista = resp;
          resolve(lista)
        } else {
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
          resolve(lista);
        }
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

function obtenerListaDimension4() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_dimension_4",
      },
      success: function (resp) {
        if (resp.includes('No hay datos')) {
          let lista = resp;
          resolve(lista)
        } else {
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
          resolve(lista);
        }
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

function obtenerListaDimension5() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "listado_dimension_5",
      },
      success: function (resp) {
        if (resp.includes('No hay datos')) {
          let lista = resp;
          resolve(lista)
        } else {
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
          resolve(lista);
        }
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarCentrosCosto() {
  try {
    let lista = await obtenerListaCentrosCosto();
    if (lista.includes('No hay datos')) {
      let template = "";
      template += `<option value=""></option>`;
      document.getElementById("centro_de_costo").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Área...",
      });
    } else {
      let template = "";
      lista.forEach((item) => {
        template += `<option value="${item.id}">${item.nombre}</option>`;
      });
      document.getElementById("centro_de_costo").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Área...",
      });
    }

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar dimension 2:", error);
  }
}

async function cargarDimension3() {
  try {
    let lista = await obtenerListaDimension3();
    if (lista.includes('No hay datos')) {
      let template = "";
      template += `<option value=""></option>`;
      document.getElementById("dimension_3").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_3", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "División...",
      });
    } else {
      let template = "";
      lista.forEach((item) => {
        template += `<option value="${item.id}">${item.nombre}</option>`;
      });
      document.getElementById("dimension_3").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_3", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "División...",
      });
    }

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar división:", error);
  }
}

async function cargarDimension4() {
  try {
    let lista = await obtenerListaDimension4();
    if (lista.includes('No hay datos')) {
      let template = "";
      template += `<option value=""></option>`;
      document.getElementById("dimension_4").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_4", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Sub División...",
      });
    } else {
      let template = "";
      lista.forEach((item) => {
        template += `<option value="${item.id}">${item.nombre}</option>`;
      });
      document.getElementById("dimension_4").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_4", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Sub División...",
      });
    }

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar sub división:", error);
  }
}

async function cargarDimension5() {
  try {
    let lista = await obtenerListaDimension5();
    if (lista.includes('No hay datos')) {
      let template = "";
      template += `<option value=""></option>`;
      document.getElementById("dimension_5").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_5", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Nivel 5...",
      });
    } else {
      let template = "";
      lista.forEach((item) => {
        template += `<option value="${item.id}">${item.nombre}</option>`;
      });
      document.getElementById("dimension_5").innerHTML = template;

      selectBox = safeInitVanillaSelectBox("#dimension_5", {
        active: false,
        keepInlineStyles: true,
        maxHeight: 678,
        minWidth: 200,
        search: true,
        placeHolder: "Nivel 5...",
      });
    }

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar nivel 5:", error);
  }
}

function listado_empresa_principal() {
  return new Promise((resolve) => {
    try {
      empresas_intercompany = [];
      cambio_departamento = true;
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
              var porcentaje_empresa;
              lista.forEach((empresa) => {
                if (
                  empresa.nombre.includes("PROQUIMA") ||
                  empresa.nombre.includes("UNION HERMANOS")
                ) {
                  porcentaje_empresa = 50;
                } else {
                  porcentaje_empresa = 0;
                }
                empresas_intercompany.push({
                  id_empresa: empresa.id,
                  nombre: empresa.nombre,
                  porcentaje: porcentaje_empresa,
                  principal: false,
                });
              });
              empresas_intercompany.forEach((empresa) => {
                template += `
                              <tr>
                                  <td class="text-center" >${empresa.nombre}</td>
                                  <td class="text-center"><input type="number" class="form-control" id="inp_porcentaje_${empresa.id_empresa}" value='${empresa.porcentaje}' style="width: 50%; margin: 0 auto;" onchange="asignar_porcentaje_empresa(${empresa.id_empresa})"></td>
                                  <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${empresa.id_empresa}" onclick="click_chx(${empresa.id_empresa})"></td>
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
  })
}

function obtenerListaCondiciones() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarCondiciones() {
  try {
    let lista = await obtenerListaCondiciones();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.nombre}</option>`;
    });
    document.getElementById("condicion_laboral").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#condicion_laboral", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Condición...",
    });

    selectBox2 = new vanillaSelectBox("#jornada", {
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Jornada...",
    });

    if (detalle == "true") {
      selectBox.disable();
      selectBox2.disable();
    } else {
      selectBox.enable();
      selectBox2.enable();
    }
  } catch (error) {
    console.error("Error al cargar condiciones laborales:", error);
  }
}

function obtenerListaTiposLicencia() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarTiposLicencia() {
  try {
    let lista = await obtenerListaTiposLicencia();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.tipo}</option>`;
    });
    document.getElementById("tipo_licencia").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#tipo_licencia", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Tipo...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }
  } catch (error) {
    console.error("Error al cargar tipos de licencia:", error);
  }
}

function obtenerListaClasesLicencia() {
  return new Promise((resolve, reject) => {
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
        resolve(lista);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}

async function cargarClasesLicencia() {
  try {
    let lista = await obtenerListaClasesLicencia();
    let template = "";
    lista.forEach((item) => {
      template += `<option value="${item.id}">${item.clase}</option>`;
    });
    document.getElementById("clase_licencia").innerHTML = template;

    selectBox = safeInitVanillaSelectBox("#clase_licencia", {
      active: false,
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Clase...",
    });

    if (detalle == "true") {
      selectBox.disable();
    } else {
      selectBox.enable();
    }

    selectBoxUniversidad = new vanillaSelectBox("#universidad_modal", {
      keepInlineStyles: true,
      maxHeight: 678,
      minWidth: 200,
      search: true,
      placeHolder: "Universidad...",
    });
    if (detalle == "true") {
      selectBoxUniversidad.disable();
    } else {
      selectBoxUniversidad.enable();
    }
  } catch (error) {
    console.error("Error al cargar clases de licencia:", error);
  }
}

function activar_inputs() {
  return new Promise((resolve) => {
    if (detalle == "true") {
      estado_empleado.disabled = true;
      primer_nombre.disabled = true;
      segundo_nombre.disabled = true;
      otros_nombres.disabled = true;
      primer_apellido.disabled = true;
      segundo_apellido.disabled = true;
      direccion.disabled = true;
      estado_civil.disabled = true;
      fecha_nacimiento.disabled = true;
      dpi.disabled = true;
      no_iggs.disabled = true;
      centro_de_costo.disabled = true;
      dimension_3.disabled = true;
      dimension_4.disabled = true;
      dimension_5.disabled = true;
      puesto_empleado.disabled = true;
      fecha_inicio.disabled = true;
      fecha_baja.disabled = true;
      telefono_domiciliar.disabled = true;
      genero.disabled = true;
      no_licencia.disabled = true;
      tipo_licencia.disabled = true;
      clase_licencia.disabled = true;
      horas_extra.disabled = true;
      pago.disabled = true;
      banco.disabled = true;
      no_cuenta.disabled = true;
      tipo_cuenta.disabled = true;
      moneda.disabled = true;
      nombre_conyuge.disabled = true;
      bon_dec_31_2001.disabled = true;
      bon_incentivo.disabled = true;
      horas_extras_dobles.disabled = true;
      horas_simples.disabled = true;
      sueldo_ordinario.disabled = true;
      otros_ingresos.disabled = true;
      total_IGSS.disabled = true;
      irtra.disabled = true;
      intecap.disabled = true;
      vacaciones_planilla.disabled = true;
      bantrab.disabled = true;
      ornato.disabled = true;
      igss_laboral.disabled = true;
      igss_patronal.disabled = true;
      isr.disabled = true;
      otros_egresos.disabled = true;
      prestamo_empresa_planilla.disabled = true;
      bancos_planilla.disabled = true;
      judiciales_planilla.disabled = true;
      seguro_planilla.disabled = true;
      parqueo_planilla.disabled = true;
      primaria.disabled = true;
      grado_primaria.disabled = true;
      secundaria.disabled = true;
      grado_secundaria.disabled = true;
      diversificado.disabled = true;
      universidad.disabled = true;
      nacionalidad.disabled = true;
      region_originario.disabled = true;
      depto_originario.disabled = true;
      muni_originario.disabled = true;
      muni_labora.disabled = true;
      apellido_casada.disabled = true;
      condicion_laboral.disabled = true;
      codigo_ocupacion.disabled = true;
      tipo_planilla.disabled = true;
      horas_laborales.disabled = true;
      porcentaje_ventajas.disabled = true;
      temporal.disabled = true;
      celular_personal.disabled = true;
      telefono_emergencia.disabled = true;
      nombre_emergencia.disabled = true;
      edad.disabled = true;
      emision_dpi.disabled = true;
      edad_conyuge.disabled = true;
      ocupacion_conyuge.disabled = true;
      nombre_padre.disabled = true;
      edad_padre.disabled = true;
      ocupacion_padre.disabled = true;
      nombre_madre.disabled = true;
      edad_madre.disabled = true;
      ocupacion_madre.disabled = true;
      nit.disabled = true;
      departamento_laboral.disabled = true;
      apellido_casada_originario.disabled = true;
      jubilacion.disabled = true;
      discapacidad.disabled = true;
      id_permisos.disabled = true;
      titulos_diplomas.disabled = true;
      afiliacion_igss.disabled = true;
      btn_agregar_empleado.style.display = "none";
      botones_pestañas[0].style.display = "none";
      botones_pestañas[1].style.display = "none";
      botones_pestañas[2].style.display = "none";
      botones_pestañas[3].style.display = "none";
      botones_pestañas[4].style.display = "none";
      botones_pestañas[5].style.display = "none";
      botones_pestañas[6].style.display = "none";
      botones_pestañas[7].style.display = "none";
      resolve("success");
    } else {
      estado_empleado.disabled = false;
      primer_nombre.disabled = false;
      segundo_nombre.disabled = false;
      otros_nombres.disabled = false;
      primer_apellido.disabled = false;
      segundo_apellido.disabled = false;
      direccion.disabled = false;
      estado_civil.disabled = false;
      fecha_nacimiento.disabled = false;
      dpi.disabled = false;
      no_iggs.disabled = false;
      centro_de_costo.disabled = false;
      dimension_3.disabled = false;
      dimension_4.disabled = false;
      dimension_5.disabled = false;
      puesto_empleado.disabled = false;
      fecha_inicio.disabled = false;
      fecha_baja.disabled = false;
      telefono_domiciliar.disabled = false;
      genero.disabled = false;
      no_licencia.disabled = false;
      tipo_licencia.disabled = false;
      clase_licencia.disabled = false;
      horas_extra.disabled = false;
      pago.disabled = false;
      banco.disabled = false;
      no_cuenta.disabled = false;
      tipo_cuenta.disabled = false;
      moneda.disabled = false;
      nombre_conyuge.disabled = false;
      bon_dec_31_2001.disabled = false;
      bon_incentivo.disabled = false;
      horas_extras_dobles.disabled = false;
      horas_simples.disabled = false;
      sueldo_ordinario.disabled = false;
      otros_ingresos.disabled = false;
      vacaciones_planilla.disabled = false;
      bantrab.disabled = false;
      ornato.disabled = false;
      igss_laboral.disabled = true;
      igss_patronal.disabled = true;
      isr.disabled = false;
      total_IGSS.disabled = true;
      irtra.disabled = true;
      intecap.disabled = true;
      otros_egresos.disabled = false;
      prestamo_empresa_planilla.disabled = false;
      bancos_planilla.disabled = false;
      judiciales_planilla.disabled = false;
      seguro_planilla.disabled = false;
      parqueo_planilla.disabled = false;
      primaria.disabled = false;
      grado_primaria.disabled = false;
      secundaria.disabled = false;
      grado_secundaria.disabled = false;
      diversificado.disabled = false;
      universidad.disabled = false;
      nacionalidad.disabled = false;
      region_originario.disabled = false;
      depto_originario.disabled = false;
      muni_originario.disabled = false;
      muni_labora.disabled = false;
      apellido_casada.disabled = false;
      condicion_laboral.disabled = false;
      codigo_ocupacion.disabled = false;
      tipo_planilla.disabled = false;
      horas_laborales.disabled = false;
      porcentaje_ventajas.disabled = false;
      temporal.disabled = false;
      celular_personal.disabled = false;
      telefono_emergencia.disabled = false;
      nombre_emergencia.disabled = false;
      edad.disabled = false;
      emision_dpi.disabled = false;
      edad_conyuge.disabled = false;
      ocupacion_conyuge.disabled = false;
      nombre_padre.disabled = false;
      edad_padre.disabled = false;
      ocupacion_padre.disabled = false;
      nombre_madre.disabled = false;
      edad_madre.disabled = false;
      ocupacion_madre.disabled = false;
      nit.disabled = false;
      departamento_laboral.disabled = false;
      apellido_casada_originario.disabled = false;
      jubilacion.disabled = false;
      discapacidad.disabled = false;
      id_permisos.disabled = false;
      titulos_diplomas.disabled = false;
      afiliacion_igss.disabled = false;
      botones_pestañas[0].style.display = "";
      botones_pestañas[1].style.display = "";
      botones_pestañas[2].style.display = "";
      botones_pestañas[3].style.display = "";
      botones_pestañas[4].style.display = "";
      botones_pestañas[5].style.display = "";
      botones_pestañas[6].style.display = "";
      botones_pestañas[7].style.display = "";
      resolve("success");
    }
  }).then(() => {
    procesarElementosConClaseTitle();
  });
}

async function procesarElementosConClaseTitle() {
  var elementosConClaseTitle = document.getElementsByClassName("title");

  await new Promise(resolve => setTimeout(resolve, 3000));

  combobox = elementosConClaseTitle

  llenar_inputs_empleado();
}

function llenar_inputs_empleado() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: "php/servidor.php",
        type: "GET",
        data: {
          quest: "datos_empleado",
          id_empleado,
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
          primer_nombre.value = lista[0].primer_nombre;
          segundo_nombre.value = lista[0].segundo_nombre;
          otros_nombres.value = lista[0].otro_nombre;
          primer_apellido.value = lista[0].primer_apellido;
          segundo_apellido.value = lista[0].segundo_apellido;
          apellido_casada.value = lista[0].apellido_casada;
          estado_empleado.value = lista[0].estado;
          updateSelectBoxText(estado_empleado);
          estado_civil.value = lista[0].estado_civil;
          updateSelectBoxText(estado_civil);
          genero.value = lista[0].genero;
          updateSelectBoxText(genero);
          telefono_domiciliar.value = lista[0].telefono;
          celular_personal.value = lista[0].telefono_celular;
          telefono_emergencia.value = lista[0].telefono_emergencia;
          nombre_emergencia.value = lista[0].nombre_emergencia;
          direccion.value = lista[0].direccion;
          fecha_nacimiento.value = lista[0].fecha_nacimiento;
          // Calcular edad actual basándose en la fecha de nacimiento
          edad.value = calcularEdadActual(lista[0].fecha_nacimiento);
          tipo_licencia.value = lista[0].id_tipo_licencia;
          updateSelectBoxText(tipo_licencia);
          clase_licencia.value = lista[0].id_clase_licencia;
          updateSelectBoxText(clase_licencia);
          no_licencia.value = lista[0].licencia;
          dpi.value = lista[0].dpi;
          emision_dpi.value = lista[0].emision_dpi;
          if (lista[0].horas_extra != 1) {
            horas_extra.checked = false;
          } else {
            horas_extra.checked = true;
          }
          no_iggs.value = lista[0].no_igss;
          nit.value = lista[0].nit;
          no_cuenta.value = lista[0].no_cuenta;
          if (lista[0].tipo_cuenta != null) {
            tipo_cuenta.value = lista[0].tipo_cuenta;
            updateSelectBoxText(tipo_cuenta);
          }
          banco.value = lista[0].banco;
          updateSelectBoxText(banco);
          pago.value = lista[0].tipo_de_pago;
          updateSelectBoxText(pago);
          moneda.value = lista[0].moneda;
          updateSelectBoxText(moneda);
          fecha_inicio.value = lista[0].fecha_inicio;
          fecha_baja.value = lista[0].fecha_baja;
          if (motivo_baja) motivo_baja.value = lista[0].motivo_baja;
          departamento_laboral.value = lista[0].departamento_laboral;
          updateSelectBoxText(departamento_laboral);
          centro_de_costo.value = lista[0].centro_de_costo;
          dimension_3.value = lista[0].dimension_3;
          dimension_4.value = lista[0].dimension_4;
          dimension_5.value = lista[0].dimension_5;
          puesto_empleado.value = lista[0].puesto;
          updateSelectBoxText(centro_de_costo);
          updateSelectBoxText(dimension_3);
          if (lista[0].dimension_4 != null) {
            updateSelectBoxText(dimension_4);
          }
          if (lista[0].dimension_5 != null) {
            updateSelectBoxText(dimension_5);
          }
          if (lista[0].primaria != 1) {
            primaria.checked = false;
          } else {
            primaria.checked = true;
            grado_primaria.value = lista[0].grado_primaria;
          }
          if (lista[0].secundaria != 1) {
            secundaria.checked = false;
          } else {
            secundaria.checked = true;
            grado_secundaria.value = lista[0].grado_secundaria;
          }
          if (lista[0].diversificado != 1) {
            diversificado.checked = false;
          } else {
            diversificado.checked = true;
          }
          if (lista[0].universidad != 1) {
            universidad.checked = false;
          } else {
            universidad.checked = true;
          }
          bon_dec_31_2001.value = lista[0].bon_dec_37_2001;
          bon_incentivo.value = lista[0].bon_incentivo;
          horas_extras_dobles.value = lista[0].horas_extras_dobles;
          horas_extra.value = lista[0].horas_extra;
          sueldo_ordinario.value = lista[0].sueldo_ordinario;
          otros_ingresos.value = lista[0].otro_ingresos;
          vacaciones_planilla.value = lista[0].vacaciones;
          anticipo_quincenal.value = lista[0].anticipo_quincenal;
          bantrab.value = lista[0].bantrab;
          ornato.value = lista[0].boleto_de_ornato;
          igss_laboral.value = lista[0].igss_laboral;
          igss_patronal.value = lista[0].detalle_igss_patronal;
          irtra.value = lista[0].irtra_intecap;
          intecap.value = lista[0].irtra_intecap;
          total_IGSS.value = (
            parseFloat(lista[0].detalle_igss_patronal) +
            parseFloat(lista[0].irtra_intecap) * 2
          ).toFixed(2);
          isr.value = lista[0].isr;
          otros_egresos.value = lista[0].otro_descuentos;
          prestamo_empresa_planilla.value = lista[0].prestamo_empresa;
          bancos_planilla.value = lista[0].bancos;
          judiciales_planilla.value = lista[0].judiciales;
          seguro_planilla.value = lista[0].seguro;
          parqueo_planilla.value = lista[0].parqueo;
          nacionalidad.value = lista[0].nacionalidad;
          region_originario.value = lista[0].region_originario;
          depto_originario.value = lista[0].departamento_originario;
          muni_labora.value = lista[0].municipio_laboral;
          muni_originario.value = lista[0].municipio_originario;
          apellido_casada_originario.value = lista[0].apellido_casada_originario;
          tipo_planilla.value = lista[0].tipo_plantilla;
          codigo_ocupacion.value = lista[0].codigo_ocupacion;
          condicion_laboral.value = lista[0].condicion_laboral;
          updateSelectBoxText(condicion_laboral);
          nombre_padre.value = lista[0].nombre_padre;
          edad_padre.value = lista[0].edad_padre;
          ocupacion_padre.value = lista[0].ocupacion_padre;
          nombre_madre.value = lista[0].nombre_madre;
          edad_madre.value = lista[0].edad_madre;
          ocupacion_madre.value = lista[0].ocupacion_madre;
          nombre_conyuge.value = lista[0].conyugue;
          edad_conyuge.value = lista[0].edad_conyuge;
          ocupacion_conyuge.value = lista[0].ocupacion_conyuge;
          horas_laborales.value = lista[0].horas_laborales;
          porcentaje_ventajas.value = lista[0].ventas_economicas;
          temporal.value = lista[0].temporal;
          dias_laborados.value = lista[0].dias_laborados;
          if (lista[0].jubilacion != 1) {
            jubilacion.checked = false;
          } else {
            jubilacion.checked = true
          }
          discapacidad.value = lista[0].discapacidad;
          jornada.value = lista[0].jornada;
          updateSelectBoxText(jornada);
          id_permisos.value = lista[0].id_permisos;
          titulos_diplomas.value = lista[0].titulo_diploma;
          afiliacion_igss.value = lista[0].afiliacion;
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve()
    }
  }).then(() => {
    return new Promise((resolve) => {
      try {
        cambio_departamento = false;
        validar_checkbox_primaria();
        validar_checkbox_secundaria();
        validar_chx_diversificado_universidad();
      } catch (error) {
        console.log(error);
      } finally {
        resolve("success");
      }
    }).then(() => {
      return new Promise((resolve) => {
        try {
          listado_estudios();
          listado_cursos();
          listado_puestos();
          listado_eventos();
          listado_records();
          listado_empresas_empleado();
          listado_empresas();
          listado_vehiculos();
          listado_hijos();
          listado_historial();
          listado_historial_empresa();
        } catch (error) {
          console.log(error);
        } finally {
          resolve("success");
        }
      }).then(() => {
        Swal.close();
      });
    })
  })
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

function validar_inputs_estudios() {
  if (carrera.value != "" && descripcion_estudios.value != "") {
    return true;
  } else {
    return false;
  }
}

function listado_estudios() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_estudios",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          if (lista.universidad != 1) {
            template += `
                            <tr>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">Diversificado</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.carrera}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.descripcion}</td>
                            </tr>`;
          } else {
            template += `
                            <tr>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">Universidad</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.carrera}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.descripcion}</td>
                            </tr>`;
          }
        } else {
          if (lista.universidad != 1) {
            template += `
                        <tr>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">Diversificado</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.carrera}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.descripcion}</td>
                            <td>
                                <div class="action-btns">
                                    <a onclick="detalle_estudio(${lista.id}, true)"
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
                                    <a onclick="advertencia_eliminar_estudio(${lista.id})"
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
          } else {
            template += `
                        <tr>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">Universidad</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.carrera}</td>
                            <td onclick = "detalle_estudio(${lista.id}, false)">${lista.descripcion}</td>
                            <td>
                                <div class="action-btns">
                                    <a onclick="detalle_estudio(${lista.id}, true)"
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
                                    <a onclick="advertencia_eliminar_estudio(${lista.id})"
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
          }
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Diversificado/Universidad</th>
                        <th scope="col">Carrera</th>
                        <th scope="col">Descripcion</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Diversificado/Universidad</th>
                        <th scope="col">Carrera</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_estudios").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_estudios").innerHTML = template;
    },
  });
}

function bloquear_inputs_estudio(bloquear) {
  carrera.disabled = bloquear;
  descripcion_estudios.disabled = bloquear;
}

function detalle_estudio(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_estudio",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        combobox = document.getElementsByClassName("title");
        carrera.value = lista[0].carrera;
        id_estudios.value = id;
        descripcion_estudios.value = lista[0].descripcion;
        listado_universidad.value = lista[0].universidad;
        combobox[12].innerHTML =
          listado_universidad.options[listado_universidad.selectedIndex].text;
        if (editar != true) {
          bloquear_inputs_estudio(true);
          document.getElementById("boton_agregar_estudios").hidden = true;
          document.getElementById("boton_editar_estudios").hidden = true;
        } else {
          bloquear_inputs_estudio(false);
          document.getElementById("boton_agregar_estudios").hidden = true;
          document.getElementById("boton_editar_estudios").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#modal_estudios").modal("show");
  });
}

function limpiar_inputs_estudios() {
  carrera.value = "";
  descripcion_estudios.value = "";
  selectBox = safeInitVanillaSelectBox("#universidad_modal", {
    keepInlineStyles: true,
    maxHeight: 678,
    minWidth: 200,
    search: true,
    placeHolder: "Universidad...",
  });
  if (detalle == "true") {
    selectBox.disable();
  } else {
    selectBox.enable();
  }
}

function ocultar_botones_estudios() {
  document.getElementById("boton_agregar_estudios").hidden = false;
  document.getElementById("boton_editar_estudios").hidden = true;
  limpiar_inputs_estudios();
}

function guardar_estudios() {
  cargando();
  if (validar_inputs_estudios()) {
    if (validar_universidad()) {
      $.ajax({
        url: "php/servidor.php",
        type: "POST",
        data: {
          quest: "ingresar_estudio_editar",
          id_empleado,
          carrera: carrera.value,
          descripcion: descripcion_estudios.value,
          universidad: listado_universidad.value,
        },
        success: function (resp) {
          if (resp != "Successfully") {
            Swal.fire({
              icon: "error",
              title: "Error Al Ingresar Educación",
              text: "Ha ocurrido un error al intentar ingresar la educación en la base de datos",
            });
          } else {
            listado_estudios();
            $("#modal_estudios").modal("hide");
            limpiar_inputs_estudios();
            Swal.fire({
              icon: "success",
              title: "Estudios Ingresados",
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 1300,
            });
          }
        },
      });
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

function editar_estudios() {
  if (validar_inputs_estudios()) {
    if (validar_universidad()) {
      $.ajax({
        url: "php/servidor.php",
        type: "POST",
        data: {
          quest: "editar_estudio",
          id: id_estudios.value,
          carrera: carrera.value,
          descripcion: descripcion_estudios.value,
          universidad: listado_universidad.value,
        },
        success: function (resp) {
          if (resp != "Successfully") {
            Swal.fire({
              icon: "error",
              title: "Error Al Editar Educación",
              text: "Ha ocurrido un error al intentar editar la educación en la base de datos",
            });
            console.log(resp);
          } else {
            listado_estudios();
            $("#modal_estudios").modal("hide");
            limpiar_inputs_estudios();
            Swal.fire({
              icon: "success",
              title: "Estudio Editado",
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 1300,
            });
          }
        },
      });
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

function advertencia_eliminar_estudio(id) {
  Swal.fire({
    title: "¿Esta seguro de eliminar el estudio?",
    text: "Esto es irreversible",
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_estudio",
      id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          title: "Error Al Eliminar Estudio",
          html: "Ah ocurrido un error al intentar eliminar el estudio, por favor, prueba de nuevo.",
          icon: "error",
          allowOutsideClick: false,
          showCancelButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Estudio Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_estudios();
      }
    },
  });
}

function listado_cursos() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_cursos",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_curso(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_curso(${lista.id}, false)">${lista.nombre}</td>
                            <td onclick = "detalle_curso(${lista.id}, false)">${lista.lugar}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                        <td onclick = "detalle_curso(${lista.id}, false)">${lista.id}</td>
                        <td onclick = "detalle_curso(${lista.id}, false)">${lista.nombre}</td>
                        <td onclick = "detalle_curso(${lista.id}, false)">${lista.lugar}</td>
                        <td>
                            <div class="action-btns">
                                <a onclick="detalle_curso(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_curso(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Lugar</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Lugar</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_cursos").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_cursos").innerHTML = template;
    },
  });
}

function detalle_curso(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_curso",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        nombre_del_curso.value = lista[0].nombre;
        id_curso.value = id;
        lugar_curso.value = lista[0].lugar;
        if (lista[0].interno != 1) {
          interno.checked = false;
        } else {
          interno.checked = true;
        }
        ano.value = lista[0].ano;
        mes.value = lista[0].mes;
        if (lista[0].diploma != 1) {
          diploma.checked = false;
        } else {
          diploma.checked = true;
        }
        ano_obligacion.value = lista[0].ano_obligacion;
        mes_obligacion.value = lista[0].mes_obligacion;
        if (lista[0].obligacion != 1) {
          obligacion.checked = false;
        } else {
          obligacion.checked = true;
        }
        reembolsar.value = lista[0].reembolsar;
        fecha_capacitacion.value = lista[0].fecha_capacitacion;
        codigo_curso.value = lista[0].codigo_curso;
        nombre_curso.value = lista[0].nombre_curso;
        if (lista[0].funciones != 1) {
          funciones.checked = false;
        } else {
          funciones.checked = true;
        }
        if (lista[0].induccion != 1) {
          induccion_bmps.checked = false;
        } else {
          induccion_bmps.checked = true;
        }
        if (lista[0].general != 1) {
          general.checked = false;
        } else {
          general.checked = true;
        }
        fecha_evaluacion.value = lista[0].fecha_evaluacion;
        nota.value = lista[0].nota;
        if (editar != true) {
          bloquear_inputs_curso(true);
          document.getElementById("boton_agregar_curso").hidden = true;
          document.getElementById("boton_editar_curso").hidden = true;
        } else {
          bloquear_inputs_curso(false);
          document.getElementById("boton_agregar_curso").hidden = true;
          document.getElementById("boton_editar_curso").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#exampleModal").modal("show");
  });
}

function guardar_curso() {
  cargando();
  if (validar_inputs_curso()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_curso_editar",
        nombre: nombre_curso.value,
        lugar: lugar_curso.value,
        interno: interno.checked,
        ano: ano.value,
        mes: mes.value,
        diploma: diploma.checked,
        obligacion: obligacion.checked,
        ano_obligacion: ano_obligacion.value,
        mes_obligacion: mes_obligacion.value,
        reembolsar: reembolsar.value,
        fecha_capacitacion: fecha_capacitacion.value,
        codigo_curso: codigo_curso.value,
        nombre_curso: nombre_curso.value,
        induccion: induccion_bmps.checked,
        general: general.checked,
        funciones: funciones.checked,
        fecha_evaluacion: fecha_evaluacion.value,
        nota: nota.value,
        id_empleado,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Guardar Curso",
            text: "Ah ocurrido un error al intentar guardar el curso, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Curso Guardado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_cursos();
          $("#exampleModal").modal("hide");
          limpiar_inputs_curso();
        }
      },
    });
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

function ocultar_botones_curso() {
  document.getElementById("boton_agregar_curso").hidden = false;
  document.getElementById("boton_editar_curso").hidden = true;
  limpiar_inputs_curso();
}

function bloquear_inputs_curso(bloquear) {
  nombre_del_curso.disabled = bloquear;
  lugar_curso.disabled = bloquear;
  interno.disabled = bloquear;
  ano.disabled = bloquear;
  mes.disabled = bloquear;
  diploma.disabled = bloquear;
  ano_obligacion.disabled = bloquear;
  mes_obligacion.disabled = bloquear;
  obligacion.disabled = bloquear;
  reembolsar.disabled = bloquear;
  fecha_capacitacion.disabled = bloquear;
  codigo_curso.disabled = bloquear;
  nombre_curso.disabled = bloquear;
  funciones.disabled = bloquear;
  induccion_bmps.disabled = bloquear;
  general.disabled = bloquear;
  fecha_evaluacion.disabled = bloquear;
  nota.disabled = bloquear;
}

function editar_curso() {
  cargando();
  if (validar_inputs_curso()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_curso",
        id_curso: id_curso.value,
        nombre: nombre_curso.value,
        lugar: lugar_curso.value,
        interno: interno.checked,
        ano: ano.value,
        mes: mes.value,
        diploma: diploma.checked,
        obligacion: obligacion.checked,
        ano_obligacion: ano_obligacion.value,
        mes_obligacion: mes_obligacion.value,
        reembolsar: reembolsar.value,
        fecha_capacitacion: fecha_capacitacion.value,
        codigo_curso: codigo_curso.value,
        nombre_curso: nombre_curso.value,
        induccion: induccion_bmps.checked,
        general: general.checked,
        funciones: funciones.checked,
        fecha_evaluacion: fecha_evaluacion.value,
        nota: nota.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Curso",
            text: "Ah ocurrido un error al intentar editar el curso, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Curso Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_cursos();
          $("#exampleModal").modal("hide");
          limpiar_inputs_curso();
        }
      },
    });
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
    text: "Esto es irreversible",
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_curso",
      id_curso: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Curso",
          text: "Ah ocurrido un error al intentar eliminar el curso, por favor, intentalo de nuevo",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Curso Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_cursos();
      }
    },
  });
}

function validar_inputs_curso() {
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

function limpiar_inputs_curso() {
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

function listado_puestos() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_puestos",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_puesto(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_puesto(${lista.id}, false)">${lista.puesto}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                        <td onclick = "detalle_puesto(${lista.id}, false)">${lista.id}</td>
                        <td onclick = "detalle_puesto(${lista.id}, false)">${lista.puesto}</td>
                        <td>
                            <div class="action-btns">
                                <a onclick="detalle_puesto(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_puesto(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Puesto</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Puesto</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_puestos").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_puestos").innerHTML = template;
    },
  });
}

function detalle_puesto(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_puesto",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        fecha_puesto.value = lista[0].fecha;
        id_puestos.value = lista[0].id;
        codigo_departamento_puesto.value = lista[0].cod_depto;
        departamento_puesto.value = lista[0].departamento;
        codigo_puesto.value = lista[0].cod_puesto;
        puesto.value = lista[0].puesto;
        motivo_puesto.value = lista[0].motivo;
        if (editar != true) {
          bloquear_inputs_puesto(true);
          document.getElementById("boton_agregar_puesto").hidden = true;
          document.getElementById("boton_editar_puesto").hidden = true;
        } else {
          bloquear_inputs_puesto(false);
          document.getElementById("boton_agregar_puesto").hidden = true;
          document.getElementById("boton_editar_puesto").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#puesto_modal").modal("show");
  });
}

function editar_puesto() {
  cargando();
  if (validar_inputs_puestos()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_puesto",
        id_puesto: id_puestos.value,
        fecha: fecha_puesto.value,
        cod_depto: codigo_departamento_puesto.value,
        departamento: departamento_puesto.value,
        cod_puesto: codigo_puesto.value,
        puesto: puesto.value,
        motivo: motivo_puesto.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Puesto",
            text: "Ah ocurrido un error al intentar editar el puesto, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Puesto Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_puestos();
          $("#puesto_modal").modal("hide");
          limpiar_inputs_puestos();
        }
      },
    });
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_puesto",
      id_puesto: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Puesto",
          text: "Ah ocurrido un error al intentar eliminar el puesto, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Puesto Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_puestos();
      }
    },
  });
}

function bloquear_inputs_puesto(bloquear) {
  fecha_puesto.disabled = bloquear;
  id_puestos.disabled = bloquear;
  codigo_departamento_puesto.disabled = bloquear;
  departamento_puesto.disabled = bloquear;
  codigo_puesto.disabled = bloquear;
  puesto.disabled = bloquear;
  motivo_puesto.disabled = bloquear;
}

function limpiar_inputs_puestos() {
  fecha_puesto.value = "";
  codigo_departamento_puesto.value = "";
  departamento_puesto.value = "";
  codigo_puesto.value = "";
  puesto.value = "";
  motivo_puesto.value = "";
}

function guardar_puesto() {
  cargando();
  if (validar_inputs_puestos()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_puesto_editar",
        id_empleado,
        fecha: fecha_puesto.value,
        cod_depto: codigo_departamento_puesto.value,
        departamento: departamento_puesto.value,
        cod_puesto: codigo_puesto.value,
        puesto: puesto.value,
        motivo: motivo_puesto.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Guardar Puesto",
            text: "Ah ocurrido un error al intentar guardar el puesto, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Puesto Guardado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_puestos();
          $("#puesto_modal").modal("hide");
          limpiar_inputs_puestos();
        }
      },
    });
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

function ocultar_botones_puestos() {
  document.getElementById("boton_agregar_puesto").hidden = false;
  document.getElementById("boton_editar_puesto").hidden = true;
  limpiar_inputs_puestos();
}

function validar_inputs_puestos() {
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

function listado_eventos() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_eventos",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.tipo}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.numero}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.estado}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.tipo}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.numero}</td>
                            <td onclick = "detalle_evento(${lista.id}, false)">${lista.estado}</td>
                            <td>
                            <div class="action-btns">
                                <a onclick="detalle_evento(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_evento(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Número</th>
                        <th scope="col">Estado</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Número</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_eventos").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_eventos").innerHTML = template;
    },
  });
}

function detalle_evento(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_evento",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        tipo_evento.value = lista[0].tipo;
        id_evento.value = lista[0].id;
        numero_evento.value = lista[0].numero;
        fecha_inicio_evento.value = lista[0].fecha_inicio;
        fecha_final_evento.value = lista[0].fecha_final;
        ano_evento.value = lista[0].año;
        mes_evento.value = lista[0].mes;
        dia_evento.value = lista[0].dia;
        hora_evento.value = lista[0].hora;
        minuto_evento.value = lista[0].minuto;
        procesar_evento.value = lista[0].procesar;
        planilla_evento.value = lista[0].planilla;
        estado_evento.value = lista[0].estado;
        observaciones_evento.value = lista[0].observaciones;
        if (editar != true) {
          bloquear_inputs_evento(true);
          document.getElementById("boton_agregar_evento").hidden = true;
          document.getElementById("boton_editar_evento").hidden = true;
        } else {
          bloquear_inputs_evento(false);
          document.getElementById("boton_agregar_evento").hidden = true;
          document.getElementById("boton_editar_evento").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#evento_modal").modal("show");
  });
}

function editar_evento() {
  cargando();
  if (validar_inputs_evento()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_evento",
        id_evento: id_evento.value,
        tipo: tipo_evento.value,
        numero: numero_evento.value,
        fecha_inicio: fecha_inicio_evento.value,
        fecha_final: fecha_final_evento.value,
        año: ano_evento.value,
        mes: mes_evento.value,
        dia: dia_evento.value,
        hora: hora_evento.value,
        minuto: minuto_evento.value,
        procesar: procesar_evento.value,
        planilla: planilla_evento.value,
        estado: estado_evento.value,
        observaciones: observaciones_evento.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Evento",
            text: "Ah ocurrido un error al intentar ingresar el evento, por favor, intenta de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Evento Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_eventos();
          $("#evento_modal").modal("hide");
          limpiar_inputs_evento();
        }
      },
    });
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
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_evento",
      id_evento: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Evento",
          text: "Ah ocurrido un error al intentar eliminar el evento, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Evento Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_eventos();
      }
    },
  });
}

function bloquear_inputs_evento(bloquear) {
  tipo_evento.disabled = bloquear;
  id_evento.disabled = bloquear;
  numero_evento.disabled = bloquear;
  fecha_inicio_evento.disabled = bloquear;
  fecha_final_evento.disabled = bloquear;
  ano_evento.disabled = bloquear;
  mes_evento.disabled = bloquear;
  dia_evento.disabled = bloquear;
  hora_evento.disabled = bloquear;
  minuto_evento.disabled = bloquear;
  procesar_evento.disabled = bloquear;
  planilla_evento.disabled = bloquear;
  estado_evento.disabled = bloquear;
  observaciones_evento.disabled = bloquear;
}

function guardar_evento() {
  cargando();
  if (validar_inputs_evento()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_evento_editar",
        id_empleado,
        tipo: tipo_evento.value,
        numero: numero_evento.value,
        fecha_inicio: fecha_inicio_evento.value,
        fecha_final: fecha_final_evento.value,
        año: ano_evento.value,
        mes: mes_evento.value,
        dia: dia_evento.value,
        hora: hora_evento.value,
        minuto: minuto_evento.value,
        procesar: procesar_evento.value,
        planilla: planilla_evento.value,
        estado: estado_evento.value,
        observaciones: observaciones_evento.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Evento",
            text: "Ah ocurrido un error al intentar ingresar el evento, por favor, intenta de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Evento Ingresado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_eventos();
          $("#evento_modal").modal("hide");
          limpiar_inputs_evento();
        }
      },
    });
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

function ocultar_botones_evento() {
  document.getElementById("boton_agregar_evento").hidden = false;
  document.getElementById("boton_editar_evento").hidden = true;
  limpiar_inputs_evento();
}

function validar_inputs_evento() {
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

function limpiar_inputs_evento() {
  tipo_evento.value = "";
  id_evento.value = "";
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

function listado_records() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_records",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.descripcion}</td>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.tipo}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.descripcion}</td>
                            <td onclick = "detalle_record(${lista.id}, false)">${lista.tipo}</td>
                            <td>
                            <div class="action-btns">
                                <a onclick="detalle_record(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_record(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Tipo</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_records").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_records").innerHTML = template;
    },
  });
}

function listado_empresas_empleado() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_empresas_empleado",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
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
      lista.forEach((lista) => {
        empresas_intercompany.push({
          id: lista.id,
          nombre: lista.empresa,
          porcentaje: lista.porcentaje,
          principal: lista.principal,
          id_empresa: lista.id_empresa,
        });
        if (detalle == "true") {
          template += `
          <tr>
          <td class="text-center">${lista.empresa}</td>
          <td class="text-center"><input type="number" class="form-control" value='${lista.porcentaje}' id="inp_porcentaje_${lista.id_empresa}" style="width: 50%; margin: 0 auto;" onchange="asignar_porcentaje_empresa(${lista.id_empresa})" disabled></td>`;
          if (lista.principal == 1) {
            template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${lista.id_empresa}" onclick="click_chx(${lista.id_empresa})" checked disabled></td>
            </tr>`;
          } else {
            template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${lista.id_empresa}" onclick="click_chx(${lista.id_empresa})" disabled></td>
            </tr>`;
          }
        } else {
          template += `
          <tr>
          <td class="text-center">${lista.empresa}</td>
          <td class="text-center"><input type="number" class="form-control" value='${lista.porcentaje}' id="inp_porcentaje_${lista.id_empresa}" style="width: 50%; margin: 0 auto;" onchange="asignar_porcentaje_empresa(${lista.id_empresa})"></td>`;
          if (lista.principal == 1) {
            template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${lista.id_empresa}" onclick="click_chx(${lista.id_empresa})" checked></td>
            </tr>`;
          } else {
            template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" id="chx_principal_${lista.id_empresa}" onclick="click_chx(${lista.id_empresa})"></td>
            </tr>`;
          }
        }
      });
      document.getElementById("listado_empresas").innerHTML = template;
    },
  });
}

function asignar_porcentaje_empresa(id_empresa) {
  var index_empresa = empresas_intercompany.findIndex(
    (empresa) => (empresa.id_empresa == id_empresa || empresa.id == id_empresa)
  );
  if (index_empresa !== -1) {
    var input_porc = document.getElementById("inp_porcentaje_" + id_empresa);
    empresas_intercompany[index_empresa].porcentaje = input_porc.value;
  }
}

function asignar_empresa_principal(id_empresa) {
  var index_empresa = empresas_intercompany.findIndex(
    (empresa) => (empresa.id_empresa == id_empresa || empresa.id == id_empresa)
  );
  if (index_empresa !== -1) {
    var chx_principal = document.getElementById("chx_principal_" + id_empresa);
    empresas_intercompany[index_empresa].principal = chx_principal.checked;
  }
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

function validar_intercompany() {
  var cmb = document.getElementsByClassName("title");
  if (
    cmb[10].innerText != "Departamento..." &&
    cmb[11].innerText != "Área..." &&
    cmb[12].innerText != "División..."
  ) {
    return true;
  } else {
    return false;
  }
}

function validar_porcentaje_intercompany() {
  var cantidades_porcentajes = [];
  empresas_intercompany.forEach((empresa) => {
    var empresa_id = empresa.id_empresa || empresa.id;
    var input = document.getElementById("inp_porcentaje_" + empresa_id);
    if (input && input.value) {
      cantidades_porcentajes.push(parseInt(input.value));
    }
  });
  var total_cantidades = 0;
  cantidades_porcentajes.forEach((cantidad) => {
    total_cantidades = total_cantidades + cantidad;
  });
  if (total_cantidades != 100) {
    console.log("Total porcentajes:", total_cantidades);
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

function modificar_intercompany() {
  return new Promise((resolve) => {
    console.log(cambio_departamento);
    try {
      if (cambio_departamento == true) {
        return new Promise((resolve1) => {
          try {
            inactivar_empresa_empleado();
          } catch (error) {
            console.log(error);
          } finally {
            resolve1("success");
          }
        }).then(() => {
          ingresar_nueva_empresa_empleado();
        });
      } else {
        editar_empresa_empleado();
      }
    } catch (error) {
      console.log(error);
    } finally {
      resolve("success");
    }
  }).then(() => {
    ingresar_usuario_historial();
  });
}

function ingresar_usuario_historial() {
  return new Promise((resolve) => {
    try {
      $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
          quest: 'id_historial_empleado',
        },
        success: function (res) {
          if (res.includes('Query Falló')) {
            Swal.fire({
              title: 'Error',
              html: 'Ha ocurrido un error al obtener los datos del historial, por favor, comunicate con sistemas.',
              icon: 'error',
              allowOutsideClick: false,
              showConfirmButton: true,
            });
            console.log(res);
          } else {
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
            var listado_id_historial = [];
            lista.forEach((elemento) => {
              listado_id_historial.push(elemento.id);
            })
            var lista_parseada = JSON.stringify(listado_id_historial);
            var lista_modificada = lista_parseada.replace(/["\[\]]/g, '');
            $.ajax({
              url: 'php/servidor.php',
              type: 'POST',
              data: {
                quest: 'actualizar_historial_empleado',
                id_usuario: id_empleado,
                listado_id: lista_modificada
              },
              success: function (res) {
                if (res.includes('Query Falló')) {
                  Swal.fire({
                    title: 'Error',
                    html: 'Ha ocurrido un error al actualizar los datos del historial, por favor, comunicate con números.',
                    icon: 'error',
                    allowOutsideClick: false,
                    showConfirmButton: true,
                  });
                  console.log(res);
                } else {
                  console.log(res);
                }
              }
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      resolve("success");
    }

  }).then(() => {
    Swal.fire({
      title: "Empleado Editado",
      icon: "success",
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.href = "./empleados.html";
    });
  })
}

function inactivar_empresa_empleado() {
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "inactivar_empresa_empleado_db",
      id_empleado: id_empleado,
    },
    success: function (resp) {
      if (resp.includes("Successfully")) {
        console.log("Empresa Empleado Inactivado");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Al Inactivar Las Empresas Del Empleado",
          text: "Ha ocurrido un error al intentar inactivar las empresas del empleado en la base de datos, por favor, comunicate con sistemas",
        });
        console.log(resp);
      }
    },
  });
}

function ingresar_nueva_empresa_empleado() {
  empresas_intercompany.forEach((empresa) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_empresa_empleado_db_editar",
        porcentaje: empresa.porcentaje,
        principal: empresa.principal,
        id_empresa: empresa.id_empresa,
        id_empleado: id_empleado,
      },
      success: function (resp) {
        if (resp.includes("Successfully")) {
          console.log("Empresa Empleado Ingresado");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Las Empresas Del Empleado",
            text: "Ha ocurrido un error al intentar ingresar las empresas del empleado en la base de datos, por favor, comunicate con sistemas",
          });
          console.log(resp);
        }
      },
    });
  });
}

function editar_empresa_empleado() {
  empresas_intercompany.forEach((empresa) => {
    // Si id == 0 significa que es una empresa nueva para este empleado
    if (empresa.id == 0 || empresa.id == null) {
      // Solo insertar si tiene porcentaje > 0
      if (parseFloat(empresa.porcentaje) > 0) {
        $.ajax({
          url: "php/servidor.php",
          type: "POST",
          data: {
            quest: "ingresar_empresa_empleado_db_editar",
            porcentaje: empresa.porcentaje,
            principal: empresa.principal,
            id_empresa: empresa.id_empresa,
            id_empleado: id_empleado,
          },
          success: function (resp) {
            if (resp.includes("Successfully")) {
              console.log("Nueva Empresa Empleado Ingresada");
            } else {
              Swal.fire({
                icon: "error",
                title: "Error Al Ingresar Las Empresas Del Empleado",
                text: "Ha ocurrido un error al intentar ingresar las empresas del empleado en la base de datos, por favor, comunicate con sistemas",
              });
              console.log(resp);
            }
          },
        });
      }
    } else {
      // Empresa existente, actualizar
      $.ajax({
        url: "php/servidor.php",
        type: "POST",
        data: {
          quest: "editar_empresa_empleado_db",
          porcentaje: empresa.porcentaje,
          principal: empresa.principal,
          id_empresa: empresa.id_empresa,
          id_empleado: id_empleado,
          id: empresa.id,
        },
        success: function (resp) {
          if (resp.includes("Successfully")) {
            console.log("Empresa Empleado Editado");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error Al Editar Las Empresas Del Empleado",
              text: "Ha ocurrido un error al intentar editar las empresas del empleado en la base de datos, por favor, comunicate con sistemas",
            });
            console.log(resp);
          }
        },
      });
    }
  });
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

function guardar_record() {
  cargando();
  if (validar_inputs_record()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_record_editar",
        id_empleado,
        fecha: fecha_record.value,
        descripcion: descripcion_record.value,
        tipo: tipo_record.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Guardar Record",
            text: "Ah ocurrido un error al intentar guardar el record, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Record Ingresado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_records();
          $("#record_modal").modal("hide");
          limpiar_inputs_record();
        }
      },
    });
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

function ocultar_botones_record() {
  document.getElementById("boton_agregar_record").hidden = false;
  document.getElementById("boton_editar_record").hidden = true;
  limpiar_inputs_record();
}

function validar_inputs_record() {
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

function detalle_record(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_record",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        fecha_record.value = lista[0].fecha;
        id_record.value = lista[0].id;
        descripcion_record.value = lista[0].descripcion;
        tipo_record.value = lista[0].tipo;
        if (editar != true) {
          bloquear_inputs_record(true);
          document.getElementById("boton_agregar_record").hidden = true;
          document.getElementById("boton_editar_record").hidden = true;
        } else {
          bloquear_inputs_record(false);
          document.getElementById("boton_agregar_record").hidden = true;
          document.getElementById("boton_editar_record").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#record_modal").modal("show");
  });
}

function editar_record() {
  cargando();
  if (validar_inputs_record()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_record",
        id_record: id_record.value,
        fecha: fecha_record.value,
        descripcion: descripcion_record.value,
        tipo: tipo_record.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Record",
            text: "Ah ocurrido un error al intentar editar el record, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Record Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_records();
          $("#record_modal").modal("hide");
          limpiar_inputs_record();
        }
      },
    });
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_record",
      id_record: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Record",
          text: "Ah ocurrido un error al intentar eliminar el record, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Record Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_records();
      }
    },
  });
}

function bloquear_inputs_record(bloquear) {
  fecha_record.disabled = bloquear;
  id_record.disabled = bloquear;
  descripcion_record.disabled = bloquear;
  tipo_record.disabled = bloquear;
}

function limpiar_inputs_record() {
  fecha_record.value = "";
  id_record.value = "";
  descripcion_record.value = "";
  tipo_record.value = "";
}

function listado_empresas() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_empresas_anteriores",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_empresa(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_empresa(${lista.id}, false)">${lista.nombre}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                            <td onclick = "detalle_empresa(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_empresa(${lista.id}, false)">${lista.nombre}</td>
                            <td>
                            <div class="action-btns">
                                <a onclick="detalle_empresa(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_empresa(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_empresas").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_empresas").innerHTML = template;
    },
  });
}

function listado_historial() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_cambios_empleado",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
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
      lista.forEach((lista) => {
        template += `
                    <tr class="text-center">
                        <td>${lista.id_cambio}</td>
                        <td>${lista.campo_modificado}</td>
                        <td>${lista.informacion_anterior}</td>
                        <td>${lista.nueva_informacion}</td>
                        <td>${lista.fecha_cambio}</td>
                        <td>${lista.hora_cambio}</td>
                        <td>${lista.responsable}</td>
                    </tr>`;
      });
      document.getElementById("listado_historial").innerHTML = template;
    },
  });
}

function listado_historial_empresa() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_historial_empresa",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
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
      lista.forEach((lista) => {
        template += `
          <tr>
          <td class="text-center">${lista.nombre_comercial}</td>
          <td class="text-center"><input type="number" class="form-control" value='${lista.porcentaje}' style="width: 50%; margin: 0 auto;" disabled></td>
          <td class="text-center">${lista.fecha}</td>`;
        if (lista.principal == 1) {
          template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" checked disabled></td>
            </tr>`;
        } else {
          template += `
            <td class="text-center"><input type="checkbox" class="form-check-input" disabled></td>
            </tr>`;
        }
      });
      document.getElementById("listado_historial_empresas").innerHTML = template;
    },
  });
}

function guardar_empresa() {
  cargando();
  if (validar_inputs_empresa()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_empresa_anterior_editar",
        id_empleado,
        nombre: nombre_empresa.value,
        direccion: direccion_empresarial.value,
        motivo: descripcion_empresa.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Empresa",
            text: "Ah ocurrido un error al intentar ingresar la empresa, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Empresa Ingresada",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_empresas();
          $("#empresa_modal").modal("hide");
          limpiar_inputs_empresa();
        }
      },
    });
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

function validar_inputs_empresa() {
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

function detalle_empresa(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_empresa_anterior",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        nombre_empresa.value = lista[0].nombre;
        id_empresa.value = lista[0].id;
        direccion_empresarial.value = lista[0].direccion;
        descripcion_empresa.value = lista[0].motivo;
        if (editar != true) {
          bloquear_inputs_empresa(true);
          document.getElementById("boton_agregar_empresa").hidden = true;
          document.getElementById("boton_editar_empresa").hidden = true;
        } else {
          bloquear_inputs_empresa(false);
          document.getElementById("boton_agregar_empresa").hidden = true;
          document.getElementById("boton_editar_empresa").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#empresa_modal").modal("show");
  });
}

function editar_empresa() {
  cargando();
  if (validar_inputs_empresa()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_empresa_anterior",
        id_empresa: id_empresa.value,
        nombre: nombre_empresa.value,
        direccion: direccion_empresarial.value,
        motivo: descripcion_empresa.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Empresa",
            text: "Ah ocurrido un error al intentar editar la empresa, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Empresa Editada",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_empresas();
          $("#empresa_modal").modal("hide");
          limpiar_inputs_empresa();
        }
      },
    });
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_empresa_anterior",
      id_empresa: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Empresa",
          text: "Ah ocurrido un error al intentar eliminar la empresa, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Empresa Eliminada",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_empresas();
      }
    },
  });
}

function bloquear_inputs_empresa(bloquear) {
  nombre_empresa.disabled = bloquear;
  id_empresa.disabled = bloquear;
  direccion_empresarial.disabled = bloquear;
  descripcion_empresa.disabled = bloquear;
}

function ocultar_botones_empresa() {
  document.getElementById("boton_agregar_empresa").hidden = false;
  document.getElementById("boton_editar_empresa").hidden = true;
  limpiar_inputs_empresa();
}

function limpiar_inputs_empresa() {
  nombre_empresa.value = "";
  id_empresa.value = "";
  direccion_empresarial.value = "";
  descripcion_empresa.value = "";
}

function listado_vehiculos() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_vehiculos",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.marca}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.modelo}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.placa}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.id}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.marca}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.modelo}</td>
                            <td onclick = "detalle_vehiculo(${lista.id}, false)">${lista.placa}</td>
                            <td>
                            <div class="action-btns">
                                <a onclick="detalle_vehiculo(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_vehiculo(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Placa</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Placa</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_vehiculos").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_vehiculos").innerHTML = template;
    },
  });
}

function detalle_vehiculo(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_vehiculo",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        marca_vehiculo.value = lista[0].marca;
        id_vehiculo.value = lista[0].id;
        modelo_vehiculo.value = lista[0].modelo;
        placa_vehiculo.value = lista[0].placa;
        if (editar != true) {
          bloquear_inputs_vehiculo(true);
          document.getElementById("boton_agregar_vehiculo").hidden = true;
          document.getElementById("boton_editar_vehiculo").hidden = true;
        } else {
          bloquear_inputs_vehiculo(false);
          document.getElementById("boton_agregar_vehiculo").hidden = true;
          document.getElementById("boton_editar_vehiculo").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#vehiculo_modal").modal("show");
  });
}

function editar_vehiculo() {
  cargando();
  if (validar_inputs_vehiculo()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_vehiculo",
        id_vehiculo: id_vehiculo.value,
        marca: marca_vehiculo.value,
        modelo: modelo_vehiculo.value,
        placa: placa_vehiculo.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Vehiculo",
            text: "Ah ocurrido un error al intentar editar el vehiculo, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Vehiculo Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_vehiculos();
          $("#vehiculo_modal").modal("hide");
          limpiar_inputs_vehiculo();
        }
      },
    });
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_vehiculo",
      id_vehiculo: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Vehiculo",
          text: "Ah ocurrido un error al intentar eliminar el vehiculo, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Vehiculo Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_vehiculos();
      }
    },
  });
}

function bloquear_inputs_vehiculo(bloquear) {
  marca_vehiculo.disabled = bloquear;
  id_vehiculo.disabled = bloquear;
  modelo_vehiculo.disabled = bloquear;
  placa_vehiculo.disabled = bloquear;
}

function ocultar_botones_vehiculo() {
  document.getElementById("boton_agregar_vehiculo").hidden = false;
  document.getElementById("boton_editar_vehiculo").hidden = true;
  limpiar_inputs_vehiculo();
}

function guardar_vehiculo() {
  cargando();
  if (validar_inputs_vehiculo()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_vehiculo_editar",
        id_empleado,
        marca: marca_vehiculo.value,
        modelo: modelo_vehiculo.value,
        placa: placa_vehiculo.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Vehiculo",
            text: "Ah ocurrido un error al intentar ingresar el vehiculo, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Vehiculo Ingresado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_vehiculos();
          $("#vehiculo_modal").modal("hide");
          limpiar_inputs_vehiculo();
        }
      },
    });
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

function validar_inputs_vehiculo() {
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

function limpiar_inputs_vehiculo() {
  id_vehiculo.value = "";
  marca_vehiculo.value = "";
  modelo_vehiculo.value = "";
  placa_vehiculo.value = "";
}

function listado_hijos() {
  $.ajax({
    url: "php/servidor.php",
    type: "GET",
    data: {
      quest: "listado_hijos",
      id_empleado,
    },
    success: function (resp) {
      let template = "";
      let template_encabezado = "";
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
      lista.forEach((lista) => {
        if (detalle == "true") {
          template += `
                            <tr>
                            <td onclick = "detalle_hijo(${lista.id}, false)">${lista.nombre}</td>
                            <td onclick = "detalle_hijo(${lista.id}, false)">${lista.edad}</td>
                            </tr>`;
        } else {
          template += `
                    <tr>
                            <td onclick = "detalle_hijo(${lista.id}, false)">${lista.nombre}</td>
                            <td onclick = "detalle_hijo(${lista.id}, false)">${lista.edad}</td>
                            <td>
                            <div class="action-btns">
                                <a onclick="detalle_hijo(${lista.id}, true)"
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
                                <a onclick="advertencia_eliminar_hijo(${lista.id})"
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
        }
      });
      if (detalle == "true") {
        template_encabezado += `
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Edad</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      } else {
        template_encabezado += `
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Edad</th>
                        <th scope="col">Opciones</th>
                    </tr>
                    <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
      }
      document.getElementById("encabezado_tabla_hijos").innerHTML =
        template_encabezado;
      document.getElementById("cuerpo_tabla_hijos").innerHTML = template;
    },
  });
}

function guardar_hijo() {
  cargando();
  if (validar_inputs_hijo()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "ingresar_hijo_editar",
        id_empleado,
        nombre: nombre_hijo.value,
        edad: edad_hijo.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar Hijo",
            text: "Ah ocurrido un error al intentar ingresar el hijo, por favor, intentalo de nuevo.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Hijo Ingresado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_hijos();
          $("#familia_modal").modal("hide");
          limpiar_inputs_hijo();
        }
      },
    });
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

function validar_inputs_hijo() {
  if (nombre_hijo.value != "" && edad_hijo.value != "") {
    return true;
  } else {
    return false;
  }
}

function ocultar_botones_hijo() {
  document.getElementById("boton_agregar_hijo").hidden = false;
  document.getElementById("boton_editar_hijo").hidden = true;
  limpiar_inputs_hijo();
}

function detalle_hijo(id, editar) {
  return new Promise((resolve) => {
    $.ajax({
      url: "php/servidor.php",
      type: "GET",
      data: {
        quest: "detalle_hijo",
        id,
      },
      success: function (resp) {
        let lista;

        if (typeof resp === 'string') {

            lista = JSON.parse(resp);

        } else {

            lista = resp; // jQuery ya parseó el JSON

        }
        nombre_hijo.value = lista[0].nombre;
        id_hijo.value = lista[0].id;
        edad_hijo.value = lista[0].edad;
        if (editar != true) {
          bloquear_inputs_hijo(true);
          document.getElementById("boton_agregar_hijo").hidden = true;
          document.getElementById("boton_editar_hijo").hidden = true;
        } else {
          bloquear_inputs_hijo(false);
          document.getElementById("boton_agregar_hijo").hidden = true;
          document.getElementById("boton_editar_hijo").hidden = false;
        }
        resolve("success");
      },
    });
  }).then(() => {
    $("#familia_modal").modal("show");
  });
}

function editar_hijo() {
  cargando();
  if (validar_inputs_hijo()) {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      data: {
        quest: "editar_hijo",
        id_hijo: id_hijo.value,
        nombre: nombre_hijo.value,
        edad: edad_hijo.value,
      },
      success: function (resp) {
        if (resp != "Successfully") {
          Swal.fire({
            icon: "error",
            title: "Error Al Editar Hijo",
            text: "Ah ocurrido un error al intentar editar el hijo, por favor, intentalo de nuevo.",
          });
          console.log(resp);
        } else {
          Swal.fire({
            icon: "success",
            title: "Hijo Editado",
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1300,
          });
          listado_hijos();
          $("#familia_modal").modal("hide");
          limpiar_inputs_hijo();
        }
      },
    });
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
  cargando();
  $.ajax({
    url: "php/servidor.php",
    type: "POST",
    data: {
      quest: "eliminar_hijo",
      id_hijo: id,
    },
    success: function (resp) {
      if (resp != "Successfully") {
        Swal.fire({
          icon: "error",
          title: "Error Al Eliminar Hijo",
          text: "Ah ocurrido un error al intentar eliminar el hijo, por favor, intentalo de nuevo.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Hijo Eliminado",
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1300,
        });
        listado_hijos();
      }
    },
  });
}

function bloquear_inputs_hijo(bloquear) {
  nombre_hijo.disabled = bloquear;
  id_hijo.disabled = bloquear;
  edad_hijo.disabled = bloquear;
}

function limpiar_inputs_hijo() {
  id_hijo.value = "";
  nombre_hijo.value = "";
  edad_hijo.value = "";
}

// Función que devuelve los campos obligatorios faltantes
function obtenerCamposFaltantes() {
  let camposFaltantes = [];
  
  // Campos de texto básicos
  if (primer_nombre.value == "") camposFaltantes.push("Primer Nombre");
  if (primer_apellido.value == "") camposFaltantes.push("Primer Apellido");
  if (direccion.value == "") camposFaltantes.push("Dirección");
  if (puesto_empleado.value == "") camposFaltantes.push("Puesto");
  if (fecha_nacimiento.value == "") camposFaltantes.push("Fecha de Nacimiento");
  if (fecha_inicio.value == "") camposFaltantes.push("Fecha de Inicio");
  if (id_permisos.value == "" || id_permisos.value == "0") camposFaltantes.push("ID Permisos");
  
  // Selectores - verificar que tengan un valor válido seleccionado (no vacío)
  if (estado_empleado.value == "" || estado_empleado.value == null) camposFaltantes.push("Estado del Empleado");
  if (estado_civil.value == "" || estado_civil.value == null) camposFaltantes.push("Estado Civil");
  if (genero.value == "" || genero.value == null) camposFaltantes.push("Género");
  if (departamento_laboral.value == "" || departamento_laboral.value == null) camposFaltantes.push("Departamento");
  if (centro_de_costo.value == "" || centro_de_costo.value == null) camposFaltantes.push("Área (Centro de Costo)");
  if (dimension_3.value == "" || dimension_3.value == null) camposFaltantes.push("División");
  if (pago.value == "" || pago.value == null) camposFaltantes.push("Tipo de Pago");
  if (moneda.value == "" || moneda.value == null) camposFaltantes.push("Moneda");
  if (condicion_laboral.value == "" || condicion_laboral.value == null) camposFaltantes.push("Condición Laboral");
  // jornada siempre tiene un valor válido (0=Diurna, 1=Nocturna), no necesita validación
  
  return camposFaltantes;
}

// Función que devuelve los campos de planilla faltantes o inválidos
function obtenerCamposPlanillaFaltantes() {
  let camposFaltantes = [];
  
  if (bon_dec_31_2001.value == "" || parseFloat(bon_dec_31_2001.value) < 0) camposFaltantes.push("Bonificación Decreto 37-2001");
  if (anticipo_quincenal.value == "" || parseFloat(anticipo_quincenal.value) < 0) camposFaltantes.push("Anticipo Quincenal");
  if (bantrab.value == "" || parseFloat(bantrab.value) < 0) camposFaltantes.push("Bantrab");
  if (bon_incentivo.value == "" || parseFloat(bon_incentivo.value) < 0) camposFaltantes.push("Bonificación Incentivo");
  if (ornato.value == "" || parseFloat(ornato.value) < 0) camposFaltantes.push("Boleto de Ornato");
  if (horas_extras_dobles.value == "" || parseFloat(horas_extras_dobles.value) < 0) camposFaltantes.push("Horas Extras Dobles");
  if (horas_simples.value == "" || parseFloat(horas_simples.value) < 0) camposFaltantes.push("Horas Extras Simples");
  if (sueldo_ordinario.value == "" || parseFloat(sueldo_ordinario.value) < 0) camposFaltantes.push("Sueldo Ordinario");
  if (isr.value == "" || parseFloat(isr.value) < 0) camposFaltantes.push("ISR");
  if (otros_ingresos.value == "" || parseFloat(otros_ingresos.value) < 0) camposFaltantes.push("Otros Ingresos");
  if (otros_egresos.value == "" || parseFloat(otros_egresos.value) < 0) camposFaltantes.push("Otros Egresos");
  if (prestamo_empresa_planilla.value == "" || parseFloat(prestamo_empresa_planilla.value) < 0) camposFaltantes.push("Préstamo Empresa");
  if (bancos_planilla.value == "" || parseFloat(bancos_planilla.value) < 0) camposFaltantes.push("Bancos (Planilla)");
  if (judiciales_planilla.value == "" || parseFloat(judiciales_planilla.value) < 0) camposFaltantes.push("Judiciales");
  if (seguro_planilla.value == "" || parseFloat(seguro_planilla.value) < 0) camposFaltantes.push("Seguro");
  if (parqueo_planilla.value == "" || parseFloat(parqueo_planilla.value) < 0) camposFaltantes.push("Parqueo");
  if (vacaciones_planilla.value == "" || parseFloat(vacaciones_planilla.value) < 0) camposFaltantes.push("Vacaciones");
  
  return camposFaltantes;
}

// Función que devuelve los campos originario faltantes
function obtenerCamposOriginarioFaltantes() {
  let camposFaltantes = [];
  
  if (nacionalidad.value == "") camposFaltantes.push("Nacionalidad");
  if (depto_originario.value == "") camposFaltantes.push("Departamento Originario");
  if (muni_originario.value == "") camposFaltantes.push("Municipio Originario");
  
  return camposFaltantes;
}

// Función que devuelve los campos otros faltantes
function obtenerCamposOtrosFaltantes() {
  let camposFaltantes = [];
  
  if (horas_laborales.value == "" || parseFloat(horas_laborales.value) < 0) camposFaltantes.push("Horas Laborales");
  if (ventajas_economicas.value == "" || parseFloat(ventajas_economicas.value) < 0) camposFaltantes.push("Ventajas Económicas");
  
  return camposFaltantes;
}

// Función para mostrar alerta con campos faltantes
function mostrarCamposFaltantes() {
  let todosCamposFaltantes = [];
  
  todosCamposFaltantes = todosCamposFaltantes.concat(obtenerCamposFaltantes());
  todosCamposFaltantes = todosCamposFaltantes.concat(obtenerCamposPlanillaFaltantes());
  todosCamposFaltantes = todosCamposFaltantes.concat(obtenerCamposOriginarioFaltantes());
  todosCamposFaltantes = todosCamposFaltantes.concat(obtenerCamposOtrosFaltantes());
  
  if (todosCamposFaltantes.length > 0) {
    let listaHTML = "<ul style='text-align: left; max-height: 300px; overflow-y: auto;'>";
    todosCamposFaltantes.forEach(campo => {
      listaHTML += `<li style='color: #dc3545;'>${campo}</li>`;
    });
    listaHTML += "</ul>";
    
    Swal.fire({
      icon: "warning",
      title: "Campos Obligatorios Faltantes",
      html: `<p>Por favor complete los siguientes campos:</p>${listaHTML}`,
      confirmButtonText: "Entendido",
      width: 500
    });
    return false;
  }
  return true;
}

function validar_inputs_empleado() {
  if (
    primer_nombre.value != "" &&
    primer_apellido.value != "" &&
    direccion.value != "" &&
    puesto_empleado.value != "" &&
    fecha_nacimiento.value != "" &&
    fecha_inicio.value != "" &&
    id_permisos.value != "" &&
    id_permisos.value != "0" &&
    estado_empleado.value != "" && estado_empleado.value != null &&
    estado_civil.value != "" && estado_civil.value != null &&
    genero.value != "" && genero.value != null &&
    departamento_laboral.value != "" && departamento_laboral.value != null &&
    centro_de_costo.value != "" && centro_de_costo.value != null &&
    dimension_3.value != "" && dimension_3.value != null &&
    pago.value != "" && pago.value != null &&
    moneda.value != "" && moneda.value != null &&
    condicion_laboral.value != "" && condicion_laboral.value != null
  ) {
    return true;
  } else {
    return false;
  }
}

function validar_inputs_planilla() {
  if (
    bon_dec_31_2001.value < 0 ||
    anticipo_quincenal.value < 0 ||
    bantrab.value < 0 ||
    bon_incentivo.value < 0 ||
    ornato.value < 0 ||
    horas_extras_dobles.value < 0 ||
    horas_simples.value < 0 ||
    sueldo_ordinario.value < 0 ||
    isr.value < 0 ||
    otros_ingresos.value < 0 ||
    otros_egresos.value < 0 ||
    prestamo_empresa_planilla.value < 0 ||
    bancos_planilla.value < 0 ||
    judiciales_planilla.value < 0 ||
    seguro_planilla.value < 0 ||
    parqueo_planilla.value < 0 ||
    vacaciones_planilla.value < 0 ||
    bon_dec_31_2001.value == "" ||
    anticipo_quincenal.value == "" ||
    bantrab.value == "" ||
    bon_incentivo.value == "" ||
    ornato.value == "" ||
    horas_extras_dobles.value == "" ||
    horas_simples.value == "" ||
    sueldo_ordinario.value == "" ||
    isr.value == "" ||
    otros_ingresos.value == "" ||
    otros_egresos.value == "" ||
    prestamo_empresa_planilla.value == "" ||
    bancos_planilla.value == "" ||
    judiciales_planilla.value == "" ||
    seguro_planilla.value == "" ||
    parqueo_planilla.value == "" ||
    vacaciones_planilla.value == ""
  ) {
    return false;
  } else {
    return true;
  }
}

function validar_inputs_originario() {
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

function validar_inputs_otros() {
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

function validar_fecha_baja() {
  console.log(fecha_baja.value);
  if (combobox[2].innerText == "De Baja" && fecha_baja.value == "" && fecha_baja.value == '0000-00-00 00:00:00') {
    return false;
  } else {
    return true;
  }
}

async function editar_empleado() {
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

  cargando();

  const respDpi = await $.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
      quest: 'buscar_empleado_dpi',
      dpi: dpi.value,
      id_empleado: id_empleado
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
      igss: no_igss.value,
      id_empleado: id_empleado
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

  editar_empleado_final();
}

function editar_empleado_final() {
  cargando();
  if (validar_inputs_empleado()) {
    if (validar_fecha_baja()) {
      if (validar_inputs_planilla()) {
        if (validar_inputs_originario()) {
          if (validar_inputs_otros()) {
            if (validar_intercompany()) {
              if (validar_porcentaje_intercompany()) {
                if (validar_empresa_principal()) {
                  return new Promise((resolve, reject) => {
                    var cmb = document.getElementsByClassName("title");
                    $.ajax({
                      url: "php/servidor.php",
                      type: "POST",
                      dataType: "text",
                      data: {
                        quest: "editar_empleado",
                        id: id_empleado,
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
                        no_igss: no_igss.value,
                        centro_de_costo:
                          centro_de_costo.options[centro_de_costo.selectedIndex]
                            .value,
                        puesto: puesto_empleado.value,
                        fecha_inicio: fecha_inicio.value,
                        fecha_baja: fecha_baja.value,
                        motivo_baja: motivo_baja ? motivo_baja.value : "",
                        telefono: telefono_domiciliar.value,
                        genero: genero.options[genero.selectedIndex].value,
                        licencia: no_licencia.value,
                        id_tipo_licencia:
                          tipo_licencia.options[tipo_licencia.selectedIndex]
                            .value,
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
                        vacaciones: vacaciones_planilla.value,
                        anticipo_quincenal: anticipo_quincenal.value,
                        bantrab: bantrab.value,
                        boleto_de_ornato: ornato.value,
                        isr: isr.value,
                        otro_descuentos: otros_egresos.value,
                        prestamo_empresa: prestamo_empresa_planilla.value,
                        bancos: bancos_planilla.value,
                        judiciales: judiciales_planilla.value,
                        seguro: seguro_planilla.value,
                        parqueo: parqueo_planilla.value,
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
                          condicion_laboral.options[
                            condicion_laboral.selectedIndex
                          ].value,
                        codigo_ocupacion: codigo_ocupacion.value,
                        tipo_plantilla: tipo_planilla.value,
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
                        jubilacion: jubilacion.checked,
                        discapacidad: discapacidad.value,
                        jornada: jornada.options[
                          jornada.selectedIndex
                        ].value,
                        id_permisos: id_permisos.value,
                        titulos_diplomas: titulos_diplomas.value,
                        afiliacion_igss: afiliacion_igss.value,
                        dimension_3: dimension_3.options[dimension_3.selectedIndex].value,
                        dimension_4: (dimension_4.selectedIndex < 0 || dimension_4.options.length == 0 || dimension_4.value == "") ? 'NULL' : dimension_4.options[dimension_4.selectedIndex].value,
                        dimension_5: (dimension_5.selectedIndex < 0 || dimension_5.options.length == 0 || dimension_5.value == "") ? 'NULL' : dimension_5.options[dimension_5.selectedIndex].value,
                      },
                      success: function (resp) {
                        if (resp.includes("Successfully")) {
                          resolve();
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Error Al Editar Empleado",
                            text: "Ah ocurrido un error al editar el empleado, por favor, intentalo de nuevo",
                          });
                          console.log(resp);
                          reject(resp);
                        }
                      },
                      error: function(xhr, status, error) {
                        console.error("Error AJAX al editar empleado:", error);
                        console.error("Detalles:", xhr.responseText);
                        Swal.fire({
                          icon: "error",
                          title: "Error de Comunicación",
                          text: "No se pudo conectar con el servidor. Por favor, intenta de nuevo.",
                        });
                        reject(error);
                      }
                    });
                  }).then(() => {
                    ingresar_igss_laboral();
                  });
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Empresa Principal Intercompany",
                    html: "Por favor asegurese de haber seleccionado <strong><u>UNA</u></strong> empresa principal",
                  });
                }
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Porcentajes Intercompany Invalidos",
                  text: "Por favor asegurese de haber ingresado correctamente los porcentajes en el apartado de Intercompany, estos tienen que sumar exactamente 100%",
                });
              }
            } else {
              Swal.fire({
                icon: "warning",
                title: "Datos Faltantes Intercompany",
                text: "Por favor asegurese de haber llenado los campos del apartado Intercompany de caracter OBLIGATORIO",
              });
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Valores Invalidos Otros",
              html: "Por favor asegurese de haber ingresado valores validos en el apartado de Otros:<br><br>" + 
                    obtenerCamposOtrosFaltantes().map(c => `• ${c}`).join("<br>"),
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Datos Faltantes Originario",
            html: "Por favor asegurese de haber llenado los campos del apartado Originario de caracter OBLIGATORIO:<br><br>" +
                  obtenerCamposOriginarioFaltantes().map(c => `• ${c}`).join("<br>"),
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Valores Invalidos Planilla",
          html: "Por favor asegurese de haber ingresado valores validos en el apartado de Planilla:<br><br>" +
                obtenerCamposPlanillaFaltantes().map(c => `• ${c}`).join("<br>"),
          width: 500
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Fecha Baja Vacia",
        text: "Si el empleado se encuentra de baja debe ingresar la fecha de baja.",
      });
    }
  } else {
    // Mostrar campos específicos faltantes
    let camposFaltantes = obtenerCamposFaltantes();
    let listaHTML = "<ul style='text-align: left;'>";
    camposFaltantes.forEach(campo => {
      listaHTML += `<li style='color: #dc3545;'>${campo}</li>`;
    });
    listaHTML += "</ul>";
    
    Swal.fire({
      icon: "warning",
      title: "Datos Faltantes Empleado",
      html: `<p>Por favor complete los siguientes campos obligatorios:</p>${listaHTML}`,
      width: 500
    });
  }
}

function ingresar_igss_laboral() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      dataType: "text",
      data: {
        quest: "ingresar_igss_empleado_detalle",
        id_empleado: id_empleado,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar IGSS Laboral ",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
          reject(res);
        } else {
          try {
            console.log("Igss Ingresado");
          } catch (error) {
            console.log(error);
          } finally {
            resolve(res);
          }
        }
      },
      error: function(xhr, status, error) {
        console.error("Error AJAX al ingresar IGSS laboral:", error);
        console.error("Detalles:", xhr.responseText);
        Swal.fire({
          icon: "error",
          title: "Error de Comunicación",
          text: "No se pudo actualizar el IGSS laboral.",
        });
        reject(error);
      }
    });
  }).then(() => {
    ingresar_igss_patronal();
  });
}

function ingresar_igss_patronal() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/servidor.php",
      type: "POST",
      dataType: "text",
      data: {
        quest: "ingresar_igss_patronal_detalle",
        id_empleado: id_empleado,
      },
      success: function (res) {
        if (res.includes("Query Falló")) {
          Swal.fire({
            icon: "error",
            title: "Error Al Ingresar IGSS Patronal ",
            text: "Por favor, comunicate con sistemas",
          });
          console.log(res);
          reject(res);
        } else {
          try {
            console.log("Igss Patronal Ingresado");
          } catch (error) {
            console.log(error);
          } finally {
            resolve(res);
          }
        }
      },
      error: function(xhr, status, error) {
        console.error("Error AJAX al ingresar IGSS patronal:", error);
        console.error("Detalles:", xhr.responseText);
        Swal.fire({
          icon: "error",
          title: "Error de Comunicación",
          text: "No se pudo actualizar el IGSS patronal.",
        });
        reject(error);
      }
    });
  }).then(() => {
    modificar_intercompany();
  });
}

function cambio_departamento_empleado() {
  empresas_intercompany = [];
  var listado_empresas = document.getElementById("listado_empresas");
  listado_empresas.innerHTML = "";
}

function listado_centro_costo_cambio_depto() {
  try {
    cambio_departamento_empleado();
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
          selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
            keepInlineStyles: true,
            maxHeight: 678,
            minWidth: 200,
            search: true,
            placeHolder: "Área...",
          });
          Swal.fire({
            icon: "warning",
            title: "No Hay Área Registradas En La Departamento",
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
            selectBox = safeInitVanillaSelectBox("#centro_de_costo", {
              keepInlineStyles: true,
              maxHeight: 678,
              minWidth: 200,
              search: true,
              placeHolder: "Área...",
            });
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

function abandono() {
  $("#modal_abandono").modal("show");
}

function carta_abandono() {
  var fecha_labor = document.getElementById("falta_labor").value;
  var representante = document.getElementById("representante_abandono").value;
  var dpi = document.getElementById("dpi").value;
  var nombre_empleado = `${document.getElementById("primer_nombre").value}`;
  if (document.getElementById("segundo_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_nombre").value}`;
  }
  if (document.getElementById("otro_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("otro_nombre").value}`;
  }
  if (document.getElementById("primer_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("primer_apellido").value}`;
  }
  if (document.getElementById("segundo_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_apellido").value}`;
  }
  if (document.getElementById("apellido_casada").value != "") {
    nombre_empleado += ` ${document.getElementById("apellido_casada").value}`;
  }
  if (fecha_labor == "" || representante == "") {
    Swal.fire({
      icon: "warning",
      title: "Faltan datos!",
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: 1300,
    });
  } else {
    sessionStorage.setItem("fecha_labor", fecha_labor);
    sessionStorage.setItem("representante", representante);
    sessionStorage.setItem("dpi", dpi);
    sessionStorage.setItem("nombre_empleado", nombre_empleado);
    window.location.href = "./abandono.html";
  }
}

function apertura_cuenta() {
  $("#modal_apertura_cuenta").modal("show");
}

function limpiar_inputs_cuenta() {
  document.getElementById("nombre_banco").value = "";
  document.getElementById("representante").value = "";
  document.getElementById("falta_labor").value = "";
  document.getElementById("representante_abandono").value = "";
}

function aperturar_cuenta() {
  var banco = document.getElementById("nombre_banco").value;
  var representante = document.getElementById("representante").value;
  var empresa = `${document.getElementById("primer_nombre").value}`;
  var nombre_empleado = `${document.getElementById("primer_nombre").value}`;
  if (document.getElementById("segundo_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_nombre").value}`;
  }
  if (document.getElementById("otro_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("otro_nombre").value}`;
  }
  if (document.getElementById("primer_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("primer_apellido").value}`;
  }
  if (document.getElementById("segundo_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_apellido").value}`;
  }
  if (document.getElementById("apellido_casada").value != "") {
    nombre_empleado += ` ${document.getElementById("apellido_casada").value}`;
  }
  var dpi = document.getElementById("dpi").value;

  if (banco == "" || representante == "") {
    Swal.fire({
      icon: "warning",
      title: "Faltan datos!",
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: 1300,
    });
  } else {
    sessionStorage.setItem("banco", banco);
    sessionStorage.setItem("representante", representante);
    sessionStorage.setItem("nombre_empleado", nombre_empleado);
    sessionStorage.setItem("dpi", dpi);
    window.location.href = "./apertura_cuenta.html";
  }
  console.log(nombre_empleado);
}

function contancia_laboral() {
  $("#modal_constancia").modal("show");
  var puesto_empleado = document.getElementById("puesto_empleado");
  var puesto_constancia = document.getElementById("puesto_constancia");
  puesto_constancia.value = puesto_empleado.value;
}


function generar_constancia() {
  var nombre_empleado = `${document.getElementById("primer_nombre").value}`;
  if (document.getElementById("segundo_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_nombre").value}`;
  }
  if (document.getElementById("otro_nombre").value != "") {
    nombre_empleado += ` ${document.getElementById("otro_nombre").value}`;
  }
  if (document.getElementById("primer_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("primer_apellido").value}`;
  }
  if (document.getElementById("segundo_apellido").value != "") {
    nombre_empleado += ` ${document.getElementById("segundo_apellido").value}`;
  }
  if (document.getElementById("apellido_casada").value != "") {
    nombre_empleado += ` ${document.getElementById("apellido_casada").value}`;
  }
  var representante = document.getElementById("representante_constancia").value;
  var puesto = document.getElementById("puesto_constancia").value;
  var dpi = document.getElementById("dpi").value;
  var fecha_inicio = document.getElementById("fecha_inicio_constancia").value;
  var fecha_final = document.getElementById("fecha_final_constancia").value;
  var centro_costo = document.getElementById("centro_de_costo");
  var area = centro_costo.options[centro_costo.selectedIndex].text;
  console.log(area);
  var salario_ordinario = parseInt(document.getElementById("sueldo_ordinario").value);
  var bonficacion =
    parseInt(document.getElementById("bon_dec_31_2001").value) +
    parseInt(document.getElementById("bon_incentivo").value);
  if (
    fecha_inicio !== "" &&
    fecha_final !== "" &&
    representante !== "" &&
    puesto !== ""
  ) {
    var datos_constancia = {
      nombre_empleado: nombre_empleado,
      representante: representante,
      dpi: dpi,
      fecha_inicio: fecha_inicio,
      fecha_final: fecha_final,
      area: area,
      centro_costo: centro_costo,
      salario_ordinario: salario_ordinario,
      bonficacion: bonficacion,
      puesto: puesto
    }
    sessionStorage.setItem("datos_constancia", JSON.stringify(datos_constancia));
    window.location.href = './carta_constancia.html';
  } else {
    Swal.fire(
      'Faltan datos',
      'Revise que todos los datos se hayan llenado correctamente',
      'warning'
    )
  }
}

function contrato_confidencialidad() {
  var puesto_empleado = document.getElementById("puesto_empleado");
  var puesto = document.getElementById("puesto");
  puesto.value = puesto_empleado.value;
  $("#modal_contrato_confidencial").modal("show");
}

function generar_contrato() {
  if (esCampoVacio("primer_nombre") ||
    esCampoVacio("edad_empleado") ||
    esCampoVacio("nacionalidad") ||
    esCampoVacio("estado_civil") ||
    esCampoVacio("region_originario") ||
    esCampoVacio("dpi") ||
    esCampoVacio("fecha_acta") ||
    esCampoVacio("nombre_notario") ||
    esCampoVacio("registro_mercantil") ||
    esCampoVacio("folio") ||
    esCampoVacio("libro") ||
    esCampoVacio("puesto") ||
    esCampoVacio("departamento_laboral")) {
    // Mostrar mensaje de error con SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Faltan campos',
      text: 'Por favor, completa todos los campos antes de generar el contrato.',
    });
  } else {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.toLocaleString("default", { month: "long" });
    const anio = fechaActual.getFullYear();

    const nombreEmpleado = [
      "primer_nombre",
      "segundo_nombre",
      "otro_nombre",
      "primer_apellido",
      "segundo_apellido",
      "apellido_casada",
    ]
      .map((campo) => obtenerValorEnTexto(campo))
      .filter(Boolean)
      .join(" ");

    const edad = obtenerValorEnTexto("edad_empleado");
    const edadEnLetras = obtenerEdadEnLetras();
    const nacionalidad = obtenerValorEnTexto("nacionalidad");
    const estadoCivil = obtenerTextoSelect("estado_civil"); // Utilizamos la nueva función
    const domicilio = obtenerValorEnTexto("region_originario");
    const dpi = obtenerValorEnTexto("dpi");
    const dpiEnLetras = obtenerDPIEnLetras();
    const nombreEmpresa = obtenerEmpresaPrincipal(); // Utilizamos la nueva función
    const fechaActa = document.getElementById("fecha_acta").value;
    const nombreNotario = obtenerValorEnTexto("nombre_notario");
    const registroMercantil = obtenerValorEnTexto("registro_mercantil");
    const folio = obtenerValorEnTexto("folio");
    const folio_2 = obtenerFolioEnLetras("folio");
    const libro = obtenerValorEnTexto("libro");
    const libro_2 = obtenerLibroEnLetras("libro");
    const puesto = obtenerValorEnTexto("puesto");
    const departamentoLaboral = obtenerTextoSelect("departamento_laboral"); // Utilizamos la nueva función

    const informacion = {
      fecha_actual: `el ${dia} de ${mes} de ${anio}`,
      nombre_completo: nombreEmpleado,
      edad: edad,
      edad_2: `${edadEnLetras} años`,
      nacionalidad: nacionalidad,
      estado_civil: estadoCivil,
      domicilio: domicilio,
      dpi: dpi,
      dpi_2: dpiEnLetras,
      nombre_empresa: nombreEmpresa,
      fecha_acta: fechaActa,
      nombre_notario: nombreNotario,
      registro_mercantil: registroMercantil,
      folio: folio,
      folio_2: folio_2,
      libro: libro,
      libro_2: libro_2,
      puesto: puesto,
      departamento_laboral: departamentoLaboral,
    };

    sessionStorage.setItem("informacion", JSON.stringify(informacion));
    window.location.href = "./contrato.html";
    console.log(informacion);
  }
}

function esCampoVacio(id) {
  const valor = obtenerValorEnTexto(id);
  return valor === "" || valor === "0";
}

function obtenerValorEnTexto(id) {
  const valor = document.getElementById(id).value.trim();
  return valor || "";
}

function obtenerEdadEnLetras() {
  const edad = document.getElementById("edad_empleado").value;
  if (isNaN(edad)) return "cero";
  const unidades = [
    "cero",
    "un",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const especiales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const decenas = [
    "cero",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  let edadEnLetras = "";
  if (edad >= 0 && edad <= 9) {
    edadEnLetras = unidades[edad];
  } else if (edad >= 10 && edad <= 19) {
    edadEnLetras = especiales[edad - 10];
  } else if (edad >= 20 && edad <= 99) {
    const unidad = edad % 10;
    const decena = (edad - unidad) / 10;
    edadEnLetras = decenas[decena];
    if (unidad > 0) {
      edadEnLetras += ` y ${unidades[unidad]}`;
    }
  }

  return edadEnLetras;
}

function obtenerDPIEnLetras() {
  const dpi = document.getElementById("dpi").value.trim();
  const numerosEnLetras = [
    "cero",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];

  let dpiEnLetras = "";
  for (let i = 0; i < dpi.length; i++) {
    const char = dpi[i];
    if (!isNaN(char)) {
      dpiEnLetras += `${numerosEnLetras[parseInt(char)]} `;
    } else if (char === " ") {
      dpiEnLetras += "espacio ";
    }
  }

  return dpiEnLetras.trim();
}

function obtenerTextoSelect(id) {
  const selectElement = document.getElementById(id);
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  return selectedOption ? selectedOption.textContent.trim() : "";
}

function obtenerEmpresaPrincipal(id) {
  var index_principal = empresas_intercompany.findIndex(
    (principal) => principal.principal == 1
  );

  var empresa_principal = empresas_intercompany[index_principal].nombre;
  return empresa_principal;
}

function obtenerFolioEnLetras() {
  const folio = document.getElementById("folio").value.trim();
  return convertirNumeroEnLetras(folio);
}

function obtenerLibroEnLetras() {
  const libro = document.getElementById("libro").value.trim();
  return convertirNumeroEnLetras(libro);
}

function convertirNumeroEnLetras(numero) {
  const numerosEnLetras = [
    "cero",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];

  let numeroEnLetras = "";
  for (let i = 0; i < numero.length; i++) {
    const char = numero[i];
    if (!isNaN(char)) {
      numeroEnLetras += `${numerosEnLetras[parseInt(char)]} `;
    } else if (char === " ") {
      numeroEnLetras += "espacio ";
    }
  }

  return numeroEnLetras.trim();
}

function cancelacion() {
  $("#modal_cancelacion").modal("show");
}

function guardarDatosCancelacion() {
  // Obtener los valores de los inputs
  const representante = document.getElementById('representante_cancelacion').value;
  const fecha = document.getElementById('fecha_cancelacion').value;
  const nombreCompleto = obtenerNombreEmpleado();

  // Validar que los campos no estén vacíos
  if (representante.trim() === '' || fecha.trim() === '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes completar ambos campos antes de guardar.',
    });
  } else {
    // Crear un objeto con los valores
    const datosCancelacion = {
      representante: representante,
      fecha: fecha,
      nombreCompleto: nombreCompleto
    };

    // Convertir el objeto a una cadena JSON
    const datosJSON = JSON.stringify(datosCancelacion);

    // Guardar los datos en el sessionStorage
    sessionStorage.setItem('cancelacion_contrato', datosJSON);

    window.location.href = 'cancelacion_contrato.html';
  }
}

function obtenerNombreEmpleado() {
  const elementos = [
    "primer_nombre",
    "segundo_nombre",
    "otro_nombre",
    "primer_apellido",
    "segundo_apellido",
    "apellido_casada",
  ];

  let nombre_empleado = "";

  for (const id of elementos) {
    const valor = document.getElementById(id).value.trim();
    if (valor !== "") {
      nombre_empleado += `${valor} `;
    }
  }

  // Eliminar el espacio en blanco adicional al final del nombre
  nombre_empleado = nombre_empleado.trim();

  return nombre_empleado;
}

function disciplinaria() {
  window.location.href = './disciplinaria.htm';
}

function confirmar_motivo_baja() {
  var modal_input = document.getElementById("modal_input_motivo_baja");
  var motivo_baja = document.getElementById("motivo_baja");
  if (modal_input && motivo_baja) {
    motivo_baja.value = modal_input.value;
  }
  $('#modal_motivo_baja').modal('hide');
}
