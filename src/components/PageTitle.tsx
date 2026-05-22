import React from "react";

export default function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/55 p-5 sm:p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
