/**
 * WordPress XML Export → MDX 変換スクリプト
 *
 * Usage: node scripts/migrate-wp.mjs calmcorner.WordPress.2026-02-07.xml
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { parseString } from "xml2js";
import TurndownService from "turndown";
import { join, basename } from "path";

const XML_PATH =
  process.argv[2] || "calmcorner.WordPress.2026-02-07.xml";
const OUTPUT_DIR = "content/posts";

// ---------- カテゴリマッピング ----------
const CATEGORY_MAP = {
  "gandom-plamo": "gunpla", // ガンプラ
  "girl-plamo": "gunpla", // 美プラ → ガンプラ制作に統合
  "%e3%83%95%e3%82%a3%e3%82%ae%e3%83%a5%e3%82%a2%e3%83%aa%e3%83%9a%e3%82%a4%e3%83%b3%e3%83%88":
    "figure", // フィギュアリペイント
  works: "gunpla", // 制作記事（親カテゴリ、子がなければgunpla）
  "%e9%9b%91%e8%a8%98": "other", // 雑記
  uncategorized: "other",
};

// ---------- Turndown (HTML→Markdown) ----------
const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// WordPress ブロックコメントを除去
turndown.addRule("wpBlockComments", {
  filter: (node) => node.nodeType === 8, // Comment node
  replacement: () => "",
});

// imgタグ変換
turndown.addRule("img", {
  filter: "img",
  replacement: (_content, node) => {
    const src = node.getAttribute("src") || "";
    const alt = node.getAttribute("alt") || "";
    return `![${alt}](${src})`;
  },
});

// ---------- ヘルパー ----------

/** CDATA等の値を文字列として取り出す */
function text(val) {
  if (!val) return "";
  if (Array.isArray(val)) val = val[0];
  if (typeof val === "object" && val._) return val._;
  return String(val ?? "");
}

/** WordPress HTML を Markdown に変換 */
function htmlToMarkdown(html) {
  // WordPress ブロックコメントを削除
  let cleaned = html.replace(/<!--\s*\/?wp:[^>]*-->/g, "");

  // WordPress [caption] ショートコードを処理
  // [caption id="..." align="..." width="..."]<img ...> キャプション[/caption]
  // → <figure><img ...><figcaption>キャプション</figcaption></figure>
  cleaned = cleaned.replace(
    /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g,
    (_match, inner) => {
      // 内部の img タグとキャプションテキストを分離
      const imgMatch = inner.match(/(<img[^>]*>)/);
      if (imgMatch) {
        const img = imgMatch[1];
        const caption = inner.replace(imgMatch[0], "").trim();
        // _italic_ wrapを除去してキャプションを保持
        const cleanCaption = caption.replace(/^_|_$/g, "").trim();
        if (cleanCaption) {
          return `${img}\n<figcaption>${cleanCaption}</figcaption>`;
        }
        return img;
      }
      return inner;
    }
  );

  // 不要な属性付きタグを簡素化
  cleaned = cleaned.replace(/class="[^"]*"/g, "");
  cleaned = cleaned.replace(/style="[^"]*"/g, "");

  // span タグを除去（中身は残す）
  cleaned = cleaned.replace(/<\/?span[^>]*>/g, "");

  // figcaption → イタリックテキストに変換（turndown前にHTMLとして扱う）
  cleaned = cleaned.replace(
    /<figcaption>([\s\S]*?)<\/figcaption>/g,
    "\n<em>$1</em>\n"
  );

  let md = turndown.turndown(cleaned);

  // 余分な空行を整理
  md = md.replace(/\n{3,}/g, "\n\n");

  // turndown がエスケープした不要なバックスラッシュを修正
  md = md.replace(/\\([`~])/g, "$1");

  return md.trim();
}

/** 画像URLを R2 URL に変換 */
function convertImageUrl(url, postSlug) {
  if (!url) return url;
  // plamo-imarin.com の画像を assets.calm-corner.com に変換
  const wpMatch = url.match(
    /https?:\/\/plamo-imarin\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/(.+)/
  );
  if (wpMatch) {
    const filename = wpMatch[1];
    return `https://assets.calm-corner.com/posts/${postSlug}/${filename}`;
  }
  return url;
}

/** Markdown 内の画像URLを一括変換 */
function convertImageUrls(markdown, postSlug) {
  return markdown.replace(
    /!\[([^\]]*)\]\((https?:\/\/plamo-imarin\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^)]+)\)/g,
    (_match, alt, url) => {
      const newUrl = convertImageUrl(url, postSlug);
      return `![${alt}](${newUrl})`;
    }
  );
}

