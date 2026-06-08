import { useEffect, useState } from "react";

export default function Footer() {
  const [donationLabel, setDonationLabel] = useState<string>("Buy me a coffee!");

  useEffect(() => {
    // Persist a randomly chosen label for the session so it can vary between page loads
    const key = "bcm-donation-label";
    const existing = sessionStorage.getItem(key);
    if (existing) {
      setDonationLabel(existing);
      return;
    }

    const options = ["Buy me a coffee", "Donate to help run this site"];
    const pick = options[Math.floor(Math.random() * options.length)];
    sessionStorage.setItem(key, pick);
    setDonationLabel(pick);
  }, []);

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950/80 text-zinc-300">
      <div className="mx-auto max-w-none px-3 py-4 sm:px-5 2xl:px-8">
        <div className="grid items-center gap-3" style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-lime-400 text-zinc-950 font-bold">DCM</div>
            <div className="text-sm font-semibold">Daunt's Campaign Manager</div>
          </div>

          <div className="text-sm text-zinc-400">
            © {new Date().getFullYear()} Daunt's Campaign Manager. All rights reserved.
          </div>

          <div className="flex justify-center">
            <button className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-900/80">
              {donationLabel}
            </button>
          </div>

          <div className="flex justify-end">
            <button className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-900/80">Report</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
