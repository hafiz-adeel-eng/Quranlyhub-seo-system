"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="hover:text-brand-700"
      type="button"
    >
      {label}
    </button>
  );
}
