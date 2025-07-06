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
      modified: fs.statSync(`${dirPath}/${file}`).mtime,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    }
  })
  
  return results.sort((a, b) => b.modified.getTime() - a.modified.getTime())
})
