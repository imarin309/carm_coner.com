import { categories, type Category } from "@/constants/category";

export type { Category };

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
