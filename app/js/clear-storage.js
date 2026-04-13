// Script para limpiar localStorage y evitar errores de JSON
$(document).ready(function() {
    // Limpiar localStorage si hay datos corruptos
    try {
        const theme = localStorage.getItem("theme");
        if (theme) {
            JSON.parse(theme);
        }
    } catch (e) {
        console.warn("Datos corruptos en localStorage, limpiando...");
        localStorage.clear();
        location.reload();
    }
});




