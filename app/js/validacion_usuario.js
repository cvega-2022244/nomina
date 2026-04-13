$(document).ready(function () {
    if (!sessionStorage.getItem('usuario_principal') || sessionStorage.getItem('usuario_principal') == '' || sessionStorage.getItem('usuario_principal') == 'null') {
        window.location.href = 'login.html'
    } else {
        // Si es empleado y está en index.html, redirigir a comisiones
        if (window.location.pathname.includes('index.html')) {
            const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
            const userRole = userData ? userData.rol : null;
            
            if (userRole === 'empleado' || userRole === 'jefe' || userRole === 'gerente') {
                // Empleados, jefes y gerentes van directamente a su panel personalizado
                window.location.href = 'seleccion_bonos.html';
            }
        }
    }
});