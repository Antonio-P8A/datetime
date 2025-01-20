/**
 * @version: 1.0.12
 * @author: Antonio Peña https://www.ajdev.es/
 * @copyright: Copyright (c) 2024 Antonio Peña. Todos los derechos reservados.
 * @license: Licensed under the MIT license.
 * You may obtain a copy of the License at
 * https://opensource.org/licenses/MIT
 */

// const language = navigator.language ?? "es-ES";
// const translate = require("./lang/" + language.split("-", 1));

class DateTime {
	#date = null;
	#format = null;
	localLang = null;
	static lang = navigator.language ?? "es-ES";
	static translate = require("./lang/" + DateTime.lang.split("-", 1));
	// static translate = translations;

	/**
	 * Construye la instancia con una fecha a partir de un formato dado
	 *
	 * @param {string} dateString Fecha a crear por defecto crea fecha actual
	 * @param {string} format Formato en que se ingresa la fecha
	 */
	constructor(dateString = null, format = "yyyy/mm/dd") {
		this.#format = format;

		if (dateString && format) {
			this.#date = this.#parseDate(dateString, format);
		} else {
			this.#date = new Date(); // Fecha actual por defecto
		}

		// Crear alias para repetir métodos
		this.currentDate = this.dateFormat.bind(this);
		this.today = this.dateFormat.bind(this);
		this.now = this.dateFormat.bind(this);
		this.defaultLang = DateTime.defaultLang.bind(this);
		this.setTranslate = DateTime.setTranslate.bind(this);
	}

	/**
	 * Establece el idioma de la fecha, static para la instancia
	 *
	 * @param {string} lang Idioma a establecer
	 */
	static defaultLang(lang) {
		try {
			DateTime.lang = lang;
			DateTime.translate = require("./lang/" + lang.split("-", 1));
		} catch (error) {
			DateTime.lang = "es-ES";
			console.error("Idioma no soportado");
		}
	}

	/**
	 * Establece el idioma de la fecha, método para la instancia y función
	 *
	 * @param {string} lang Idioma a establecer
	 * @returns {DateTime} Retorna la instancia
	 */
	setLang(lang) {
		try {
			this.localLang = lang;
			this.translate = require("./lang/" + lang.split("-", 1));
		} catch (error) {
			this.localLang = "es-ES";
			console.error(`Idioma ${lang} no soportado`);
		}

		return this;
	}

	/**
	 * Traducciones personalizadas, static para la instancia
	 *
	 * @param {string} translate Idioma a establecer
	 */
	static setTranslate(translate) {
		DateTime.translate = translate;
	}

	/**
	 * Traduce un mensaje a un idioma específico
	 *
	 * @param {string} key Clave del mensaje
	 * @param {object} variables Objeto con las variables a reemplazar
	 * @returns {string} Mensaje traducido
	 */
	#translate(key, variables = {}) {
		const messages = this.translate || DateTime.translate || {};
		let message = messages[key] || key;

		Object.entries(variables).forEach(([placeholder, value]) => {
			message = message.replace(`${placeholder}`, value);
		});

