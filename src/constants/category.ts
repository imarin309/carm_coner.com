export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "gunpla", name: "ガンプラ制作" },
  { slug: "figure", name: "フィギュアリペイント制作" },
  { slug: "other", name: "その他" },
];
