const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const TMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

function connectDevice() {
  return new Promise((resolve, reject) => {
    exec("adb devices", (err, stdout) => {
      if (err) {
        console.error("ADB command failed:", err);
        return reject(err);
      }

      console.log("ADB Output:\n", stdout);
      const connected = stdout.includes("device") && !stdout.includes("unauthorized");

      if (!connected) {
        return reject(new Error("No connected device found or unauthorized access"));
      }

      resolve("Phone connected successfully!");
    });
  });
}

function fetchImagePaths() {
  const searchPath = "/storage/emulated/0";
  return new Promise((resolve, reject) => {
    exec(
      `adb shell "find ${searchPath} -type f \\( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \\)"`,
      { maxBuffer: 1024 * 1000 * 10 },
      (err, stdout) => {
        if (err) {
          console.error("Image fetch failed:", err);
          return reject("Failed to fetch image paths");
        }

        const paths = stdout
          .split("\n")
          .map(p => p.trim())
          .filter(Boolean);

        resolve(paths);
      }
    );
  });
}

function downloadImage(filePath) {
  return new Promise((resolve, reject) => {
    const rawName = path.basename(filePath);
    const safeFilename = rawName.replace(/[^\w.-]/g, "_");
    const timestamp = Date.now();
    const localPath = path.join(TMP_DIR, `${timestamp}_${safeFilename}`);

    exec(`adb pull "${filePath}" "${localPath}"`, (err) => {
      if (err) {
        console.error("Image pull failed:", err);
        return reject(err);
      }

      resolve({ localPath, filename: safeFilename });
    });
  });
}

module.exports = { connectDevice, fetchImagePaths, downloadImage };
