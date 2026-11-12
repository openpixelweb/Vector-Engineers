
const express = require("express");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");

const { Storage } = require("@google-cloud/storage");

const {
  requireAdmin,
  requireSuperAdmin
} = require("../middleware/require-admin");

// ============================================
// ROUTERS
// ============================================

const router = express.Router();
const publicRouter = express.Router();

// ============================================
// STORAGE CONFIGURATION
// ============================================

const baseDirectory = path.resolve(
  process.env.MEDIA_DIR ||
  path.join(process.cwd(), "uploads")
);

const bucketName = (
  process.env.GCS_BUCKET_NAME || ""
).trim();

// Cloud Run uses Google Cloud Storage.
// Local development can use disk when the
// bucket environment variable is not set.

const useCloudStorage = Boolean(bucketName);

const storage = useCloudStorage
  ? new Storage()
  : null;

const bucket = useCloudStorage
  ? storage.bucket(bucketName)
  : null;

// ============================================
// ALLOWED FILE FORMATS
// ============================================

const formats = {
  jpeg: {
    ext: "jpg",
    type: "image/jpeg",
    kind: "image"
  },

  png: {
    ext: "png",
    type: "image/png",
    kind: "image"
  },

  webp: {
    ext: "webp",
    type: "image/webp",
    kind: "image"
  },

  pdf: {
    ext: "pdf",
    type: "application/pdf",
    kind: "document"
  }
};

// ============================================
// DETECT FILE TYPE FROM CONTENT
// ============================================

function detectFile(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return null;
  }

  // JPEG
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return formats.jpeg;
  }

  // PNG
  const pngSignature = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10
  ]);

  if (
    buffer.subarray(0, 8).equals(pngSignature)
  ) {
    return formats.png;
  }

  // WebP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return formats.webp;
  }

  // PDF
  if (
    buffer.toString("ascii", 0, 5) === "%PDF-"
  ) {
    return formats.pdf;
  }

  return null;
}

// ============================================
// MULTER UPLOAD LIMITS
// ============================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 1,
    fields: 1,
    parts: 2
  }
}).single("file");

// ============================================
// SAVE FILE TO CLOUD STORAGE
// ============================================

async function saveToCloud(objectName, buffer, fileType) {
  const file = bucket.file(objectName);

  await file.save(buffer, {
    resumable: false,
    validation: "crc32c",

    metadata: {
      contentType: fileType.type,

      cacheControl:
        "public, max-age=3600"
    },

    preconditionOpts: {
      ifGenerationMatch: 0
    }
  });

  return file;
}

// ============================================
// SAVE FILE LOCALLY (DEVELOPMENT)
// ============================================

async function saveLocally(objectName, buffer) {
  const target = path.join(
    baseDirectory,
    ...objectName.split("/")
  );

  await fs.mkdir(path.dirname(target), {
    recursive: true
  });

  await fs.writeFile(target, buffer, {
    flag: "wx",
    mode: 0o644
  });
}

// ============================================
// ADMIN AUTHENTICATION
// ============================================

router.use(requireAdmin, requireSuperAdmin);

// ============================================
// ADMIN FILE UPLOAD
// POST /api/v1/admin/media?kind=image
// POST /api/v1/admin/media?kind=document
// ============================================

