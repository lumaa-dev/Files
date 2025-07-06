import { password } from "../admin.json";
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
  const filepath = path.join(process.cwd(), "/userfiles", file.filename ?? "unknown_file");
  fs.writeFileSync(filepath, file.data);

  return {
    name: file.filename ?? "unknown_file",
    size: file.data.length, // octets
    isImage: file.filename ? /\.(jpg|jpeg|png|gif|webp)$/i.test(file.filename) : false,
  }
})
