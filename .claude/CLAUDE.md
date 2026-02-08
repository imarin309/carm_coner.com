# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Calm Cornerは、プラモデルやフィギュアリペイントの制作記録を残すための日本語ブログです。Next.js 16（App Router）とVelite（MDXコンテンツ処理）で構築されており、静的サイトとしてエクスポートされます。

## コマンド

```bash
npm run dev      # Veliteウォッチモード付きで開発サーバーを起動
npm run build    # 静的サイトをビルド (velite && next build)
npm run lint     # ESLintを実行
npm run velite   # コンテンツ処理のみ実行
```

## アーキテクチャ

### コンテンツパイプライン

1. `content/posts/`と`content/pages/`のMDXファイルがブログ記事と静的ページを定義
2. Veliteが`velite.config.ts`のスキーマに従ってMDXを処理し、`.velite/`に出力
3. Next.jsが`#site/content`パスエイリアス（`.velite/`にマップ）経由で型付きコンテンツをインポート
4. `output: "export"`設定により、ビルド時に静的HTMLを生成

### 主要パス

- `@/*` → `./src/*`（ソースコードエイリアス）
- `#site/content` → `./.velite`（生成コンテンツエイリアス）

### コンテンツのフロントマター

記事には`title`と`date`が必須。オプションは`description`、`tags`、`coverImage`:

```yaml
---
title: 記事タイトル
date: 2025-01-01
tags: [ガンプラ, 塗装]
coverImage: https://r2.calm-corner.com/posts/slug/image.jpg
---
```

### MDXカスタムコンポーネント

MDXファイルで使用可能なカスタムコンポーネントは`src/components/mdx/`に定義:

- `<ImageGallery>` - モーダル表示付きの複数画像ギャラリー
- `<BeforeAfter>` - ドラッグ可能なビフォーアフター比較スライダー

## 規約

- サイト言語は日本語（`lang="ja"`）
- 日付フォーマットは日本語ロケールを使用
- カラーパレット: 暖かみのあるストーン/ベージュ系（`globals.css`のCSS変数を参照）
- インタラクティブなコンポーネントには`"use client"`ディレクティブを使用
- レスポンシブスタイリングはTailwindの`sm:`ブレークポイント（タブレット以上）を使用
