$(document).ready(function () {
    if (!sessionStorage.getItem('usuario_principal') || sessionStorage.getItem('usuario_principal') == '' || sessionStorage.getItem('usuario_principal') == 'null') {
        window.location.href = 'login.html'
    }
});