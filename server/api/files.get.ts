import fs from "fs"
import path from "path";

export default defineEventHandler(async (event) => {
  const { append } = getQuery(event);

  const dirPath = path.resolve(`./userfiles${append ? append : ""}`)
  console.log(dirPath);

  if (!fs.existsSync(dirPath) && !append) {
    fs.mkdirSync(dirPath, { recursive: true })
    return []
  } else if (!fs.existsSync(dirPath) && append) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "No such file or directory"
    })
  }

  let results = fs.readdirSync(dirPath).map((file) => {
    const stats = fs.statSync(`${dirPath}/${file}`);

    return {
      name: file,
      size: stats.size, // octets
      shortSize: formatBytes(stats.size), // formatted
      modified: stats.mtime,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && stats.isFile(),
      isVideo: /\.(mp4|mov|mkv|avi|webm)$/i.test(file) && stats.isFile(),
      isDirectory: stats.isDirectory()
    }
  })
  
  return results.sort((a, b) => b.modified.getTime() - a.modified.getTime())
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