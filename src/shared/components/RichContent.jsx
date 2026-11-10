import { useMemo } from "react";
import { cleanRichText } from "../utils/sanitizer";

export default function RichContent({ html, className = "" }) {
  const clean = useMemo(() => cleanRichText(html), [html]);

  return (
    <div
      className={` mt-6
                        [&_p]:my-3
                        [&_h1]:mb-4
                        [&_h1]:text-3xl
                        [&_h1]:font-bold
                        [&_h2]:mb-3
                        [&_h2]:text-2xl
                        [&_h2]:font-semibold
                        [&_h3]:mb-2
                        [&_h3]:text-xl
                        [&_h3]:font-semibold
                        [&_ul]:my-3
                        [&_ul]:list-disc
                        [&_ul]:pl-6
                        [&_ol]:my-3
                        [&_ol]:list-decimal
                        [&_ol]:pl-6
                        [&_blockquote]:my-4
                        [&_blockquote]:border-l-4
                        [&_blockquote]:border-violet-500
                        [&_blockquote]:pl-4
                        [&_blockquote]:italic
                        [&_pre]:my-4
                        [&_pre]:overflow-x-auto
                        [&_pre]:rounded-lg
                        [&_pre]:bg-[#181b2a]
                        [&_pre]:p-4
                        [&_pre]:text-white
                        [&_code]:rounded
                        [&_code]:bg-muted
                        [&_code]:px-1.5
                        [&_code]:py-0.5
                        [&_a]:text-violet-500
                        [&_a]:underline
                        [&_hr]:my-6
                         ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
