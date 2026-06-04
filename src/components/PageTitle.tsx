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
  const content = (
    <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
    </div>
  );

  if (!actions) {
    return (
      <div className="flex min-h-[7.5rem] w-full items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/55 p-4 text-center sm:min-h-[8.5rem] sm:p-5 lg:min-h-[9rem]">
        {content}
      </div>
    );
  }

  return (
    <div className="grid min-h-[8.5rem] w-full grid-cols-[minmax(0,4fr)_minmax(5.5rem,1fr)] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/55 text-center sm:min-h-[9.5rem] lg:min-h-[10rem]">
      <div className="flex items-center justify-center p-4 sm:p-5 lg:p-6">
        {content}
      </div>

      <div className="flex h-full flex-col items-stretch justify-start gap-2 border-l border-zinc-800 bg-zinc-950/35 p-2 sm:p-3 [&>button]:w-full [&>button]:min-w-0 [&>button]:justify-center [&>button]:whitespace-normal [&>button]:break-words [&>button]:px-2 [&>button]:py-2 [&>button]:text-center [&>button]:text-xs sm:[&>button]:px-3 sm:[&>button]:text-sm">
        {actions}
      </div>
    </div>
  );
}
