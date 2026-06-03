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
    <div className="relative flex min-h-[11rem] w-full items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/55 p-5 text-center sm:p-6 lg:min-h-[12rem] lg:px-36">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
      </div>
      {actions && (
        <div className="absolute right-5 top-5 flex max-w-[13rem] shrink-0 flex-col items-stretch gap-2 sm:right-6 sm:top-6 [&>button]:w-full">
          {actions}
        </div>
      )}
    </div>
  );
}
