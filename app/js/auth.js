/**
 * auth.js - Gestión de sesión y autenticación
 */

function cerrarSesion() {
    Swal.fire({
        icon: 'question',
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que deseas salir del sistema?',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar almacenamiento de sesión
            sessionStorage.clear();
            // Limpiar cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            // Redirigir al login
            window.location.href = 'login.html';
        }
    });
}

$(document).ready(function() {
    // 1. Mostrar nombre del usuario si existe el contenedor
    const usuarioRaw = sessionStorage.getItem('usuario_principal');
    if (usuarioRaw) {
        let nombre = usuarioRaw;
        try {
            // Intentar parsear si es JSON
            const usuarioObj = JSON.parse(usuarioRaw);
            nombre = usuarioObj.nombre || usuarioRaw;
        } catch (e) {
            // Si no es JSON, usar el valor crudo
            nombre = usuarioRaw;
        }
        
        // Actualizar todos los posibles IDs de nombre de usuario
        $('#usuario_nombre_header, #usuario_nombre_navbar, #usuario_nombre_reporte').text(`Hola, ${nombre}`);
    }

    // 2. Verificación de seguridad básica (redirigir si no hay sesión)
    const paginasPublicas = ['login.html', '404.html'];
    const currentPath = window.location.pathname;
    const isPublic = paginasPublicas.some(page => currentPath.includes(page));

    if (!usuarioRaw && !isPublic) {
        window.location.href = 'login.html';
    }
});
