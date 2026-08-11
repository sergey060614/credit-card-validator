const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 9000;
const distPath = path.join(__dirname, "..", "dist");

const server = http.createServer((req, res) => {
  let filePath = path.join(distPath, req.url === "/" ? "index.html" : req.url);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".svg": "image/svg+xml"
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500);
        res.end("Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, "localhost", () => {
  console.log(`E2E Test server running at http://localhost:${port}`);
  if (process.send) {
    process.send("ok");
  }
});
