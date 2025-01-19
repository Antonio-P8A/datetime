import { DateTime, datetime } from "../src/app.js";

console.log("Desarrollo");
console.log("**********");
console.log("instancia");
// DateTime.translate = require("./lang/en");
// const DT = new DateTime();
// console.log(DT.toString());
// const DT1 = new DateTime("1989/06/02");
// console.log(DT1.toString());
// const DT2 = new DateTime("1989/26/02", "yyyy/dd/mm");
// console.log(DT2.toString());
// DateTime.defaultLang("en-ES");
// const DT3 = new DateTime("02/06/1989", "dd/mm/yyyy");
// console.log(DT3.setLang("en-ES").toString());
// const DT4 = new DateTime("06/30/1989", "mm/dd/yyyy");
// console.log(DT4.toString());

console.log("-*-*-*-*-*-*-*-*-*-*-*-*-");
console.log("función");
// console.log(datetime());
// console.log(datetime().now());
// console.log(datetime().today());
// console.log(datetime().currentDate());
// console.log(datetime().toString());
// console.log(datetime("1989/06/22").toString());
// console.log(datetime("1987/29/05", "yyyy/dd/mm").toString());
// console.log(datetime("15/05/2009", "dd/mm/yyyy").toString());
// console.log(datetime("03/18/2018", "mm/dd/yyyy").toString());
// console.log(datetime("07/2024/24 15:10:05", "mm/yyyy/dd hh:ii:ss").toString());
// console.log(datetime("01/21/2023 16:20", "mm/dd/yyyy hh:ii").toString());
// console.log(datetime("12/24/2024 20", "mm/dd/yyyy hh").toString(true));
// console.log(datetime("12/24/2024", "dd/mm/yyyy").toString(true));
// DateTime.defaultLang("en-EN");
// DateTime.translate = require("./lang/fr");
// datetime().setTranslate(require("./lang/fr"));
let dt = datetime("12/24/2024", "mm/dd/yyyy");
// console.log(dt.format("d-m-yyyy"));
console.log(dt.setLang("en-ES").toString());
// console.log(datetime().format("dddd, dd mmmm yyyy"));
// console.log(datetime().format("ddd, dd-mmm-yy, h:i:s"));
// console.log(datetime().format("h:ii:ss"));
// console.log(datetime().format("d-m-yy"));
// console.log(datetime().format("yyyy/mm/dd, h:i:s"));
// console.log(datetime().format("dd/mm/yyyy h:i:s"));
console.log(
	datetime()
		.setLang("en-ES")
		.format("\\To\\d\\a\\y \\i\\s mmmm dd of yyyy \\at HH:ii:ss")
);
console.log("Español");
console.log(
	datetime().format(
		"\\Hoy e\\s dddd dd \\de mmmm \\del yyyy \\a l\\a\\s h:i:ss a"
	)
);
console.log(
	datetime("02-06-1989 06:00:00", "dd-mm-yyyy hh:ii:ss").format(
		"dddd dd \\de mmmm \\del yyyy \\a l\\a\\s HH:ii:ss"
	)
);
