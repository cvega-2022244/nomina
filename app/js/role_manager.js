// Sistema de gestión de roles para la aplicación de nómina
// Roles disponibles: admin, operaciones, capturador

class RoleManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.rol = this.getCurrentRole();
        console.log('🔐 Sistema de roles activo - Rol actual:', this.rol || 'No definido');
    }

    // Obtener usuario actual del sessionStorage
    getCurrentUser() {
        const userData = sessionStorage.getItem('usuario_principal');
        if (userData && userData !== 'null' && userData !== '') {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Error al parsear datos de usuario:', e);
                return null;
            }
        }
        return null;
    }

    // Obtener el rol del usuario actual
    getCurrentRole() {
        // Primero intentar del sessionStorage directo
        const rolDireto = sessionStorage.getItem('rol');
        if (rolDireto) {
            return rolDireto;
        }
        // Si no, del objeto usuario
        if (this.currentUser) {
            return this.currentUser.rol || null;
        }
        return null;
    }

    // Obtener el nombre del usuario actual
    getCurrentUserName() {
        return this.currentUser ? this.currentUser.nombre : 'Usuario';
    }

    // ============================================
    // VERIFICACIÓN DE ROLES
    // ============================================

    // Verificar si el usuario es admin (acceso completo)
    isAdmin() {
        return this.rol === 'admin';
    }

    // Verificar si el usuario es operaciones (solo bonos y horas extra)
    isOperaciones() {
        return this.rol === 'operaciones';
    }

    // Verificar si el usuario es capturador
    isCapturador() {
        return this.rol === 'capturador';
    }

    // Verificar si el usuario tiene un rol específico
    hasRole(role) {
        return this.rol === role;
    }

    // Verificar si el usuario tiene alguno de los roles especificados
    hasAnyRole(roles) {
        return roles.includes(this.rol);
    }

    // ============================================
    // PERMISOS POR SECCIÓN
    // ============================================

    // Puede ver Datos Maestros (empresas, empleados, departamentos, etc.)
    canViewDatosMaestros() {
        return this.isAdmin();
    }

    // Puede ver/administrar Nómina completa
    canViewFullNomina() {
        return this.isAdmin();
    }

    // Puede ver Historial
    canViewHistorial() {
        return this.isAdmin();
    }

    // Puede ver Bono 14
    canViewBono14() {
        return this.isAdmin();
    }

    // Puede ver Aguinaldo
    canViewAguinaldo() {
        return this.isAdmin();
    }

    // Puede crear/ver Bonos Variables (operaciones y admin)
    canViewBonosVariables() {
        return this.isAdmin() || this.isOperaciones();
    }

    // Puede ver/ingresar Horas Extra (operaciones y admin)
    canViewHorasExtra() {
        return this.isAdmin() || this.isOperaciones();
    }

    // Puede ver página de nómina (pero con restricciones según rol)
    canAccessNominaPage() {
        return this.isAdmin() || this.isOperaciones();
    }

    // ============================================
    // OCULTAR/MOSTRAR ELEMENTOS
    // ============================================

    // Ocultar elementos del menú según el rol en index.html
    hideElementsByRole() {
        const rol = this.rol;
        
        if (!rol) {
            console.warn('⚠️ No se detectó rol del usuario');
            return;
        }

        console.log('🔧 Aplicando restricciones para rol:', rol);

        if (this.isAdmin()) {
            // Admin: mostrar todo
            this.showElement('.datos-maestros');
            this.showElement('.administrar-nomina');
            this.showElement('.historial');
            this.showElement('.bono-14');
            this.showElement('.aguinaldo');
            this.showElement('.crear-bono-variable');
        } else if (this.isOperaciones()) {
            // Operaciones: solo bonos y horas extra
            this.hideElement('.datos-maestros');
            this.hideElement('.historial');
            this.hideElement('.bono-14');
            this.hideElement('.aguinaldo');
            // Mostrar solo lo que puede acceder
            this.showElement('.crear-bono-variable');
            this.showElement('.administrar-nomina'); // Pero con restricciones internas
        } else if (this.isCapturador()) {
            // Capturador: por ahora ocultar todo (se definirá después)
            this.hideElement('.datos-maestros');
            this.hideElement('.administrar-nomina');
            this.hideElement('.historial');
            this.hideElement('.bono-14');
            this.hideElement('.aguinaldo');
            this.hideElement('.crear-bono-variable');
        }
    }

    // Mostrar un elemento
    showElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.remove('role-restricted');
            el.style.display = '';
        });
    }

    // Ocultar un elemento
    hideElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('role-restricted');
            el.style.display = 'none';
        });
    }

    // Redirigir si no tiene permisos
    redirectIfNoPermission(requiredPermission, redirectUrl = 'index.html') {
        if (!requiredPermission) {
            Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: 'No tienes permisos para acceder a esta sección',
                confirmButtonText: 'Entendido'
            }).then(() => {
                window.location.href = redirectUrl;
            });
            return false;
        }
        return true;
    }

    // Mostrar mensaje de bienvenida personalizado
    showWelcomeMessage() {
        // Función silenciosa - sin mensajes en consola
    }

    // Inicializar el sistema de roles
    init() {
        if (!this.currentUser) {
            console.warn('⚠️ No hay usuario logueado');
            return;
        }

        console.log('✅ Usuario:', this.getCurrentUserName(), '| Rol:', this.rol);

        // Aplicar restricciones inmediatamente
        this.hideElementsByRole();
    }
}

// Crear instancia global
const roleManager = new RoleManager();

// Inicializar cuando el DOM esté listo
$(document).ready(function() {
    roleManager.init();
});

// También inicializar cuando la ventana esté completamente cargada
$(window).on('load', function() {
    setTimeout(function() {
        roleManager.init();
    }, 100);
});

// Función para verificar permisos antes de cargar páginas
function checkPagePermission(permissionCheck, pageName) {
    if (!permissionCheck) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso Denegado',
            text: `No tienes permisos para acceder a ${pageName}`,
            confirmButtonText: 'Entendido'
        }).then(() => {
            window.location.href = 'index.html';
        });
        return false;
    }
    return true;
}
