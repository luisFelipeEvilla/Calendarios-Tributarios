export const getFechaConLocale = (fecha: string) => {
    // obtener fecha local
    const fechaLocal = new Date(fecha);
    // obtener fecha UTC
    const fechaUTC = new Date(fechaLocal.getTime() + fechaLocal.getTimezoneOffset() * 60000);

    return fechaUTC;
}