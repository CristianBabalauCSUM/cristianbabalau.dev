import type { ReactNode } from "react";
import type { BodyBlock } from "@/data/projects";

/**
 * Renders the tiny inline-markdown subset used in data files:
 * **bold**, `code`, [text](url).
 */
export function inlineMd(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    } else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out.push(
        <a key={key++} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function ImagePlaceholder({
  alt,
  src,
  aspect = "16/9",
  radius = 14,
}: {
  alt: string;
  src?: string;
  aspect?: string;
  radius?: number;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  }
  return (
    <span
      className="img-placeholder w-full"
      style={{ aspectRatio: aspect, borderRadius: radius, display: "grid" }}
    >
      {alt} · replace with your image
    </span>
  );
}

/** Renders an article body (BodyBlock[]) inside .post-prose styling. */
export function ProseBody({ body }: { body: BodyBlock[] }) {
  return (
    <article className="post-prose">
      {body.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} id={slugify(block.text)}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(block.text)}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={i}>{inlineMd(block.text)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{inlineMd(item)}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <div key={i} className="callout">
                <p>{inlineMd(block.text)}</p>
              </div>
            );
          case "image":
            return (
              <p key={i}>
                <ImagePlaceholder alt={block.alt} src={block.src} />
              </p>
            );
          case "screenshots":
            return (
              <div key={i} className="screenshot-grid">
                {block.images.map((img, j) => (
                  <div key={j}>
                    <ImagePlaceholder
                      alt={img.alt}
                      src={img.src}
                      aspect="9/19"
                      radius={20}
                    />
                  </div>
                ))}
              </div>
            );
        }
      })}
    </article>
  );
}

/** Table of contents entries derived from h2 blocks */
export function tocEntries(body: BodyBlock[]) {
  return body
    .filter((b): b is Extract<BodyBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), label: b.text }));
}
