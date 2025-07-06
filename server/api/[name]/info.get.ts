import fs from "fs";

export default defineEventHandler(async (event) => {
   const fileName = getRouterParam(event, "name");
   let dirPath = "./userfiles"

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return []
  }

  const results = fs.readdirSync(dirPath).filter(file => file === fileName).map((file) => {
    return {
      name: file,
      size: fs.statSync(`${dirPath}/${file}`).size, // octets
      modified: fs.statSync(`${dirPath}/${file}`).mtime,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
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
