/**
 * @version: 1.0.12
 * @author: Antonio Peña https://www.ajdev.es/
 * @copyright: Copyright (c) 2024 Antonio Peña. Todos los derechos reservados.
 * @license: Licensed under the MIT license.
 * You may obtain a copy of the License at
 * https://opensource.org/licenses/MIT
 */

class DateTime {
	#date = null;
	#format = null;
	localLang = null;
	static lang = navigator.language ?? "es-ES";
	static translate = require("./lang/" + DateTime.lang.split("-", 1)); // obtener solo "es"
	// static translate = translations;

	/**
	 * Construye la instancia con una fecha a partir de un formato dado
	 *
	 * @param {string} dateString Fecha a crear por defecto crea fecha actual
	 * @param {string} format Formato en que se ingresa la fecha
	 */
	constructor(dateString = null, format = "yyyy/mm/dd") {
		this.#format = format;

		if (dateString instanceof Date) {
			this.#date = new Date(dateString); // Clonar la instancia de Date
		} else if (typeof dateString === "string" && format) {
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
	 * Establece el idioma de la fecha, static para la clase
	 * respetando el método setLang que actúa sobre la instancia
	 *
	 * @param {string} lang Idioma a establecer
	 */
	static defaultLang(lang) {
		try {
			DateTime.lang = lang;
			DateTime.translate = require("./lang/" + lang.split("-", 1));
		} catch (error) {
			DateTime.lang = "es-ES";
			console.error(`Idioma ${lang} no soportado`);
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
	 * Traducciones personalizadas, static para la clase
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
	 * @param {boolean} h12 True muestra AM/PM, False 24H. Por defecto es 24H
	 * @returns {string} Retorna formato local
	 */
	dateFormat(h12 = false) {
		let formatter = new Intl.DateTimeFormat(
			this.localLang ?? DateTime.lang,
			{
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: h12, // Cambia a true para formato de 12 horas
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
			a:
				this.#date.getHours() >= 12
					? this.#translate("PM1")
					: this.#translate("AM1"),
			aa:
				this.#date.getHours() >= 12
					? this.#translate("pm")
					: this.#translate("am"),
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
	 * @param {number} value Valor redondeado para sumar o restar
	 * @param {boolean} set Por defecto es null, si es true solo setea el valor
	 * @returns {DateTime} Retorna la instancia
	 */
	#alterateDate(type, value, set = null) {
		const date = this.#date;

		if (isNaN(value)) {
			throw new Error(this.#translate("is_nan"));
		}

		// Validar el tipo y setear el valor si set es true se suma 0 al valor de lo contrario se obtiene el valor de la instancia y se le suma o resta el valor dato
		switch (type) {
			case "years":
				date.setFullYear((set ? 0 : date.getFullYear()) + value);
				break;
			case "months":
				date.setMonth((set ? 0 : date.getMonth()) + value);
				break;
			case "days":
				date.setDate((set ? 0 : date.getDate()) + value);
				break;
			case "hours":
				date.setHours((set ? 0 : date.getHours()) + value);
				break;
			case "minutes":
				date.setMinutes((set ? 0 : date.getMinutes()) + value);
				break;
			case "seconds":
				date.setSeconds((set ? 0 : date.getSeconds()) + value);
				break;
			case "quarters":
				date.setMonth((set ? 0 : date.getMonth()) + value * 3);
				break;
			case "weeks":
				date.setDate((set ? 0 : date.getDate()) + value * 7);
				break;
			case "milliseconds":
				date.setMilliseconds(
					(set ? 0 : date.getMilliseconds()) + value
				);
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

	/**
	 * Clonar la instancia
	 */
	clone() {
		return new DateTime(this.#date, this.#format);
	}

	/**
	 *  Getters
	 * - getYear() Obtener el año
	 * - getName(type) Nombre del mes o día
	 * - getMonth() (1-12) Obtener el mes
	 * - getDay() (1-7) Obtener el día de la semana
	 * - getDayOfWeek() nombre del día
	 * - getMonthOfYear() nombre del mes
	 * - getHours(type = "24h") Obtener las horas en formato 24h o 12h
	 * - getHours12() Obtener las horas en formato 12h
	 * - getHours24() Obtener las horas en formato 24h
	 * - getMinutes() Obtener los minutos
	 * - getSeconds() Obterner los segundos
	 * - getMilliseconds() Obtener los milisegundos
	 * - getTime() Obtener la hora completa
	 * - getDate() Obtener la fecha
	 * - getWeek() Obtener número de la semana
	 * - getQuarter() Obtener número del trimestre
	 * - getDayOfYear() Obtener el número del día del año
	 * - getDayOfMonth() Obtener el número del día del mes
	 * - getDifference(date, type) Obtener la diferencia entre dos fechas
	 * - getStartOf(type) Obtener el inicio de un periodo
	 * - getEndOf(type) Obtener el final de un periodo
	 * - getStartOfYear() Obtener el inicio del año
	 * - getEndOfYear() Obtener el final del año
	 * - getStartOfMonth() Obtener el inicio del mes
	 * - getEndOfMonth() Obtener el final del mes
	 * - getStartOfDay() Obtener el inicio del día
	 * - getEndOfDay() Obtener el final del día
	 * - getStartOfHour() Obtener el inicio de la hora
	 * - getEndOfHour() Obtener el final de la hora
	 * - getStartOfMinute() Obtener el inicio del minuto
	 * - getEndOfMinute() Obtener el final del minuto
	 * - getStartOfSecond() Obtener el inicio del segundo
	 * - getEndOfSecond() Obtener el final del segundo
	 * - getStartOfWeek() Obtener el inicio de la semana
	 * - getEndOfWeek() Obtener el final de la semana
	 * - getStartOfQuarter() Obtener el inicio del trimestre
	 * - getEndOfQuarter() Obtener el final del trimestre
	 */

	/********************************************
	 *                 Setters                  *
	 ********************************************/

	/**
	 * Establecer el año de la fecha
	 *
	 * @param {number} value el año a establecer
	 * @return {DateTime} Retorna la instancia
	 */
	setYear(value) {
		// El parseInt es para evitar que se pase un string y evitar NaN
		value = Math.round(Math.abs(parseInt(value)));

		return this.#alterateDate("years", value, true);
	}

	/**
	 * Establecer el mes de la fecha dentro del rango 1-12,
	 * Si los días superan el mes se ajusta automáticamente al siguiente mes con la diferencia de días
	 *
	 * @param {number} value el mes a establecer
	 * @return {DateTime} Retorna la instancia
	 */
	setMonth(value) {
		// El parseInt es para evitar que se pase un string y evitar NaN
		value = parseInt(value);

		// Limitar y setear al rango de 1-12
		if (value < 1) {
			value = 1;
		} else if (value > 12) {
			value = 12;
		}

		value = Math.round(Math.abs(value) - 1);

		return this.#alterateDate("months", value, true);
	}

	/**
	 * Establecer el día de la fecha dentro del rango 1-31,
	 * Si los días superan el mes se ajusta automáticamente al mes correspondiente con la diferencia de días
	 *
	 * @param {number} value el día a establecer
	 * @return {DateTime} Retorna la instancia
	 */
	setDay(value) {
		// Limitar y setear al rango de 1-31
		if (value < 1) {
			value = 1;
		} else if (value > 31) {
			value = 31;
		}

		// El parseInt es para evitar que se pase un string y evitar NaN
		value = Math.round(Math.abs(parseInt(value)));

		return this.#alterateDate("days", value, true);
	}

	/*
	 * - setDay(day) Establecer el día
	 * - setHours(hrs) Establecer las horas
	 * - setMinutes(min) Establecer los minutos
	 * - setSeconds(s) Establecer los segundos
	 * - setMilliseconds(ms) Establecer los milisegundos
	 * - setTime(time) Establecer la hora completa
	 * - setDate(date) Establecer la fecha
	 * - startOf(type) Establecer el inicio de un periodo
	 * - endOf(type) Establecer el final de un periodo
	 * - startOfYear() Establecer el inicio del año
	 * - endOfYear() Establecer el final del año
	 * - startOfMonth() Establecer el inicio del mes
	 * - endOfMonth() Establecer el final del mes
	 * - startOfDay() Establecer el inicio del día
	 * - endOfDay() Establecer el final del día
	 * - startOfHour() Establecer el inicio de la hora
	 * - endOfHour() Establecer el final de la hora
	 * - startOfMinute() Establecer el inicio del minuto
	 * - endOfMinute() Establecer el final del minuto
	 * - startOfSecond() Establecer el inicio del segundo
	 * - endOfSecond() Establecer el final del segundo
	 * - startOfWeek() Establecer el inicio de la semana
	 * - endOfWeek() Establecer el final de la semana
	 * - startOfQuarter() Establecer el inicio del trimestre
	 * - endOfQuarter() Establecer el final del trimestre
	 * - nextDay() Establecer el siguiente día
	 * - tomorrow() Establecer el siguiente día
	 * - yesterday() Establecer el día anterior
	 * - nextMonth() Establecer el siguiente mes
	 * - lastMonth() Establecer el mes anterior
	 * - nextYear() Establecer el siguiente año
	 * - lastYear() Establecer el año anterior
	 * - nextWeek() Establecer la siguiente semana
	 * - lastWeek() Establecer la semana anterior
	 * - nextHour() Establecer la siguiente hora
	 * - lastHour() Establecer la hora anterior
	 * - nextMinute() Establecer el siguiente minuto
	 * - lastMinute() Establecer el minuto anterior
	 * - nextSecond() Establecer el siguiente segundo
	 * - lastSecond() Establecer el segundo anterior
	 */

	/**
	 * Métodos que pueden ser útiles de comparación
	 * - isBefore(date, strict = false) Compara si la fecha es anterior a otra
	 * - isAfter(date, strict = false) Compara si la fecha es posterior a otra
	 * - isSame(date, strict = false) Compara si la fecha es igual a otra
	 * - isLeapYear(year = null) Comprueba si el año es bisiesto
	 * - isWeekend(date = null) Comprueba si es fin de semana
	 * - isToday(date = null) Comprueba si es hoy
	 * - isTomorrow(date = null) Comprueba si es mañana
	 * - isYesterday(date = null) Comprueba si es ayer
	 * - isBetween(firstDate, lastDate, strict = false) Comprueba si está entre dos fechas
	 * - isSameOrBefore(date, strict = false) Compara si es igual o anterior a otra fecha
	 * - isSameOrAfter(date, strict = false) Compara si es igual o posterior a otra fecha
	 * - isDifferent(date, strict = false) Compara si es diferente a otra fecha
	 * - isThisWeek() Comprueba si es esta semana
	 * - isNextWeek() Comprueba si es la próxima semana
	 * - isLastWeek() Comprueba si es la semana pasada
	 * - isThisMonth() Comprueba si es este mes
	 * - isNextMonth() Comprueba si es el próximo mes
	 * - isLastMonth() Comprueba si es el mes pasado
	 * - isThisYear() Comprueba si es este año
	 * - isSameYear(date = null) Comprueba si es el mismo año
	 * - isSameMonth(date = null) Comprueba si es el mismo mes
	 * - isSameDay(date = null) Comprueba si es el mismo día
	 * - isSameHour(date = null) Comprueba si es la misma hora
	 */
}

const datetime = (dateString, format) => new DateTime(dateString, format);

// Exportar para CommonJS (require)
if (typeof module === "object" && module.exports) {
	module.exports = { DateTime, datetime };
}

window.DateTime = DateTime;
window.datetime = datetime;

export { DateTime, datetime };
