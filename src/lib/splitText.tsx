import React from "react";

export type SplitUnit = "char" | "word";

export function splitText(text: string, unit: SplitUnit): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  if (unit === "word") return normalized.split(" ");

  // Preserve spaces so split text doesn't collapse words together.
  // We'll render spaces as non-animated spacer spans.
  return Array.from(normalized);
}

export function SplitText({
  text,
  unit,
  className,
  itemClassName,
  dataAttr = "data-split",
}: Readonly<{
  text: string;
  unit: SplitUnit;
  className?: string;
  itemClassName?: string;
  dataAttr?: string;
}>) {
  const items = splitText(text, unit);

  return (
    <span className={className} aria-label={text} role="text">
      {unit === "word"
        ? items.map((word, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`${word}-${idx}`}
              {...{ [dataAttr]: true }}
              className={itemClassName ?? "inline-block mr-[0.28em] last:mr-0 will-change-transform"}
            >
              {word}
            </span>
          ))
        : items.map((ch, idx) => {
            if (ch === " ") {
              return (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`space-${idx}`}
                  className="inline-block w-[0.28em]"
                  aria-hidden="true"
                />
              );
            }
            return (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`${ch}-${idx}`}
                {...{ [dataAttr]: true }}
                className={itemClassName ?? "inline-block will-change-transform"}
              >
                {ch}
              </span>
            );
          })}
    </span>
  );
}

