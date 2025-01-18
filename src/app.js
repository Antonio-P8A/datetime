/**
 * @version: 1.0.11
 * @author: Antonio Peña https://www.ajdev.es/
 * @copyright: Copyright (c) 2024 Antonio Peña. Todos los derechos reservados.
 * @license: Licensed under the MIT license.
 * You may obtain a copy of the License at
 * https://opensource.org/licenses/MIT
 */

const language = navigator.language ?? "es-ES";
// const translate = require("./lang/" + language.split("-", 1));

// let file = `./lang/${language.split("-", 1)}.json`;
// const loadTranslations = async (filePath = file) => {
// 	try {
// 		const response = await fetch(filePath);
// 		const data = await response.json();
// 		return data;
// 	} catch (error) {
// 		console.error("Error loading translations:", error);
// 	}
// };

// const translations = await loadTranslations();

class DateTime {
	#date = null;
	static lang = language;
	static translate = require("./lang/" + language.split("-", 1));
	// static translate = translations;

	/**
	 * Construye la instancia con una fecha a partir de un formato dado
	 *
	 * @param {string} dateString Fecha a crear por defecto crea fecha actual
	 * @param {string} format Formato en que se ingresa la fecha
	 */
	constructor(dateString = null, format = "yyyy/mm/dd") {
		if (dateString && format) {
			this.#date = this.#parseDate(dateString, format);
		} else {
			this.#date = new Date(); // Fecha actual por defecto
		}

		// Crear alias para repetir métodos
		this.currentDate = this.toString.bind(this);
		this.today = this.toString.bind(this);
		this.now = this.toString.bind(this);
	}

	#translate(key, variables = {}) {
		const messages = DateTime.translate || {};
		let message = messages[key] || key;

		Object.entries(variables).forEach(([placeholder, value]) => {
			message = message.replace(`${placeholder}`, value);
		});

		return message;
	}

	/**
	 * Mostrar la fecha como string
	 *
	 * @param {boolean} hour12 True muestra AM/PM, False 24H. Por defecto es 24H
	 * @returns {string} Retorna formato local
	 */
	toString(hour12 = false) {
		// Estos son todos los tipos de formatos que ofrece Date
		// let format = this.#date.toString(); // Tue May 12 2020 18:50:21 GMT-0500 (Central Daylight Time)
		// format = this.#date.toDateString(); // Tue May 12 2020
		// format = this.#date.toTimeString(); // 18:50:21 GMT-0500 (Central Daylight Time)
		// format = this.#date.toISOString(); // 2020-05-12T23:50:21.817Z - existe diferencia de horas igual que toJSON
		// format = this.#date.toJSON(); // 2020-05-12T23:50:21.817Z - existe diferencia de horas igual que toISOString
		// format = this.#date.toUTCString(); // Tue, 12 May 2020 23:50:21 GMT - existe diferencia de horas
		// format = this.#date.toLocaleString(); // 5/12/2020, 6:50:21 PM
		// format = this.#date.toLocaleDateString(); // 5/12/2020
		// format = this.#date.toLocaleTimeString(); // 6:50:21 PM

		// let format = this.#date.toLocaleString().split(", ").join(" ").split(".", 1).join();

		let formatter = new Intl.DateTimeFormat(DateTime.lang, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: hour12, // Cambia a true para formato de 12 horas
		});

		let format = formatter.format(this.#date).replace(",", "");

		return format;
	}

	/**
	 * Método privado para crear una fecha según el formato
	 *
	 * @returns {Date} Fecha y hora
	 */
	#parseDate(dateString, format) {
		const formatParts = format.split(/[^a-zA-Z]/); // Separar componentes del formato
		const dateParts = dateString.split(/[^0-9]/); // Separar componentes de la fecha

		// Validar que el número de partes coincida
		if (formatParts.length !== dateParts.length) {
			throw new Error(
				this.#translate("invalid_format", {
					":date": dateString,
					":format": format,
				})
			);
		}

		// Mapa para asociar componentes del formato a índices específicos
		const dateMap = {};

		formatParts.forEach((part, index) => {
			const value = parseInt(dateParts[index], 10);

			if (isNaN(value)) {
				// Es muy difícil que entre aquí la forma de split con expresiones regulares sirve como primer filtro
				throw new Error(
					this.#translate("invalid_date", {
						":date": dateString,
					})
				);
			}

			dateMap[part] = value;
		});

		// Extraer componentes individuales según el formato
		const now = new Date();
		const year = dateMap["yyyy"] || now.getFullYear();
		const month = (dateMap["mm"] || 1) - 1; // Mes es 0-indexado
		const day = dateMap["dd"] || 1;
		const hour =
			dateMap["hh"] !== undefined ? dateMap["hh"] : now.getHours(); // Hora actual si no se especifica
		const minute =
			dateMap["ii"] !== undefined ? dateMap["ii"] : now.getMinutes(); // Minuto actual si no se especifica
		const second =
			dateMap["ss"] !== undefined ? dateMap["ss"] : now.getSeconds(); // Segundo actual si no se especifica

		// Validación adicional: Fecha válida
		const constructedDate = new Date(
			year,
			month,
			day,
			hour,
			minute,
			second
		);

		if (
			constructedDate.getFullYear() !== year ||
			constructedDate.getMonth() !== month ||
			constructedDate.getDate() !== day
		) {
			throw new Error(
				this.#translate("invalid_date", {
					":date": dateString,
				})
			);
		}

		return constructedDate;
	}

	/**
	 * Convierte una fecha a un formato legible
	 * @param {string|Date} date Fecha en formato ISO o un objeto Date
	 * @returns {string} Fecha en formato legible
	 */
	formatDate(date) {
		const d = new Date(date);
		return d.toLocaleString(DateTime.lang, {
			dateStyle: "long",
			timeStyle: "short",
		});
	}
}

const datetime = (dateString, format) => new DateTime(dateString, format);

// Exportar para CommonJS (require)
if (typeof module === "object" && module.exports) {
	module.exports = { DateTime, datetime };
}

window.DateTime = DateTime;
window.datetime = datetime;

export { DateTime, datetime };

// ES Module Export (para import) // no usar para tener compatibilidad con require
// export default DateTime;

// Exportación Universal (UMD)
// if (typeof module === "object" && typeof module.exports === "object") {
// 	// CommonJS (Node.js)
// 	module.exports = { DateTime, datetime };
// } else if (typeof define === "function" && define.amd) {
// 	// AMD (Asynchronous Module Definition)
// 	define([], function () {
// 		return DateTime;
// 	});
// } else {
// 	// Variable Global (para navegadores)
// 	if (typeof window !== "undefined") {
// 		window.DateTime = DateTime;
// 		window.datetime = datetime;
// 	}
// 	if (typeof self !== "undefined") {
// 		self.DateTime = DateTime;
// 		self.datetime = datetime;
// 	}
// }
