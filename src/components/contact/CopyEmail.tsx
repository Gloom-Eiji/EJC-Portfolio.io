"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="inline-flex items-center gap-2 border border-[var(--rule-strong)] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ash transition-colors hover:border-bone hover:text-bone"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <Check size={13} strokeWidth={1.5} /> : <Copy size={13} strokeWidth={1.5} />}
          {copied ? "Copied" : "Copy address"}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
