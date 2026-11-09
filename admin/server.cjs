
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";
const DIST_DIR = path.resolve(__dirname, "dist");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Method Not Allowed");
  }

  let pathname;

  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname
    );
  } catch {
    res.writeHead(400);
    return res.end("Bad Request");
  }

  if (pathname.includes("\0") || pathname.includes("\\")) {
    res.writeHead(400);
    return res.end("Bad Request");
  }

  const requestedFile = path.resolve(
    DIST_DIR,
    "." + pathname
  );

  // Prevent serving files outside the dist directory.
  if (
    requestedFile !== DIST_DIR &&
    !requestedFile.startsWith(DIST_DIR + path.sep)
  ) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(requestedFile, (error, stats) => {
    let filePath = requestedFile;

    if (error || !stats.isFile()) {
      // Support React single-page application routes.
      // Missing assets should still return 404.
      if (path.extname(pathname)) {
        res.writeHead(404);
        return res.end("Not Found");
      }

      filePath = path.join(DIST_DIR, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (ext === ".html") {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }

    const stream = fs.createReadStream(filePath);

    stream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(500);
      }
      res.end("Unable to serve file");
    });

    if (req.method === "HEAD") {
      stream.destroy();
      return res.end();
    }

    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(
    `Vector Engineers Admin running at http://${HOST}:${PORT}`
  );
});
