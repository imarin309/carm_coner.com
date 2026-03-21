import type { Metadata } from "next";
import { siteXUrl, siteXId, siteEmail } from "@/constants/meta";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Calm Cornerへのお問い合わせはこちらから。",
  openGraph: {
    title: "お問い合わせ",
    description: "Calm Cornerへのお問い合わせはこちらから。",
  },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <div className="mb-16">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">
          お問い合わせ
        </h1>
        <p className="max-w-2xl text-stone-500">
          ご質問・ご感想はメールまたは X の DM からお気軽にどうぞ。
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <a
          href={`mailto:${siteEmail}`}
          className="group inline-flex flex-col gap-2 border-b border-stone-200 pb-4 transition-colors hover:border-stone-600"
        >
          <span className="text-xs uppercase tracking-widest text-stone-400 transition-colors group-hover:text-stone-600">
            Email
          </span>
          <span className="text-xl tracking-wide text-stone-700 sm:text-2xl">
            {siteEmail}
          </span>
        </a>

        <a
          href={siteXUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`X (Twitter) を新しいタブで開く`}
          className="group inline-flex flex-col gap-2 border-b border-stone-200 pb-4 transition-colors hover:border-stone-600"
        >
          <span className="text-xs uppercase tracking-widest text-stone-400 transition-colors group-hover:text-stone-600">
            X (Twitter)
          </span>
          <span className="text-xl tracking-wide text-stone-700 sm:text-2xl">
            {siteXId}
          </span>
        </a>
      </div>

      <p className="mt-16 max-w-xl text-sm leading-relaxed text-stone-400">
        いただいた個人情報は、ご連絡・対応の目的にのみ使用し、第三者への提供は行いません。
      </p>
    </article>
  );
}
