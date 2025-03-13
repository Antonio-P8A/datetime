import { DateTime, datetime } from "../src/app.js";

// console.log("Desarrollo");
// console.log("**********");
console.log("instancia");
// DateTime.translate = require("./lang/en");
// DateTime.defaultLang("en-ES");
const DT = new DateTime();
DT.setYear(2024);
console.log(DT.clone().setYear("2026z").toString());
console.log(DT.toString());
// const DT1 = new DateTime("1989/06/02");
// DT1.defaultLang("en")
// console.log(DT1.setLang("es").format("dddd mmmm dd/mm/yyyy hh:ii:ss aa"));
// const DT2 = new DateTime("1989/26/02", "yyyy/dd/mm");
// console.log(DT2.format("dd-mm-yyyy HH:ii:ss"));
// console.log("cambio de idioma")
// const DT3 = new DateTime("02/06/1989", "dd/mm/yyyy");
// DT3.defaultLang("en-EN");
// console.log(DT3.setLang("en-ES").toString());
// const DT4 = new DateTime("06/30/1989", "mm/dd/yyyy");
// console.log(DT4.add("years", 1).toString());
// console.log(DT4.toString());

// console.log("-*-*-*-*-*-*-*-*-*-*-*-*-");
// console.log("-*-*-*-*-*-*-*-*-*-*-*-*-");
// console.log("función");
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
// datetime().defaultLang("es-EN");
// DateTime.defaultLang("es-EN");
// DateTime.translate = require("./lang/fr");
// datetime().setTranslate(require("./lang/fr"));
// let dt = datetime()
// .subtract("years", -4)
// .subtract("months", 3)
// .subtract("days", -4)
// .subtract("hours", 1)
// .subtract("minutes", 5)
// .subtract("seconds", 1)
// .subtract("milliseconds", 3000)
// .subtract("quarters", 2)
// .format("dddd dd \\de mmmm \\de yyyy \\a l\\a\\s hh:ii:ss aa => HH:ii:ss");
// console.log(dt);
// console.log(
// 	datetime()
// 		.setLang("en-ES")
// 		.add("years", 2)
// 		.format("ddd dd \\de mmmm \\de yyyy")
// );
// console.log(datetime().format("dddd, dd mmmm yyyy"));
// console.log(datetime().format("ddd, dd-mmm-yy, h:i:s"));
// console.log(datetime().format("h:ii:ss"));
// console.log(datetime().format("hh:ii:ss"));
// console.log(datetime().format("HH:ii:ss"));
// console.log(datetime().format("ddd-mmm-yyyy"));
// console.log(datetime().format("dd-mmmm-yyyy"));
// console.log(datetime().format("dd-mmmm-yyy"));
// console.log(datetime().format("dd/m/yyy"));
// console.log(datetime().format("yyyy/mm/dd, h:i:s"));
// console.log(datetime().format("dd/mm/yyyy h:i:s"));
// console.log(
// 	datetime()
// 		.setLang("en-ES")
// 		.format("\\To\\d\\a\\y \\i\\s mmmm dd of yyyy \\at HH:ii:ss")
// );
// console.log("Español");
// console.log(
// 	datetime().format(
// 		"\\Hoy e\\s dddd dd \\de mmmm \\del yyyy \\a l\\a\\s h:i:ss a"
// 	)
// );
// console.log(
// 	datetime("02-06-1989 06:00:00", "dd-mm-yyyy hh:ii:ss").format(
// 		"dddd dd \\de mmmm \\del yyyy \\a l\\a\\s HH:ii:ss"
// 	)
// );
// let dt = datetime();
// console.log("clonar");
// let dt2 = dt.clone();
// dt.add("years", 2);
// console.log(
// 	dt.format("dddd dd \\de mmmm \\de yyyy \\a l\\a\\s hh:ii:ss aa => HH:ii:ss")
// );
// dt2.add("years", 1).setLang("en-EN");
// console.log(
// 	dt2.format(
// 		"dddd dd \\de mmmm \\de yyyy \\a l\\a\\s hh:ii:ss a => HH:ii:ss"
// 	)
// );
// let d = new Date();
// console.log(d);
// let dt3 = datetime(d);
// console.log(dt3.toString());
