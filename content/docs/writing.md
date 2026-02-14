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
    { src: "https://r2.calm-corner.com/posts/slug/image1.jpg", alt: "画像の説明1", caption: "サーフェイサー塗布後" },
    { src: "https://r2.calm-corner.com/posts/slug/image2.jpg", alt: "画像の説明2", caption: "スミ入れ完了" },
    { src: "https://r2.calm-corner.com/posts/slug/image3.jpg", alt: "画像の説明3" },
  ]}
/>
```

## カラム数について

カラム数は `images` の数に応じて自動的に決まります（最大4列）。

| 画像数 | モバイル | PC |
|--------|----------|----|
| 1枚 | 1列 | 1列 |
| 2枚 | 1列 | 2列 |
| 3枚 | 2列 | 3列 |
| 4枚以上 | 2列 | 4列 |

## プロパティ一覧

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `images` | `{ src: string; alt: string; caption?: string }[]` | はい | 表示する画像の配列。`caption` で写真下にイタリックの説明文を表示 |
