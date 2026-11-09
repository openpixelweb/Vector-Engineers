const router = require('express').Router();
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const { requireAdmin, requireSuperAdmin } = require('../middleware/require-admin');

// Phase 6 development storage: only safe, known formats are accepted.
// Files are public once uploaded. Do not upload confidential or draft-only documents.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1, fields: 1, parts: 2 },
}).single('file');
const baseDirectory = path.resolve(process.env.MEDIA_DIR || path.join(process.cwd(), 'uploads'));
const formats = {
  jpeg: { ext: 'jpg', type: 'image/jpeg', kind: 'image' },
  png: { ext: 'png', type: 'image/png', kind: 'image' },
  webp: { ext: 'webp', type: 'image/webp', kind: 'image' },
  pdf: { ext: 'pdf', type: 'application/pdf', kind: 'document' },
};
function detect(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return formats.jpeg;
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return formats.png;
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return formats.webp;
  if (buffer.toString('ascii', 0, 5) === '%PDF-') return formats.pdf;
  return null;
}
router.use(requireAdmin, requireSuperAdmin);
router.post('/', (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      const status = err instanceof multer.MulterError ? 400 : 500;
      return res.status(status).json({ success: false, message: err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds 15 MB upload limit' : 'Invalid upload: ' + err.message });
    }
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'Choose a file (field name: file)' });
      const found = detect(req.file.buffer);
      const desiredKind = req.query.kind === 'document' ? 'document' : req.query.kind === 'image' ? 'image' : null;
      if (!desiredKind) return res.status(400).json({ success: false, message: 'Specify ?kind=image or ?kind=document' });
      if (!found || found.kind !== desiredKind) return res.status(400).json({ success: false, message: 'Allowed: JPG, PNG, WebP images, or PDF documents only' });
      const allowedMimeTypes = found.kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'] : ['application/pdf', 'application/octet-stream'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) return res.status(400).json({ success: false, message: 'File type does not match content' });
      if (found.kind === 'image' && req.file.size > 5 * 1024 * 1024) return res.status(400).json({ success: false, message: 'Image limit: 5 MB' });
      if (found.kind === 'document' && req.file.size > 15 * 1024 * 1024) return res.status(400).json({ success: false, message: 'PDF limit: 15 MB' });
      const directory = path.join(baseDirectory, found.kind === 'image' ? 'images' : 'documents');
      await fs.mkdir(directory, { recursive: true });
      const filename = `${crypto.randomUUID()}.${found.ext}`;
      const target = path.join(directory, filename);
      await fs.writeFile(target, req.file.buffer, { flag: 'wx', mode: 0o644 });
      const publicPath = `/media/${found.kind === 'image' ? 'images' : 'documents'}/${filename}`;
      return res.status(201).json({ success: true, data: { url: publicPath, fileName: filename, kind: found.kind, contentType: found.type, size: req.file.size } });
    } catch (error) { next(error); }
  });
});
module.exports = { router, baseDirectory };
