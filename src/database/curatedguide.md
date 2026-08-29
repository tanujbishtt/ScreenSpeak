# SceneSpeak — Curated Image Database: Structure & Drafting Guide

Category field hata diya gaya hai (app mein use nahi ho raha tha). Final schema neeche hai.

---

## 1. Data Schema

Har entry `src/data/curatedImages.js` mein i// One-time helper script — NOT part of the app bundle.
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

main();// One-time helper script — NOT part of the app bundle.
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

main();// One-time helper script — NOT part of the app bundle.
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

main();// One-time helper script — NOT part of the app bundle.
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

main();// One-time helper script — NOT part of the app bundle.
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

main();si shape mein jaayegi:

```js
{
  id: 6, // next number in sequence, existing 5 already use 1-5
  url: "https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=800&q=80",
  vocab: [
    { word: "___", meaning: "___" },
    { word: "___", meaning: "___" },
  ],
  solution: "___",   // one natural, grammatically correct sentence describing the scene
  nativeWay: "___",  // same idea, casual/native-speaker phrasing
  genZWay: "___",    // same idea, gen-z slang + 1 emoji max
}
```

**Field rules (based on your existing 5 entries):**
- `vocab`: exactly 2 words, each tied to something visible in the image. `meaning` should be a short dictionary-style definition, not a sentence.
- `solution`: 1 sentence, present continuous tense mostly (matches existing tone — "A woman is strolling...", "Dark clouds are gathering...").
- `nativeWay`: shorter, more casual than `solution`, sounds like how a native speaker would actually say it out loud.
- `genZWay`: gen-z slang, casual spelling okay, 1 emoji at the end. Not overused/cringe — matches existing samples like "she's out here vibing, phone in hand, zero rush 💀".

---

## 2. AI Prompt Template (use this per image)

Copy this, replace `[IMAGE URL]`, paste the image (or describe it) alongside, and feed to Gemini/ChatGPT:

```
You are writing content for an English-learning app called SceneSpeak. Users see
a real-world photo and describe it in English; your job is to generate the
"reference answer" content for one image.

Image: [IMAGE URL]
(Attach the image if the model supports vision, otherwise describe the scene in
1 line here: [SHORT SCENE DESCRIPTION])

Return ONLY a JSON object in this exact shape, no extra text:

{
  "vocab": [
    { "word": "...", "meaning": "..." },
    { "word": "...", "meaning": "..." }
  ],
  "solution": "...",
  "nativeWay": "...",
  "genZWay": "..."
}

Rules:
- vocab: exactly 2 words visible/relevant to the scene, each with a short
  dictionary-style meaning (not a full sentence).
- solution: one natural, grammatically correct sentence describing the scene,
  mostly present continuous tense (e.g. "A woman is strolling down the
  pavement, checking her phone as she walks.").
- nativeWay: a shorter, casual paraphrase of the same scene, how a native
  speaker would actually say it out loud (e.g. "She's just strolling along,
  scrolling through her phone.").
- genZWay: same scene in gen-z internet slang, casual spelling allowed, end
  with exactly 1 emoji (e.g. "she's out here vibing, phone in hand, zero rush 💀").
- Keep all four fields tonally distinct from each other — don't just reword
  the same sentence four times.
```

---

## 3. Workflow

1. Pick an image on Unsplash (or another site with a public direct image URL) — same style as existing ones: real-world, concrete, easily describable scenes.
2. Grab the direct image URL.
3. Run the prompt above (with image attached) through Gemini/ChatGPT.
4. Paste the JSON output into a new object in `curatedImages.js`, add `id` (next number) and `url`.
5. Repeat for all 40-50 images.

Once all entries are in, `curatedImages.js` stays as-is for now (it already has a note that this later moves to Firestore — shape won't change, so nothing else needs rework when that happens).