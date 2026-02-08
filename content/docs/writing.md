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