		return message;
	}

	/**
	 * Método privado para crear una fecha según el formato
	 *
	 * @param {string} dateString Fecha en formato ISO
	 * @param {string} format Formato de fecha
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
	 * Mostrar la fecha como string
	 *
	 * @param {boolean} hour12 True muestra AM/PM, False 24H. Por defecto es 24H
	 * @returns {string} Retorna formato local
	 */
	dateFormat(hour12 = false) {
		let formatter = new Intl.DateTimeFormat(
			this.localLang ?? DateTime.lang,
			{
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: hour12, // Cambia a true para formato de 12 horas
			}
		);

		return formatter.format(this.#date).replace(",", "");
	}

	/**
	 * Convierte una fecha a un formato legible
	 *
	 * @param {string|Date} date Fecha en formato ISO o un objeto Date
	 * @returns {string} Fecha en formato legible
	 */
	toString(date) {
		const d = new Date(date ?? this.#date);
		return d.toLocaleString(this.localLang ?? DateTime.lang, {
			dateStyle: "long",
			timeStyle: "short",
		});
	}

	/**
	 * Retorna la fecha en un formato específico
	 *
	 * @param {string} format Formato de fecha
	 * @returns {string} Fecha en formato específico
	 */
	format(format = this.#format) {
		const options = {
			d: this.#date.getDate(),
			dd: String(this.#date.getDate()).padStart(2, "0"),
			m: this.#date.getMonth() + 1,
			mm: String(this.#date.getMonth() + 1).padStart(2, "0"),
			mmm: this.#translate("m" + this.#date.getMonth()).slice(0, 3),
			mmmm: this.#translate("m" + this.#date.getMonth()),
			yyy: this.#date.getFullYear(),
			yyyy: this.#date.getFullYear(),
			yy: String(this.#date.getFullYear()).slice(-2),
			h: this.#date.getHours() % 12 || 12, // Hora en formato 12 horas sin ceros
			hh: String(this.#date.getHours() % 12 || 12).padStart(2, "0"), // Hora en formato 12 horas con ceros iniciales
			H: this.#date.getHours(), // Hora en formato 24 horas sin ceros
			HH: String(this.#date.getHours()).padStart(2, "0"), // Hora en formato 24 horas con ceros iniciales
			i: this.#date.getMinutes(),
			ii: String(this.#date.getMinutes()).padStart(2, "0"),
			s: this.#date.getSeconds(),
			ss: String(this.#date.getSeconds()).padStart(2, "0"),
			ddd: this.#translate("d" + this.#date.getDay()).slice(0, 3),
			dddd: this.#translate("d" + this.#date.getDay()),
			a: this.#date.getHours() >= 12 ? "PM" : "AM",
			aa: this.#date.getHours() >= 12 ? "pm" : "am",
		};

		// Detectar y mantener las partes escapadas intactas
		return format.replace(
			/\\.|d{1,4}|m{1,4}|y{2,4}|h{1,2}|H{1,2}|i{1,2}|s{1,2}|a{1,2}/gi,
			(match) => {
				if (match.startsWith("\\")) {
					// Eliminar el escape y devolver el texto literal
					return match.slice(1);
				}
				// Reemplazar el marcador por su valor correspondiente o devolver el marcador original
				return options[match] || match;
			}
		);
	}

	/**
	 * Modificar la fecha
	 *
	 * @param {string} type Tipo de valor a añadir
	 * @param {number} value Valor absoluto redondeado para sumar
	 * @returns {DateTime} Retorna la instancia
	 */
	#alterateDate(type, value) {
		value = Math.round(value);
		const date = this.#date;

		switch (type) {
			case "years":
				date.setFullYear(date.getFullYear() + value);
				break;
			case "months":
				date.setMonth(date.getMonth() + value);
				break;
			case "days":
				date.setDate(date.getDate() + value);
				break;
			case "hours":
				date.setHours(date.getHours() + value);
				break;
			case "minutes":
				date.setMinutes(date.getMinutes() + value);
				break;
			case "seconds":
				date.setSeconds(date.getSeconds() + value);
				break;
			case "quarters":
				date.setMonth(date.getMonth() + value * 3);
				break;
			case "weeks":
				date.setDate(date.getDate() + value * 7);
				break;
			case "milliseconds":
				date.setMilliseconds(date.getMilliseconds() + value);
				break;
			default:
				break;
		}

		return this;
	}

	/**
	 * Añadir valores a la fecha
	 *
	 * @param {string} type Tipo de valor a añadir
	 * @param {number} value Valor absoluto redondeado para sumar
	 * @returns {DateTime} Retorna la instancia
	 */
	add(type, value) {
		value = Math.round(Math.abs(value));
		return this.#alterateDate(type, value);
	}

	/**
	 * Restar valores a la fecha
	 *
	 * @param {string} type Tipo de valor a añadir
	 * @param {number} value Valor absoluto redondeado para sumar
	 * @returns {DateTime} Retorna la instancia
	 */
	subtract(type, value) {
		value = Math.round(Math.abs(value)) * -1;
		return this.#alterateDate(type, value);
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
