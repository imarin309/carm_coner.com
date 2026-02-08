# Claude Code カスタムスキル

Claude Codeで使用できるカスタムスラッシュコマンドの一覧です。

## スキル一覧

### `/review-content` - 記事レビュー

ブログ記事を `content_review.md` のチェックリストに沿ってレビューします。

```bash
/review-content content/posts/figure-repaint-kanawo.mdx
```

チェック対象:
- タイトル・メタデータ（文字数、キーワード配置）
- 本文・ライティング（構造、装飾、可読性）
- 画像関連（alt属性、ファイル名、形式）

各項目を ✅ / ⚠️ / ❌ で判定し、改善案を提示します。

### `/collab-writing` - 壁打ち執筆サポート

記事の内容を読み、フィードバック・質問→リライト案の提示→セクションごとの確認という流れで、対話しながら記事を仕上げます。

```bash
/collab-writing content/pages/about.mdx
```

- 全体フィードバックと不足情報のヒアリング
- リライト案を提示し、OKならファイルに反映
- 1セクションずつ順番に確認・修正

### `/gen-description` - description生成

記事の内容を読み取り、SEO向けのメタディスクリプションを生成してフロントマターに書き込みます。

```bash
/gen-description content/posts/figure-repaint-kanawo.mdx
```

- 100〜120文字の日本語descriptionを生成
- 書き込み前にユーザーへ確認を取ります

## 関連ファイル

| ファイル | 説明 |
|---|---|
| `commands/review-content.md` | 記事レビュースキル定義 |
| `commands/collab-writing.md` | 壁打ち執筆サポートスキル定義 |
| `commands/gen-description.md` | description生成スキル定義 |
| `content_review.md` | レビューチェックリスト（スキルから参照） |
| `CLAUDE.md` | プロジェクト全体のガイダンス |
