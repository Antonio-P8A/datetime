const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const os = require("os");

const copyLangDirectory = () => {
	const targetDir = path.resolve("./lang");

	if (fs.existsSync(targetDir)) {
		console.log("El directorio 'lang' ya existe.");
		return;
	}

	// Detectar sistema operativo
	const platform = os.platform();
	const linuxCommand = "cp -R ./dist/lang ./lang";
	const windowsCommand = "xcopy .\\dist\\lang .\\lang /E /I";
	const command = platform === "win32" ? windowsCommand : linuxCommand;

	exec(command, (error, stdout, stderr) =>
		console.error(
			error?.message ?? stderr
				? stderr
				: "Idiomas publicados correctamente."
		)
	);
};

copyLangDirectory();