router.post("/", (req, res, next) => {
  upload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({
        success: false,

        message:
          uploadError.code === "LIMIT_FILE_SIZE"
            ? "File exceeds the 15 MB upload limit."
            : uploadError.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please choose a file."
        });
      }

      const kind = req.query.kind;

      if (
        kind !== "image" &&
        kind !== "document"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Specify ?kind=image or ?kind=document."
        });
      }

      const detected = detectFile(
        req.file.buffer
      );

      if (
        !detected ||
        detected.kind !== kind
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only JPG, PNG, WebP images and PDF documents are supported."
        });
      }

      const allowedMimeTypes =
        kind === "image"
          ? [
              "image/jpeg",
              "image/png",
              "image/webp",
              "application/octet-stream"
            ]
          : [
              "application/pdf",
              "application/octet-stream"
            ];

      if (
        !allowedMimeTypes.includes(
          req.file.mimetype
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "File content type does not match."
        });
      }

      const maxSize =
        kind === "image"
          ? 5 * 1024 * 1024
          : 15 * 1024 * 1024;

      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,

          message:
            kind === "image"
              ? "Image size must be below 5 MB."
              : "PDF size must be below 15 MB."
        });
      }

      // Create a unique filename to avoid overwrites.
      const fileName =
        `${crypto.randomUUID()}.${detected.ext}`;

      const folder =
        kind === "image"
          ? "images"
          : "documents";

      const objectName =
        `${folder}/${fileName}`;

      // Save to permanent storage in production.
      if (useCloudStorage) {
        await saveToCloud(
          objectName,
          req.file.buffer,
          detected
        );
      } else {
        if (process.env.NODE_ENV === "production") {
          return res.status(503).json({
            success: false,
            message:
              "Production storage is not configured. Set GCS_BUCKET_NAME."
          });
        }

        await saveLocally(
          objectName,
          req.file.buffer
        );
      }

      // Preserve the exact existing URL format.
      const publicPath =
        `/media/${objectName}`;

      return res.status(201).json({
        success: true,

        data: {
          url: publicPath,
          fileName,
          kind,
          contentType: detected.type,
          size: req.file.size,
          storage: useCloudStorage
            ? "google-cloud-storage"
            : "local"
        }
      });
    } catch (error) {
      console.error(
        "Media upload failed:",
        error
      );

      next(error);
    }
  });
});

// ============================================
// PUBLIC MEDIA FILE DELIVERY
// GET /media/images/:filename
// GET /media/documents/:filename
// ============================================

publicRouter.get(
  "/:folder/:filename",
  async (req, res, next) => {
    const { folder, filename } = req.params;

    // Only permit the original media folder paths.
    if (
      folder !== "images" &&
      folder !== "documents"
    ) {
      return res.status(404).end();
    }

    // Only allow UUID-based filenames produced
    // by this upload system.
    const validFilename =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|pdf)$/i;

    if (!validFilename.test(filename)) {
      return res.status(404).end();
    }

    const ext = path.extname(
      filename
    ).toLowerCase();

    const contentTypes = {
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".pdf": "application/pdf"
    };

    const contentType = contentTypes[ext];

    // Ensure image/document folders only contain
    // their permitted file types.
    if (
      (folder === "images" && ext === ".pdf") ||
      (folder === "documents" && ext !== ".pdf")
    ) {
      return res.status(404).end();
    }

    const objectName =
      `${folder}/${filename}`;

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    res.setHeader(
      "Content-Type",
      contentType
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=3600"
    );

    if (ext === ".pdf") {
      res.setHeader(
        "Content-Disposition",
        "inline"
      );
    }

    try {
      if (useCloudStorage) {
        const file = bucket.file(objectName);

        // Check the object before streaming it.
        const [exists] = await file.exists();

        if (!exists) {
          return res.status(404).json({
            success: false,
            message: "Media file not found."
          });
        }

        const stream = file.createReadStream();

        stream.on("error", (error) => {
          console.error(
            "Cloud Storage read error:",
            error
          );

          if (!res.headersSent) {
            return next(error);
          }

          res.destroy(error);
        });

        stream.pipe(res);

        return;
      }

      // Local development fallback.
      const localPath = path.join(
        baseDirectory,
        folder,
        filename
      );

      return res.sendFile(
        localPath,
        (error) => {
          if (error && !res.headersSent) {
            if (error.status === 404 ||
                error.code === "ENOENT") {
              return res.status(404).json({
                success: false,
                message: "Media file not found."
              });
            }

            next(error);
          }
        }
      );
    } catch (error) {
      console.error(
        "Media delivery failed:",
        error
      );

      next(error);
    }
  }
);

// ============================================
// EXPORT ROUTES
// ============================================

module.exports = {
  router,
  publicRouter,
  baseDirectory
};
