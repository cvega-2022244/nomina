var array_empleados = [];
var totales = {
    salario_base: 0,
    salario_ordinario: 0,
    salario_extraordinario: 0,
    septimo_asueto: 0,
    bon_incentivo: 0,
    igss: 0,
    egresos: 0,
    liquido: 0
};

$(document).ready(function () {
    const fecha_inicio = sessionStorage.getItem("fecha_inicio");
    const fecha_final = sessionStorage.getItem("fecha_final");
    
    if (fecha_inicio && fecha_final) {
        document.getElementById('report-period').innerText = `Periodo: del ${formatearFecha(fecha_inicio)} al ${formatearFecha(fecha_final)}`;
    }

    cargarEmpleados();
});

function formatearFecha(fecha) {
    if (!fecha) return "";
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
}

async function cargarEmpleados() {
    try {
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: { quest: 'usuarios_salario' }
        });

        let lista = typeof res === 'string' ? JSON.parse(res) : res;
        if (Array.isArray(lista)) {
            array_empleados = lista;
            generarReporte();
        }
    } catch (error) {
        console.error("Error al cargar empleados:", error);
    }
}

async function generarReporte() {
    let template = '';
    
    for (const empleado of array_empleados) {
        try {
            const respuesta = await $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'lista_libros',
                    id_empleado: empleado.id_empleado,
                    fecha_inicio: sessionStorage.getItem("fecha_inicio"),
                    fecha_final: sessionStorage.getItem("fecha_final"),
                    enero: sessionStorage.getItem("enero"),
                    febrero: sessionStorage.getItem("febrero"),
                    marzo: sessionStorage.getItem("marzo"),
                    abril: sessionStorage.getItem("abril"),
                    mayo: sessionStorage.getItem("mayo"),
                    junio: sessionStorage.getItem("junio"),
                    julio: sessionStorage.getItem("julio"),
                    agosto: sessionStorage.getItem("agosto"),
                    septiembre: sessionStorage.getItem("septiembre"),
                    octubre: sessionStorage.getItem("octubre"),
                    noviembre: sessionStorage.getItem("noviembre"),
                    diciembre: sessionStorage.getItem("diciembre")
                }
            });

            let lista_salarios = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
            
            if (Array.isArray(lista_salarios) && lista_salarios.length > 0) {
                lista_salarios.forEach(dato => {
                    // Acumular totales
                    totales.salario_base += parseFloat(dato.salario);
                    totales.salario_ordinario += parseFloat(dato.salario_ordinario);
                    totales.salario_extraordinario += parseFloat(dato.salario_extraordinario);
                    totales.septimo_asuesto += parseFloat(dato.septimo_asuesto);
                    totales.bon_incentivo += parseFloat(dato.bon_incentivo);
                    totales.igss += parseFloat(dato.igss);
                    totales.egresos += parseFloat(dato.total_deducciones);
                    totales.liquido += parseFloat(dato.liquido);

                    template += `
                    <tr>
                        <td>
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${empleado.nombre}</span>
                                <small class="text-muted">ID: ${empleado.id_empleado}</small>
                            </div>
                        </td>
                        <td>${empleado.puesto}</td>
                        <td>Q.${parseFloat(dato.salario).toFixed(2)}</td>
                        <td>${dato.dias_trabajados}</td>
                        <td>Q.${parseFloat(dato.salario_ordinario).toFixed(2)}</td>
                        <td>Q.${parseFloat(dato.salario_extraordinario).toFixed(2)}</td>
                        <td>Q.${parseFloat(dato.septimo_asuesto).toFixed(2)}</td>
                        <td>Q.${parseFloat(dato.bon_incentivo).toFixed(2)}</td>
                        <td>Q.${parseFloat(dato.igss).toFixed(2)}</td>
                        <td>Q.${parseFloat(dato.total_deducciones).toFixed(2)}</td>
                        <td class="text-end"><span class="badge-net">Q.${parseFloat(dato.liquido).toFixed(2)}</span></td>
                    </tr>
                    `;
                });
            }
        } catch (e) {
            console.error(`Error procesando empleado ${empleado.id_empleado}:`, e);
        }
    }

    document.getElementById("cuerpo-reporte").innerHTML = template;
    generarPie();
    inicializarDataTable();
}

function generarPie() {
    const pie = `
    <tr class="table-dark">
        <td colspan="2" class="fw-bold text-center">TOTALES GENERALES</td>
        <td class="fw-bold">Q.${totales.salario_base.toFixed(2)}</td>
        <td>-</td>
        <td class="fw-bold">Q.${totales.salario_ordinario.toFixed(2)}</td>
        <td class="fw-bold">Q.${totales.salario_extraordinario.toFixed(2)}</td>
        <td class="fw-bold">Q.${totales.septimo_asuesto.toFixed(2)}</td>
        <td class="fw-bold">Q.${totales.bon_incentivo.toFixed(2)}</td>
        <td class="fw-bold">Q.${totales.igss.toFixed(2)}</td>
        <td class="fw-bold">Q.${totales.egresos.toFixed(2)}</td>
        <td class="text-end fw-bold" style="background-color: #2e7d32; font-size: 1.1em;">Q.${totales.liquido.toFixed(2)}</td>
    </tr>
    `;
    document.getElementById("pie-reporte").innerHTML = pie;
}

function inicializarDataTable() {
    $('#tabla-ejecutiva').DataTable({
        dom: '<"row"<"col-md-6"l><"col-md-6"Bf>>rtip',
        buttons: [
            { extend: 'excel', className: 'btn btn-success btn-sm', text: 'Excel' },
            { extend: 'print', className: 'btn btn-info btn-sm', text: 'Imprimir' }
        ],
        "oLanguage": {
            "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
            "sSearchPlaceholder": "Buscar empleado...",
            "sLengthMenu": "Resultados: _MENU_",
            "sInfo": "Mostrando página _PAGE_ de _PAGES_",
        },
        "stripeClasses": [],
        "lengthMenu": [10, 20, 50, 100],
        "pageLength": 100
    });
}
