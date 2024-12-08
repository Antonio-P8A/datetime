#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

publishTranslations = (targetDir = "./translations") => {
	const sourcePath = path.resolve(__dirname, "./translations.json"); // Ruta del archivo original
	const targetPath = path.resolve(
		process.cwd(),
		targetDir,
		"translations.json"
	); // Ruta destino

	try {
		// Crear directorio si no existe
		fs.mkdirSync(path.dirname(targetPath), {
			recursive: true,
		});

		// Copiar archivo
		fs.copyFileSync(sourcePath, targetPath);

		console.log(`Translations have been published to: ${targetPath}`);
	} catch (error) {
		console.error("Error publishing translations:", error.message);
	}
};

// Ejecutar el comando
publishTranslations();
