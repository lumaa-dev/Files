import { password, obfuscateName } from "../config.json";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
	const auth = await getHeader(event, "Authorization");
	if (auth !== password) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const query = getQuery(event);
	const subDir = typeof query.to === "string" ? query.to : "";

	// Resolve target directory, preventing path traversal outside of userfiles
	const baseDir = path.join(process.cwd(), "userfiles");
	const targetDir = subDir
		? path.normalize(path.join(baseDir, subDir))
		: baseDir;

	if (!targetDir.startsWith(baseDir)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid target directory",
		});
	}

	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	const files = await readMultipartFormData(event);
	if (!files || files.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "No files uploaded",
		});
	}

	const results = files.map((file) => {
		const originalName = file.filename ?? "unknown_file";
		const fileName =
			obfuscateName || originalName === "favicon.ico"
				? `${randomizedName()}${getFullExtension(originalName)}`
				: originalName;

		const filepath = path.join(targetDir, fileName);
		fs.writeFileSync(filepath, file.data);

		return {
			name: fileName,
			size: file.data.length, // octets
			isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(originalName),
			isVideo: /\.(mp4|mov|mkv|avi|webm)$/i.test(originalName),
		};
	});

	return results;
});

function randomizedName(): string {
	let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_0123456789";

	var finalName = "";
	for (let i = 0; i < Math.round(Math.random() * 10) + 5; i++) {
		// 5-15 name
		let selChar = chars[Math.round(Math.random() * (chars.length - 1))];
		finalName += selChar;
	}

	return finalName;
}

function getFullExtension(filename: string): string | null {
	const match = filename.match(/\.[a-z]+$/);
	return match ? `${match[0]}` : null;
}
