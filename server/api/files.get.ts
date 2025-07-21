import fs from "fs"

export default defineEventHandler(async (event) => {
  let dirPath = "./userfiles"

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return []
  }

  let results = fs.readdirSync(dirPath).map((file) => {
    return {
      name: file,
      size: fs.statSync(`${dirPath}/${file}`).size, // octets
      shortSize: formatBytes(fs.statSync(`${dirPath}/${file}`).size), // formatted
      modified: fs.statSync(`${dirPath}/${file}`).mtime,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
      isVideo: /\.(mp4|mov|mkv|avi|webm)$/i.test(file)
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