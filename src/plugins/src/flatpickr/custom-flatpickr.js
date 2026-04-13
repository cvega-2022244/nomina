// Flatpickr

// Verificar que los elementos existen antes de inicializar flatpickr
const basicFlatpickr = document.getElementById('basicFlatpickr');
if (basicFlatpickr) {
    var f1 = flatpickr(basicFlatpickr, {
        defaultDate: new Date()
    });
}

const dateTimeFlatpickr = document.getElementById('dateTimeFlatpickr');
if (dateTimeFlatpickr) {
    var f2 = flatpickr(dateTimeFlatpickr, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: new Date()
    });
}

const rangeCalendarFlatpickr = document.getElementById('rangeCalendarFlatpickr');
if (rangeCalendarFlatpickr) {
    var f3 = flatpickr(rangeCalendarFlatpickr, {
        mode: "range",
    });
}

const timeFlatpickr = document.getElementById('timeFlatpickr');
if (timeFlatpickr) {
    var f4 = flatpickr(timeFlatpickr, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: "13:45",
    });
}