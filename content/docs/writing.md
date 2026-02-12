# 文字の大きさを変える

MDXファイル内でHTMLタグと Tailwind CSS のクラスを使って文字サイズを変更できます。

## 基本の書き方

一部のみ変える

```mdx
ここは普通のサイズ。<span className="text-xl font-bold">ここだけ大きく太字</span>にできます。
```

段落全体を変える

```mdx
<p className="text-sm">
この段落はすべて小さい文字になります。
複数行にわたっても大丈夫です。
</p>
```

## 文字の大きさ

| クラス名 | サイズ | 用途 |
|----------|--------|------|
| `text-xs` | 12px | 注釈・補足 |
| `text-sm` | 14px | 小さめの補足 |
| `text-base` | 16px | 本文（デフォルト） |
| `text-lg` | 18px | 少し強調 |
| `text-xl` | 20px | 強調 |
| `text-2xl` | 24px | 大きく強調 |
| `text-3xl` | 30px | かなり大きく |

## 注意

- MDXでは `class` ではなく `className` を使います

---

# ImageGallery の使い方

複数の画像をグリッド表示し、クリックするとモーダルで拡大表示できるコンポーネントです。モーダル内では左右の矢印で画像を切り替えられます。

## 基本の書き方

```mdx
<ImageGallery
  images={[
    { src: "https://r2.calm-corner.com/posts/slug/image1.jpg", alt: "画像の説明1" },
    { src: "https://r2.calm-corner.com/posts/slug/image2.jpg", alt: "画像の説明2" },
    { src: "https://r2.calm-corner.com/posts/slug/image3.jpg", alt: "画像の説明3" },
  ]}
/>
```

## カラム数を変える

`columns` プロパティで1行あたりの列数を指定できます（デフォルトは `3`）。

```mdx
{/* 2列で表示 */}
<ImageGallery
  columns={2}
  images={[
    { src: "https://r2.calm-corner.com/posts/slug/image1.jpg", alt: "画像1" },
    { src: "https://r2.calm-corner.com/posts/slug/image2.jpg", alt: "画像2" },
  ]}
/>
```

| columns | モバイル | PC |
|---------|----------|----|
| `2` | 2列 | 2列 |
| `3`（デフォルト） | 2列 | 3列 |
| `4` | 2列 | 4列 |

## プロパティ一覧

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `images` | `{ src: string; alt: string }[]` | はい | - | 表示する画像の配列 |
| `columns` | `2 \| 3 \| 4` | いいえ | `3` | グリッドの列数 |
