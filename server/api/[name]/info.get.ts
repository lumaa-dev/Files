import fs from "fs";

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, "name");
  let dirPath = "./userfiles"

  if (!fileName) throw createError({ statusCode: 500, message: "Missing parameter" })

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return []
  }

  const results = fs.readdirSync(dirPath).filter(file => file === decodeURIComponent(fileName)).map((file) => {
    return {
      name: file,
      size: fs.statSync(`${dirPath}/${file}`).size, // octets
      shortSize: formatBytes(fs.statSync(`${dirPath}/${file}`).size), // formatted
      modified: fs.statSync(`${dirPath}/${file}`).mtime,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
      isVideo: /\.(mp4|mov|mkv|avi|webm)$/i.test(file)
    }
  }) || [] 
  
  if (results.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found"
    });
  } else if (results.length == 1) {
    return results[0];
  }

  return results;
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;

  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  let value = bytes;

  do {
    value /= 1024;
    i++;
  } while (value >= 1024 && i < units.length - 1);

  return `${value.toFixed(2)} ${units[i]}`;
}