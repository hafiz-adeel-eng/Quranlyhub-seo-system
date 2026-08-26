"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminUnlockActions({ unlockId }: { unlockId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: "PAID" | "FAILED") {
    setLoading(true);
    await fetch("/api/admin/unlocks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unlockId, status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => setStatus("PAID")}
        className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        Approve
      </button>
      <button
        disabled={loading}
        onClick={() => setStatus("FAILED")}
        className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
