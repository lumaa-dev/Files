// server/routes/[file].ts  (or pages/[file].vue with a server handler)
import { defineEventHandler, getRouterParam } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { ServerResponse } from 'node:http'

export default defineEventHandler((event) => {
  const fileName = getRouterParam(event, 'file')

  // Your specific file path
  const filePath = path.resolve("./userfiles/" + fileName);
  console.log(filePath);
  
  // Check file exists
  if (!fs.existsSync(filePath)) {    
    event.node.res.statusCode = 404
    return 'File not found'
  }

  const stat = fs.statSync(filePath)
  const res: ServerResponse = event.node.res

  // Force download (not preview) with Content-Disposition: attachment
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Length', stat.size)

  // Stream the file into the response
  const stream = fs.createReadStream(filePath)
  stream.pipe(res)

  // Return nothing — h3 won't interfere since we're writing directly
  return sendStream(event, stream)
})