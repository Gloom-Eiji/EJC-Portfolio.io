"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import Modal from "@/components/ui/Modal";

/**
 * "Send a letter": a small compose form that hands the finished message to
 * the visitor's mail app (mailto) with recipient, subject and body filled in.
 * Gmail and copy-address fallbacks cover browsers with no mail app set up.
 */
export default function LetterComposer({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const finalSubject = subject.trim() || `A letter for Elijah${name.trim() ? ` from ${name.trim()}` : ""}`;
  const body = [
    message.trim(),
    "",
    "—",
    name.trim() || undefined,
    from.trim() ? `Reply to: ${from.trim()}` : undefined,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  const mailto = `mailto:${email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
  const canSend = message.trim().length > 0;

  const field =
    "w-full border border-[var(--rule-strong)] bg-void px-3 py-2.5 font-serif text-lg text-parchment placeholder:text-ash-dim focus:border-bone focus:outline-none";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
        className="border border-bone bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors hover:bg-transparent hover:text-bone"
      >
        Send a letter
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Compose a letter" label={`To · ${email}`}>
        {sent ? (
          <div className="space-y-5">
            <p className="font-serif text-2xl leading-snug text-parchment">
              Your letter is sealed. Your mail app should now be open with it ready to send.
            </p>
            <p className="text-lg text-ash">Nothing opened? Send it through Gmail instead, or copy the address.</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={gmail}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-bone bg-bone px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-void hover:bg-transparent hover:text-bone"
              >
                Open in Gmail <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard?.writeText(email);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
                className="inline-flex items-center gap-2 border border-[var(--rule-strong)] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-bone hover:border-bone"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy address"}
              </button>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="px-2 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ash hover:text-bone"
              >
                ← Edit letter
              </button>
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSend) return;
              window.location.href = mailto;
              setSent(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label mb-1.5 block">Your name</span>
                <input data-autofocus className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Sir or Lady…" />
              </label>
              <label className="block">
                <span className="label mb-1.5 block">Reply-to email</span>
                <input
                  className={field}
                  type="email"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label className="block">
              <span className="label mb-1.5 block">Subject</span>
              <input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={finalSubject} />
            </label>
            <label className="block">
              <span className="label mb-1.5 block">Message</span>
              <textarea
                className={`${field} min-h-40 resize-y leading-relaxed`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Tell me about the role, the team, or the quest…"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={!canSend}
                className="border border-bone bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors hover:bg-transparent hover:text-bone disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bone disabled:hover:text-void"
              >
                Seal &amp; send
              </button>
              <a
                href={canSend ? gmail : undefined}
                aria-disabled={!canSend}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => !canSend && e.preventDefault()}
                className={`inline-flex items-center gap-1.5 px-2 py-3 font-mono text-xs uppercase tracking-[0.18em] ${canSend ? "text-ash hover:text-bone" : "cursor-not-allowed text-ash-dim"}`}
              >
                Or compose in Gmail <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <p className="font-mono text-[0.65rem] text-ash-dim">
              Nothing is sent from this site. Your own mail app or Gmail delivers the letter.
            </p>
          </form>
        )}
      </Modal>
    </>
  );
}
