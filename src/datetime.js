/**
 * @version: 1.0.0
 * @author: Antonio Peña https://www.ajdev.es/
 * @copyright: Copyright (c) 2024 Antonio Peña. Todos los derechos reservados.
 * @license: Licensed under the MIT license.
 * You may obtain a copy of the License at
 * https://opensource.org/licenses/MIT
 */

class DateTime {
  constructor() {
    console.log("DateTime plugin initialized");
  }

  /**
   * Obtiene la fecha y hora actual
   * @returns {string} Fecha y hora actual en formato ISO
   */
  getCurrentDateTime() {
    return new Date().toISOString();
  }

  /**
   * Convierte una fecha a un formato legible
   * @param {string|Date} date Fecha en formato ISO o un objeto Date
   * @returns {string} Fecha en formato legible
   */
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" });
  }

  /**
   * Suma días a una fecha
   * @param {string|Date} date Fecha en formato ISO o un objeto Date
   * @param {number} days Número de días a sumar
   * @returns {string} Fecha resultante en formato ISO
   */
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  /**
   * Calcula la diferencia entre dos fechas en días
   * @param {string|Date} date1 Fecha inicial
   * @param {string|Date} date2 Fecha final
   * @returns {number} Diferencia en días
   */
  getDifferenceInDays(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2 - d1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

// Exportar para CommonJS (require)
if (typeof module === "object" && module.exports) {
  module.exports = DateTime;
}

// ES Module Export (para import) // no usar para tener compatibilidad con require
// export default DateTime;
