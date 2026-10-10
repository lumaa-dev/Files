import { password } from "../config.json";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
	const auth = getHeader(event, "Authorization");
	if (auth !== password) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const query = getQuery(event);
	const target = typeof query.path === "string" ? query.path : "";
	if (!target) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing path",
		});
	}

	// Prevent path traversal outside of userfiles
	const baseDir = path.join(process.cwd(), "userfiles");
	const filePath = path.normalize(path.join(baseDir, target));

	if (!filePath.startsWith(baseDir + path.sep)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid path",
		});
	}

	if (!fs.existsSync(filePath)) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not Found",
		});
	}

	if (!fs.statSync(filePath).isFile()) {
		throw createError({
			statusCode: 400,
			statusMessage: "Not a file",
		});
	}

	fs.unlinkSync(filePath);
	return { deleted: target };
});
