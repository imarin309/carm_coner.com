interface YouTubeCardProps {
  url: string;
}

const ALLOWED_HOSTS = ["www.youtube.com", "youtube.com", "youtu.be"];
const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) return null;

  let id: string | null = null;
  if (parsed.hostname === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (
    parsed.pathname === "/watch" ||
    parsed.pathname.startsWith("/watch/")
  ) {
    id = parsed.searchParams.get("v");
  } else {
    const m = parsed.pathname.match(/^\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})/);
    id = m ? m[1] : null;
  }

  return id && VIDEO_ID_RE.test(id) ? id : null;
}

export default function YouTubeCard({ url }: YouTubeCardProps) {
  const id = extractYouTubeId(url);

  if (!id) {
    return <span>{url}</span>;
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube動画"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
