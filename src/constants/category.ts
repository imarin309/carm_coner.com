export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "gunpla", name: "ガンプラ制作" },
  { slug: "girls-plamo", name: "美プラ制作" },
  { slug: "figure", name: "フィギュアリペイント制作" },
  { slug: "other", name: "その他" },
];

/**
 * 全カテゴリーを取得
 */
export function getAllCategories(): Category[] {
  return categories;
}

/**
 * slugからカテゴリーを取得
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

/**
 * slugから表示名を取得（見つからない場合はslugをそのまま返す）
 */
export function getCategoryName(slug: string): string {
  const category = getCategoryBySlug(slug);
  return category?.name ?? slug;
}
