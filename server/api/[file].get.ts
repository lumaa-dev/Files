import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");

  const fileName = getRouterParam(event, "file");
  let dirPath = "./userfiles"

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    return []
  }

  const results = fs.readdirSync(dirPath).filter(file => file === fileName).map(async (file) => {
    const filePath = path.join(process.cwd(), 'userfiles', file)
    const data = fs.readFileSync(filePath);

    return data;
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
