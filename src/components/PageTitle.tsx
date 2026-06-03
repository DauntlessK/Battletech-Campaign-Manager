import React, { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <div className="relative flex min-h-[11rem] w-full items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/55 p-5 text-center sm:p-6 lg:min-h-[12rem] lg:px-36">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
      </div>

      {actions && (
        <>
          <div className="absolute right-4 top-4 lg:hidden">
            <button
              type="button"
              onClick={() => setActionsOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-700 bg-zinc-950/90 text-zinc-200 shadow-lg transition hover:border-lime-400/50 hover:text-lime-200"
              aria-label={actionsOpen ? "Close page actions" : "Open page actions"}
              aria-expanded={actionsOpen}
            >
              {actionsOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {actionsOpen && (
            <div className="absolute right-4 top-16 z-20 flex w-56 flex-col items-stretch gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-3 text-left shadow-2xl lg:hidden [&>button]:w-full">
              {actions}
            </div>
          )}

          <div className="absolute right-5 top-5 hidden max-w-[13rem] shrink-0 flex-col items-stretch gap-2 sm:right-6 sm:top-6 lg:flex [&>button]:w-full">
            {actions}
          </div>
        </>
      )}
    </div>
  );
}
