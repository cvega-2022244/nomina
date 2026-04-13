function login() {
    return new Promise((resolve) => {
        let usuario = document.getElementById("user_name").value;
        let contrasena = document.getElementById("password").value;
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'login',
                usuario,
                contrasena
            },
            success: function (res) {
                if (res.includes('credenciales incorrectas')) {
                    try {
                        sessionStorage.setItem('usuario_principal', null);
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(false);
                    }
                } else {
                    try {
                        sessionStorage.setItem('usuario_principal', res);
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(true);
                    }
                }
            }
        });
    }).then((res) => {
        try {
            if (res) {
                window.location.href = 'index.html';
            } else {
                Swal.fire({
                    title: '¡Acceso Denegado!',
                    text: "Su usuario o contraseña son incorrectos o no existen!",
                    icon: 'warning'
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (res) {
                Swal.close();
            }
        }
    })

}

function cargando() {
    Swal.fire({
        title: 'Autenticando',
        html: 'Verificando credenciales',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

$("#user_name").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});

$("#password").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});