// server/routes/files/[file].ts
import { defineEventHandler, getRouterParam, sendStream, setHeader } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

// Types the browser can render natively — served inline with correct MIME type
const INLINE_MIME: Record<string, string> = {
  // Text/code (rendered as plain text so HTML isn't executed)
  '.html': 'text/plain',
  '.htm':  'text/plain',
  '.css':  'text/plain',
  '.js':   'text/plain',
  '.ts':   'text/plain',
  '.jsx':  'text/plain',
  '.tsx':  'text/plain',
  '.json': 'text/plain',
  '.xml':  'text/plain',
  '.svg':  'text/plain',
  '.txt':  'text/plain',
  '.md':   'text/plain',
  '.csv':  'text/plain',
  '.yaml': 'text/plain',
  '.yml':  'text/plain',
  '.toml': 'text/plain',
  '.ini':  'text/plain',
  '.sh':   'text/plain',
  '.py':   'text/plain',
  '.rb':   'text/plain',
  '.rs':   'text/plain',
  '.go':   'text/plain',
  '.java': 'text/plain',
  '.c':    'text/plain',
  '.cpp':  'text/plain',
  '.h':    'text/plain',
  // Images
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.bmp':  'image/bmp',
  '.avif': 'image/avif',
  // Video
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.ogg':  'video/ogg',
  '.mov':  'video/quicktime',
  // Audio
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.flac': 'audio/flac',
  '.aac':  'audio/aac',
  // Documents
  '.pdf':  'application/pdf',
}

export default defineEventHandler((event) => {
  const fileName = getRouterParam(event, 'file')
   const filePath = path.resolve("./userfiles/" + fileName);

  if (!fs.existsSync(filePath)) {
    event.node.res.statusCode = 404
    return 'File not found'
  }

  const ext = path.extname(filePath).toLowerCase()
  const mimeType = INLINE_MIME[ext]

  // Unknown/unsupported type — force download instead of guessing
  if (!mimeType) {
    event.node.res.statusCode = 415
    return `Unsupported file type: ${ext || '(no extension)'}`
  }

  const stat = fs.statSync(filePath)

  setHeader(event, 'Content-Type', mimeType)
  setHeader(event, 'Content-Disposition', `inline; filename="${fileName}"`)
  setHeader(event, 'Content-Length', stat.size)

  return sendStream(event, fs.createReadStream(filePath))
})