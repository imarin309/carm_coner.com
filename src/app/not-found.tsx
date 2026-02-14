import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-8xl font-bold text-stone-300">404</p>
      <h1 className="mt-4 text-2xl font-medium text-foreground">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-secondary">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-stone-700 px-6 py-2 text-sm text-stone-100 transition-colors hover:bg-stone-600"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
