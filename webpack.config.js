const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
	const isProduction = argv.mode === "production";

	return {
		mode: isProduction ? "production" : "development",
		entry: isProduction
			? path.resolve(__dirname, "src/app.js") // Para producción
			: path.resolve(__dirname, "test/index.js"), // Para desarrollo
		output: {
			path: isProduction
				? path.resolve(__dirname, "dist") // Salida en dist para producción
				: path.resolve(__dirname, "test"), // Salida en test para desarrollo
			filename: "datetime.js",
			clean: isProduction, // Limpia la carpeta de salida en producción
		},
		devtool: isProduction ? false : "source-map",
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										targets: "> 0.25%, not dead", // Compatibilidad con navegadores antiguos
										useBuiltIns: "usage",
										corejs: "3.30", // Polyfills automáticos con core-js
									},
								],
							],
						},
					},
				},
			],
		},
		plugins: [
			new CopyWebpackPlugin({
				patterns: [{ from: "src/lang", to: "lang" }],
			}),
		],
		devServer: {
			allowedHosts: "all",
			client: {
				overlay: {
					errors: true,
					warnings: true,
				},
				progress: false,
				reconnect: true,
			},
			compress: true,
			devMiddleware: {
				writeToDisk: true,
			},
			host: "0.0.0.0",
			hot: false,
			liveReload: true,
			open: false,
			port: 8085,
			watchFiles: {
				paths: ["src", "test"],
				options: {
					alwaysStat: true,
					usePolling: false,
				},
			},
		},
		stats: {
			errorDetails: true,
		},
		optimization: {
			minimize: isProduction, // Minificación solo en producción
		},
	};
};
