"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function CheckoutForm({ dict, profileId }: { dict: Dictionary; profileId: string }) {
  const router = useRouter();
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, providerRef: txnId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return <p className="rounded-lg bg-brand-50 p-4 text-brand-800">{dict.checkout.pending}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">{dict.checkout.txnId}</label>
        <input
          required
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gold-500 py-2.5 font-semibold text-white hover:bg-gold-600 disabled:opacity-60"
      >
        {dict.checkout.submit}
      </button>
    </form>
  );
}
