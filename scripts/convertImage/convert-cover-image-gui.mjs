#!/usr/bin/env node
/**
 * カバー画像を1200x675px WebP形式に変換するスクリプト（GUI版）
 *
 * 使用方法:
 *   node scripts/convertImage/convert-cover-image-gui.mjs
 *
 * scripts/convertImage/data/ 配下の画像ファイルを順番に処理します。
 * ブラウザが開き、ドラッグで切り取り領域を選択できます。
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;
const QUALITY = 85;
const PORT = 3456;

// ディレクトリのパス
const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_DIR = path.join(__dirname, "dataEdited");

// 対応する画像拡張子
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// dataディレクトリ内の画像ファイルを取得
function getImageFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    return [];
  }

  return fs
    .readdirSync(DATA_DIR)
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .map((file) => path.join(DATA_DIR, file));
}

// MIMEタイプを取得
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// 1つの画像を処理
async function processImage(inputPath, currentIndex, totalCount) {
  // 出力ディレクトリを作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const inputParsed = path.parse(inputPath);
  const outputFileName = `${inputParsed.name}_edited.webp`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);

  const metadata = await sharp(inputPath).metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  console.log(`\n[${currentIndex + 1}/${totalCount}] 処理中: ${inputParsed.base}`);
  console.log(`  元サイズ: ${imageWidth} x ${imageHeight}`);

  return new Promise((resolve) => {
    // HTMLページを生成
    function generateHTML() {
      return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カバー画像切り取り (${currentIndex + 1}/${totalCount})</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1a1a1a;
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .header { margin-bottom: 10px; text-align: center; }
    h1 { font-size: 18px; font-weight: normal; }
    .progress { font-size: 14px; color: #4CAF50; margin-top: 5px; }
    .filename { font-size: 12px; color: #888; margin-top: 5px; }
    .info { font-size: 12px; color: #888; margin-bottom: 20px; }
    .container {
      position: relative;
      display: inline-block;
      cursor: move;
    }
    #preview {
      display: block;
      max-width: 90vw;
      max-height: 65vh;
    }
    .overlay {
      position: absolute;
      background: rgba(0, 0, 0, 0.6);
      pointer-events: none;
    }
    .overlay-top { top: 0; left: 0; right: 0; }
    .overlay-bottom { bottom: 0; left: 0; right: 0; }
    .overlay-left { left: 0; }
    .overlay-right { right: 0; }
    .crop-area {
      position: absolute;
      border: 2px dashed #fff;
      pointer-events: none;
    }
    .mode-buttons {
      margin-top: 15px;
      display: flex;
      gap: 8px;
    }
    .btn-mode {
      background: #444;
      color: #aaa;
    }
    .btn-mode.active {
      background: #2196F3;
      color: white;
    }
    .controls {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }
    button {
      padding: 10px 24px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.8; }
    .btn-confirm {
      background: #4CAF50;
      color: white;
    }
    .btn-skip {
      background: #FF9800;
      color: white;
    }
    .btn-cancel {
      background: #666;
      color: white;
    }
    .status {
      margin-top: 15px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>切り取り領域を選択してください</h1>
    <p class="progress">${currentIndex + 1} / ${totalCount} 件</p>
    <p class="filename">${inputParsed.base}</p>
  </div>
  <p class="info" id="infoText">ドラッグで移動 | 出力: ${TARGET_WIDTH}x${TARGET_HEIGHT}px (16:9)</p>

  <div class="container" id="container">
    <img id="preview" src="/image" alt="Preview">
    <div class="overlay overlay-top" id="overlayTop"></div>
    <div class="overlay overlay-bottom" id="overlayBottom"></div>
    <div class="overlay overlay-left" id="overlayLeft"></div>
    <div class="overlay overlay-right" id="overlayRight"></div>
    <div class="crop-area" id="cropArea"></div>
  </div>

  <div class="mode-buttons" id="modeButtons">
    <button class="btn-mode active" onclick="setMode(0)">横長 16:9</button>
    <button class="btn-mode" onclick="setMode(1)">横長 3:2</button>
    <button class="btn-mode" onclick="setMode(2)">縦長 3:4</button>
    <button class="btn-mode" onclick="setMode(3)">縦長 3:2</button>
  </div>

  <div class="controls">
    <button class="btn-confirm" onclick="confirm()">この範囲で切り取る</button>
    <button class="btn-skip" onclick="skip()">スキップ</button>
    <button class="btn-cancel" onclick="cancel()">全てキャンセル</button>
  </div>

  <p class="status" id="status">準備完了</p>

  <script>
    const container = document.getElementById('container');
    const preview = document.getElementById('preview');
    const overlayTop = document.getElementById('overlayTop');
    const overlayBottom = document.getElementById('overlayBottom');
    const overlayLeft = document.getElementById('overlayLeft');
    const overlayRight = document.getElementById('overlayRight');
    const cropArea = document.getElementById('cropArea');
    const status = document.getElementById('status');
    const infoText = document.getElementById('infoText');
    const modeButtons = document.getElementById('modeButtons').querySelectorAll('.btn-mode');

    const originalWidth = ${imageWidth};
    const originalHeight = ${imageHeight};
    const MODES = [
      { w: ${TARGET_WIDTH}, h: ${TARGET_HEIGHT} },
      { w: 1200, h: 800 },
      { w: 800,  h: 1067 },
      { w: 800,  h: 1200 },
    ];

    let modeIndex = 0;
    let displayWidth, displayHeight;
    let cropX = 0, cropY = 0, cropWidth = 0, cropHeight = 0;
    let isDragging = false;
    let startPos, startCropPos;

    preview.onload = () => {
      displayWidth = preview.offsetWidth;
      displayHeight = preview.offsetHeight;
      recalcCrop();
    };

    function currentMode() { return MODES[modeIndex]; }

    function recalcCrop() {
      const m = currentMode();
      const ratio = m.w / m.h;
      cropWidth = displayWidth;
      cropHeight = displayWidth / ratio;
      if (cropHeight > displayHeight) {
        cropHeight = displayHeight;
        cropWidth = displayHeight * ratio;
      }
      cropX = (displayWidth - cropWidth) / 2;
      cropY = (displayHeight - cropHeight) / 2;
      updateOverlay();
    }

    function updateOverlay() {
      cropArea.style.top = cropY + 'px';
      cropArea.style.left = cropX + 'px';
      cropArea.style.width = cropWidth + 'px';
      cropArea.style.height = cropHeight + 'px';

      overlayTop.style.height = cropY + 'px';
      overlayBottom.style.height = (displayHeight - cropY - cropHeight) + 'px';
      overlayLeft.style.top = cropY + 'px';
      overlayLeft.style.width = cropX + 'px';
      overlayLeft.style.height = cropHeight + 'px';
      overlayRight.style.top = cropY + 'px';
      overlayRight.style.width = (displayWidth - cropX - cropWidth) + 'px';
      overlayRight.style.height = cropHeight + 'px';
    }

    function setMode(index) {
      modeIndex = index;
      modeButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
      const m = currentMode();
      infoText.textContent = 'ドラッグで移動 | 出力: ' + m.w + 'x' + m.h + 'px';
      recalcCrop();
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startPos = { x: e.clientX, y: e.clientY };
      startCropPos = { x: cropX, y: cropY };
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      cropX = Math.max(0, Math.min(displayWidth - cropWidth, startCropPos.x + dx));
      cropY = Math.max(0, Math.min(displayHeight - cropHeight, startCropPos.y + dy));
      updateOverlay();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    function waitAndReload() {
      setTimeout(async () => {
        try {
          const res = await fetch('/');
          if (res.ok) location.reload();
          else waitAndReload();
        } catch {
          waitAndReload();
        }
      }, 300);
    }

    async function confirm() {
      status.textContent = '処理中...';
      const scaleX = originalWidth / displayWidth;
      const scaleY = originalHeight / displayHeight;

      try {
        const response = await fetch('/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            top: Math.round(cropY * scaleY),
            left: Math.round(cropX * scaleX),
            width: Math.round(cropWidth * scaleX),
            height: Math.round(cropHeight * scaleY),
            targetW: currentMode().w,
            targetH: currentMode().h
          })
        });
        const result = await response.json();
        if (result.success) {
          status.textContent = '完了！次の画像を読み込み中...';
          waitAndReload();
        } else {
          status.textContent = 'エラー: ' + result.error;
        }
      } catch (err) {
        status.textContent = 'エラー: ' + err.message;
      }
    }

    async function skip() {
      status.textContent = 'スキップ...';
      await fetch('/skip', { method: 'POST' });
      waitAndReload();
    }

    function cancel() {
      fetch('/cancel', { method: 'POST' });
    }
  </script>
</body>
</html>`;
    }

    const server = http.createServer(async (req, res) => {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(generateHTML());
      } else if (req.method === "GET" && req.url === "/image") {
        const imageBuffer = fs.readFileSync(inputPath);
        res.writeHead(200, { "Content-Type": getMimeType(inputPath) });
        res.end(imageBuffer);
      } else if (req.method === "POST" && req.url === "/convert") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { top, left, width, height, targetW, targetH } = JSON.parse(body);

            await sharp(inputPath)
              .extract({
                left: Math.max(0, left),
                top: Math.max(0, top),
                width: Math.min(width, imageWidth - Math.max(0, left)),
                height: Math.min(height, imageHeight - Math.max(0, top)),
              })
              .resize(targetW, targetH)
              .webp({ quality: QUALITY })
              .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const sizeKB = (outputStats.size / 1024).toFixed(1);

            console.log(`  出力: ${outputFileName}`);
            console.log(`  容量: ${sizeKB} KB`);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, output: outputPath }));

            server.close();
            resolve({ action: "converted" });
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else if (req.method === "POST" && req.url === "/skip") {
        res.writeHead(200);
        res.end();
        console.log(`  スキップしました`);
        server.close();
        resolve({ action: "skipped" });
      } else if (req.method === "POST" && req.url === "/cancel") {
        res.writeHead(200);
        res.end();
        server.close();
        resolve({ action: "cancelled" });
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    server.listen(PORT, () => {
      if (currentIndex === 0) {
        const url = `http://localhost:${PORT}`;
        console.log(`\nブラウザで開いています: ${url}`);

        const platform = process.platform;
        try {
          if (platform === "darwin") {
            execSync(`open "${url}"`);
          } else if (platform === "win32") {
            execSync(`start "${url}"`);
          } else {
            execSync(`xdg-open "${url}"`);
          }
        } catch {
          console.log(`ブラウザで ${url} を開いてください`);
        }
      }
    });
  });
}

// メイン処理
async function main() {
  const imageFiles = getImageFiles();

  if (imageFiles.length === 0) {
    console.log(`
カバー画像変換スクリプト（GUI版）

data ディレクトリに画像ファイルがありません。
以下のディレクトリに画像を配置してください:
  ${DATA_DIR}

対応形式: ${IMAGE_EXTENSIONS.join(", ")}
`);
    process.exit(0);
  }

  console.log(`${imageFiles.length} 件の画像ファイルを検出しました`);

  let converted = 0;
  let skipped = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const result = await processImage(imageFiles[i], i, imageFiles.length);

    if (result.action === "converted") {
      converted++;
    } else if (result.action === "skipped") {
      skipped++;
    } else if (result.action === "cancelled") {
      console.log("\nキャンセルされました");
      break;
    }
  }

  console.log(`\n処理完了: ${converted} 件変換, ${skipped} 件スキップ`);
}

main();
