// components/membership/ResourceCard.tsx
import React from "react";

type Props = {
  title: string;
  vendor?: string;
  desc: string;
  href: string;
};

export function ResourceCard({ title, vendor, desc, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {vendor ? <span className="text-white/40 text-xs">{vendor}</span> : null}
      </div>
      <p className="text-white/70 text-sm line-clamp-3">{desc}</p>
      <div className="mt-3 text-blue-300 text-sm font-medium">Open Guide →</div>
    </a>
  );
}
