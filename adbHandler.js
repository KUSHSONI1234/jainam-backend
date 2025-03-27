const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = "./uploads";

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Connect to Android device
function connectDevice() {
  const result = shell.exec("adb devices", { silent: true }).stdout;

  if (result.includes("device")) {
    const device = result.split("\n")[1].split("\t")[0];
    return { success: true, message: "Device connected", device };
  } else {
    return { success: false, message: "No device found" };
  }
}

// Fetch all images from Android device
async function fetchImages() {
  const result = shell.exec("adb devices", { silent: true }).stdout;
  const device = result.split("\n")[1]?.split("\t")[0];

  if (!device) {
    return { success: false, message: "No device found" };
  }

  // Create folder for images
  const imageFolder = path.join(UPLOAD_DIR, device);
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  // Pull images from device
  const pullCommand = `adb pull /sdcard/DCIM/Camera ${imageFolder}`;
  shell.exec(pullCommand, { silent: true });

  const images = fs.readdirSync(imageFolder).map((file) => `/uploads/${device}/${file}`);

  return { success: true, images };
}

module.exports = { connectDevice, fetchImages };

