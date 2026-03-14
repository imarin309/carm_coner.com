# 文字の大きさ・色を変える

インライン記法で手軽に文字のサイズや色を変えられます。

## 基本の書き方

```mdx
ここは普通のサイズ。:large[ここだけ大きく]できます。
:red[赤い文字]や:blue[青い文字]を混ぜて書けます。
```

## 文字の大きさ

| 記法 | サイズ | 用途 |
|------|--------|------|
| `:sm[テキスト]` | 0.85em | 小さめ・補足 |
| `:large[テキスト]` | 1.25em | 少し大きく強調 |
| `:xl[テキスト]` | 1.5em | さらに大きく強調 |

## 文字の色

| 記法 | 色 |
|------|----|
| `:red[テキスト]` | 赤 |
| `:blue[テキスト]` | 青 |
| `:green[テキスト]` | 緑 |
| `:yellow[テキスト]` | 黄 |
| `:orange[テキスト]` | オレンジ |
| `:pink[テキスト]` | ピンク |
| `:purple[テキスト]` | 紫 |
| `:gray[テキスト]` | グレー |

## 注意

- サイズと色を同時に指定することはできません

---

## ImageGallery の使い方

```mdx
<ImageGallery
  images={[
    { src: "https://r2.calm-corner.com/posts/slug/image1.jpg", alt: "画像の説明1", caption: "サーフェイサー塗布後" },
    { src: "https://r2.calm-corner.com/posts/slug/image2.jpg", alt: "画像の説明2", caption: "スミ入れ完了" },
    { src: "https://r2.calm-corner.com/posts/slug/image3.jpg", alt: "画像の説明3" },
  ]}
/>
```

## YouTubeCard の使い方

YouTube動画をページ内に埋め込むコンポーネントです。URLを渡すだけでプレーヤーが表示されます。

```mdx
<YouTubeCard url="https://www.youtube.com/watch?v=xxxxx" />
```
