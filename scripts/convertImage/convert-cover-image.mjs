#!/usr/bin/env node
/**
 * カバー画像を1200x675px WebP形式に変換するスクリプト
 *
 * 使用方法:
 *   node scripts/convert-cover-image.mjs [オプション] <入力画像> [出力ファイル名]
 *
 * オプション:
 *   --top, -t     上に合わせて切り取り
 *   --bottom, -b  下に合わせて切り取り
 *   (デフォルト: 中央で切り取り)
 *
 * 例:
 *   node scripts/convert-cover-image.mjs ./photo.jpg
 *   → ./photo_edited.webp を生成（中央で切り取り）
 *
 *   node scripts/convert-cover-image.mjs --top ./photo.jpg
 *   → ./photo_edited.webp を生成（上に合わせて切り取り）
 *
 *   node scripts/convert-cover-image.mjs -b ./photo.jpg cover.webp
 *   → ./cover.webp を生成（下に合わせて切り取り）
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;
const QUALITY = 85;

async function convertImage(inputPath, outputPath, position) {
  if (!fs.existsSync(inputPath)) {
    console.error(`エラー: ファイルが見つかりません: ${inputPath}`);
    process.exit(1);
  }

  const positionLabel = {
    top: "上",
    center: "中央",
    bottom: "下",
  };

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`入力: ${inputPath}`);
    console.log(`  元サイズ: ${metadata.width} x ${metadata.height}`);
    console.log(`  フォーマット: ${metadata.format}`);

    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: "cover",
        position: position,
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const sizeKB = (outputStats.size / 1024).toFixed(1);

    console.log(`出力: ${outputPath}`);
    console.log(`  サイズ: ${TARGET_WIDTH} x ${TARGET_HEIGHT}`);
    console.log(`  切り取り位置: ${positionLabel[position]}`);
    console.log(`  容量: ${sizeKB} KB`);
    console.log("変換完了!");
  } catch (error) {
    console.error(`エラー: 変換に失敗しました: ${error.message}`);
    process.exit(1);
  }
}

// 引数解析
const rawArgs = process.argv.slice(2);
let position = "center";
const positionalArgs = [];

for (const arg of rawArgs) {
  if (arg === "--top" || arg === "-t") {
    position = "top";
  } else if (arg === "--bottom" || arg === "-b") {
    position = "bottom";
  } else if (!arg.startsWith("-")) {
    positionalArgs.push(arg);
  }
}

if (positionalArgs.length === 0) {
  console.log(`
カバー画像変換スクリプト

使用方法:
  node scripts/convert-cover-image.mjs [オプション] <入力画像> [出力ファイル名]

オプション:
  --top, -t     上に合わせて切り取り
  --bottom, -b  下に合わせて切り取り
  (デフォルト: 中央で切り取り)

例:
  node scripts/convert-cover-image.mjs ./photo.jpg
  → ./photo_edited.webp を生成（中央で切り取り）

  node scripts/convert-cover-image.mjs --top ./photo.jpg
  → ./photo_edited.webp を生成（上に合わせて切り取り）

  node scripts/convert-cover-image.mjs -b ./photo.jpg cover.webp
  → ./cover.webp を生成（下に合わせて切り取り）

出力:
  - サイズ: ${TARGET_WIDTH} x ${TARGET_HEIGHT}px (16:9)
  - フォーマット: WebP
  - 品質: ${QUALITY}%
`);
  process.exit(0);
}

const inputPath = path.resolve(positionalArgs[0]);
const inputParsed = path.parse(inputPath);

const outputFileName = positionalArgs[1]
  ? positionalArgs[1].endsWith(".webp")
    ? positionalArgs[1]
    : `${positionalArgs[1]}.webp`
  : `${inputParsed.name}_edited.webp`;

const outputPath = path.resolve(inputParsed.dir, outputFileName);

convertImage(inputPath, outputPath, position);