/** カテゴリを決定する */
function resolveCategory(categories) {
  if (!categories || !Array.isArray(categories)) return "other";

  // nicename からマッピング
  // 子カテゴリを優先（girl-plamo, gandom-plamo, フィギュアリペイント）
  const childCats = ["gandom-plamo", "girl-plamo",
    "%e3%83%95%e3%82%a3%e3%82%ae%e3%83%a5%e3%82%a2%e3%83%aa%e3%83%9a%e3%82%a4%e3%83%b3%e3%83%88"];

  for (const cat of categories) {
    const nicename = cat?.$?.nicename || "";
    if (childCats.includes(nicename) && CATEGORY_MAP[nicename]) {
      return CATEGORY_MAP[nicename];
    }
  }

  // 子カテゴリが見つからない場合、domain="category" のものから探す
  for (const cat of categories) {
    const domain = cat?.$?.domain || "";
    const nicename = cat?.$?.nicename || "";
    if (domain === "category" && CATEGORY_MAP[nicename]) {
      return CATEGORY_MAP[nicename];
    }
  }

  return "other";
}

/** 日付を YYYY-MM-DD に変換 */
function formatDate(dateStr) {
  // "2024-10-08 20:50:06" → "2024-10-08"
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : dateStr;
}

/** フロントマター用にタイトルをエスケープ */
function escapeTitle(title) {
  // ダブルクォートをエスケープ
  return title.replace(/"/g, '\\"');
}

/** 記事の先頭から description を生成（最大120文字） */
function generateDescription(markdown) {
  // 見出し行を除く最初のテキスト行を取得
  const lines = markdown.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("!")) {
      const desc = trimmed.slice(0, 120);
      return desc.replace(/"/g, '\\"');
    }
  }
  return "";
}

// ---------- メイン ----------

async function main() {
  console.log(`Reading XML: ${XML_PATH}`);
  const xml = readFileSync(XML_PATH, "utf8");

  const result = await new Promise((resolve, reject) => {
    parseString(xml, { explicitCDATA: false, trim: false }, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });

  const channel = result.rss.channel[0];
  const items = channel.item || [];

  // ---------- Attachment マップ構築 ----------
  const attachmentMap = new Map(); // post_id → attachment_url
  for (const item of items) {
    const postType = text(item["wp:post_type"]);
    if (postType === "attachment") {
      const postId = text(item["wp:post_id"]);
      const url = text(item["wp:attachment_url"]);
      if (postId && url) {
        attachmentMap.set(postId, url);
      }
    }
  }
  console.log(`Found ${attachmentMap.size} attachments`);

  // ---------- 投稿を抽出・変換 ----------
  const posts = [];
  for (const item of items) {
    const postType = text(item["wp:post_type"]);
    const status = text(item["wp:status"]);

    // publish された post のみ対象
    if (postType !== "post" || status !== "publish") continue;

    const title = text(item.title);
    const slug = text(item["wp:post_name"]);
    const dateStr = text(item["wp:post_date"]);
    const date = formatDate(dateStr);
    const contentHtml = text(item["content:encoded"]);
    const categories = item.category || [];

    // カテゴリ解決
    const category = resolveCategory(categories);

    // サムネイルID → カバー画像URL
    let coverImage = "";
    const metas = item["wp:postmeta"] || [];
    for (const meta of metas) {
      const key = text(meta["wp:meta_key"]);
      const value = text(meta["wp:meta_value"]);
      if (key === "_thumbnail_id" && value) {
        const attachUrl = attachmentMap.get(value);
        if (attachUrl) {
          coverImage = convertImageUrl(attachUrl, slug);
        }
      }
    }

    // HTML → Markdown変換
    let markdown = htmlToMarkdown(contentHtml);

    // 画像URL変換
    markdown = convertImageUrls(markdown, slug);

    // description 生成
    const description = generateDescription(markdown);

    posts.push({ title, slug, date, category, coverImage, description, markdown });
  }

  console.log(`Found ${posts.length} posts to convert`);

  // ---------- MDX ファイル出力 ----------
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const post of posts) {
    const frontmatter = [
      "---",
      `title: "${escapeTitle(post.title)}"`,
      post.description ? `description: "${post.description}"` : null,
      `date: ${post.date}`,
      `category: ${post.category}`,
      post.coverImage ? `coverImage: ${post.coverImage}` : null,
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    const content = `${frontmatter}\n\n${post.markdown}\n`;

    const filePath = join(OUTPUT_DIR, `${post.slug}.mdx`);
    writeFileSync(filePath, content, "utf8");
    console.log(`  ✓ ${filePath} (${post.date}) - ${post.title}`);
  }

  console.log(`\nDone! ${posts.length} posts written to ${OUTPUT_DIR}/`);

  // ---------- 画像URLの一覧を出力 ----------
  console.log("\n--- R2にアップロードが必要な画像一覧 ---");
  const imageUrls = new Set();
  for (const post of posts) {
    const matches = post.markdown.matchAll(
      /!\[[^\]]*\]\((https:\/\/assets\.calm-corner\.com\/[^)]+)\)/g
    );
    for (const m of matches) {
      imageUrls.add(m[1]);
    }
    if (post.coverImage) {
      imageUrls.add(post.coverImage);
    }
  }
  for (const url of imageUrls) {
    console.log(`  ${url}`);
  }
  console.log(`\n合計 ${imageUrls.size} 個の画像をR2にアップロードしてください`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
