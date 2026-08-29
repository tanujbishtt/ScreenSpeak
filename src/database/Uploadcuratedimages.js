// One-time helper script — NOT part of the app bundle.
//
// What it does: takes a local folder of images (downloaded from Pinterest /
// wherever), uploads each one to Cloudinary using the SAME unsigned preset
// the app already uses (src/lib/uploadToCloudinary.js), and prints back a
// filename -> stable Cloudinary URL mapping you can paste into your AI
// prompt / curatedImages.js draft.
//
// Setup:
//   1. Put your downloaded images in a folder, e.g. ./scripts/to-upload/
//   2. Make sure your project .env has:
//        VITE_CLOUDINARY_CLOUD_NAME=...
//        VITE_CLOUDINARY_UPLOAD_PRESET=...
//   3. Run:  node scripts/uploadCuratedImages.mjs ./scripts/to-upload
//
// Requires Node 18+ (built-in fetch/FormData/Blob). No extra npm packages.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "node:process";

// Minimal .env loader (avoids adding a dotenv dependency just for this script)
async function loadEnv() {
  try {
    const envText = await readFile(path.resolve(".env"), "utf-8");
    for (const line of envText.split("\n")) {
      const match = line.match(/^([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2] ?? "";
      value = value.replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // no .env file found — assume env vars are set some other way
  }
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function uploadFile(cloudName, uploadPreset, filePath) {
  const buffer = await readFile(filePath);
  const blob = new Blob([buffer]);

  const formData = new FormData();
  formData.append("file", blob, path.basename(filePath));
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error?.message || `Upload failed (${response.status})`);
  }

  const data = await response.json();
  return data.secure_url;
}

async function main() {
  await loadEnv();

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in .env");
    process.exit(1);
  }

  const folder = process.argv[2];
  if (!folder) {
    console.error("Usage: node scripts/uploadCuratedImages.mjs <folder-of-images>");
    process.exit(1);
  }

  const entries = await readdir(folder, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(folder, e.name));

  if (files.length === 0) {
    console.log("No images found in", folder);
    return;
  }

  console.log(`Uploading ${files.length} image(s)...\n`);

  const results = [];
  for (const filePath of files) {
    const name = path.basename(filePath);
    try {
      const url = await uploadFile(cloudName, uploadPreset, filePath);
      console.log(`✔ ${name} -> ${url}`);
      results.push({ file: name, url });
    } catch (err) {
      console.error(`✘ ${name} failed: ${err.message}`);
    }
  }

  console.log("\n--- JSON summary (copy into your draft) ---\n");
  console.log(JSON.stringify(results, null, 2));
}

main();