// Función auxiliar para agregar event listeners de forma segura
function safeAddEventListener(selector, event, handler) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Basic message
safeAddEventListener('.widget-content .message', 'click', function() {
    Swal.fire('Saved succesfully')
});

/**
 *     Placement
 */

// Center
safeAddEventListener('.widget-content .default', 'click', function() {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Placement set at default (center)',
        showConfirmButton: false,
        timer: 1500
    })
});

// Top Start
safeAddEventListener('.widget-content .top-start', 'click', function() {
    Swal.fire({
        position: 'top-start',
        icon: 'success',
        title: 'Placement set at top left',
        showConfirmButton: false,
        timer: 1500
    })
});

// Top End
safeAddEventListener('.widget-content .top-end', 'click', function() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Placement set at top right',
        showConfirmButton: false,
        timer: 1500
    })
});

// Bottom Start
safeAddEventListener('.widget-content .bottom-start', 'click', function() {
    Swal.fire({
        position: 'bottom-start',
        icon: 'success',
        title: 'Placement set at bottom left',
        showConfirmButton: false,
        timer: 1500
    })
});

// Bottom End
safeAddEventListener('.widget-content .bottom-end', 'click', function() {
    Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: 'Placement set at bottom right',
        showConfirmButton: false,
        timer: 1500
    })
});

/**
 *       Auto Timer
 */

safeAddEventListener('.widget-content .timer', 'click', function() {
    let timerInterval
    Swal.fire({
        title: 'Auto close alert!',
        html: 'I will close in <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
        }
    })
});

/**
 *     Message with custom image
 */
safeAddEventListener('.widget-content .custom-image', 'click', function() {
    Swal.fire({
        title: 'Sweet!',
        text: 'Modal with a custom image.',
        imageUrl: '../src/assets/img/sweet-alert.jpg',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
    })
});

/**
 *     Warning message, with "Confirm" button
 */
safeAddEventListener('.widget-content .warning.confirm', 'click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
    })
});

/**
 *     Execute something else for "Cancel".
 */
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});

safeAddEventListener('.widget-content .warning.cancel', 'click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
    })
});

/**
 *     RTL Support
 */
safeAddEventListener('.widget-content .RTL', 'click', function() {
    Swal.fire({
        title: 'هل تريد الاستمرار؟',
        icon: 'question',
        iconHtml: '؟',
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا',
        showCancelButton: true,
        showCloseButton: true
    })
});

/**
 *     Mixin
 */
safeAddEventListener('.widget-content .mixin', 'click', function() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
      
    Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
    })
});

/**
 *     Icons Type
 */

// Succcess
safeAddEventListener('.widget-content .icon-success', 'click', function() {
    Swal.fire({
        icon: 'success',
        title: 'Icon Success',
    })
});

// Error
safeAddEventListener('.widget-content .icon-error', 'click', function() {
    Swal.fire({
        icon: 'error',
        title: 'Icon Error',
    })
});

// Warning
safeAddEventListener('.widget-content .icon-warning', 'click', function() {
    Swal.fire({
        icon: 'warning',
        title: 'Icon Warning',
    })
});

// Info
safeAddEventListener('.widget-content .icon-info', 'click', function() {
    Swal.fire({
        icon: 'info',
        title: 'Icon Info',
    })
});

// Question
safeAddEventListener('.widget-content .icon-question', 'click', function() {
    Swal.fire({
        icon: 'question',
        title: 'Icon Question',
    })
});





