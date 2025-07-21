import { password, obfuscateName } from "../config.json";
import path from "path";
import fs from "fs"

export default defineEventHandler(async (event) => {
  const auth = await getHeader(event, "Authorization")
  if (auth !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  let dirPath = "./userfiles"
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No files uploaded"
    });
  }

  const file = files[0];
  const fileName = (obfuscateName || (file.filename ?? "unknown_file") == "favicon.ico") ? `${randomizedName()}${getFullExtension(file.filename ?? "unknown_file")}` : (file.filename ?? "unknown_file")
  const filepath = path.join(process.cwd(), "/userfiles", fileName);
  fs.writeFileSync(filepath, file.data);

  return {
    name: fileName,
    size: file.data.length, // octets
    isImage: file.filename ? /\.(jpg|jpeg|png|gif|webp)$/i.test(file.filename) : false,
    isVideo: file.filename ? /\.(mp4|mov|mkv|avi|webm)$/i.test(file.filename) : false
  }
})

function randomizedName(): string {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_0123456789";

  var finalName = ""
  for (let i = 0; i < Math.round(Math.random() * 10) + 5; i++) { // 5-15 name
    let selChar = chars[Math.round(Math.random() * (chars.length - 1))]
    finalName += selChar;
  }

  return finalName;
}

function getFullExtension(filename: string): string | null {
  const match = filename.match(/\.[a-z]+$/);
  return match ? `.${match[0]}` : null;
}