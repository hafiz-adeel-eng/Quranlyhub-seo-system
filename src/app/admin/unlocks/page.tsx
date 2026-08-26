import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/isAdmin";
import { prisma } from "@/lib/prisma";
import AdminUnlockActions from "@/components/AdminUnlockActions";

export default async function AdminUnlocksPage() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) redirect("/");

  const unlocks = await prisma.contactUnlock.findMany({
    where: { status: "PENDING" },
    include: { buyer: true, profile: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">Pending Contact Unlocks</h1>
      {unlocks.length === 0 ? (
        <p className="text-gray-500">No pending payments to review.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-xl border border-brand-100 bg-white text-sm">
          <thead className="bg-brand-50 text-start">
            <tr>
              <th className="p-3 text-start">Buyer</th>
              <th className="p-3 text-start">Profile</th>
              <th className="p-3 text-start">Amount</th>
              <th className="p-3 text-start">Txn Ref</th>
              <th className="p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {unlocks.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="p-3">{u.buyer.name} ({u.buyer.email})</td>
                <td className="p-3">{u.profile.fullName}</td>
                <td className="p-3">Rs {u.amountPkr}</td>
                <td className="p-3 font-mono">{u.providerRef}</td>
                <td className="p-3"><AdminUnlockActions unlockId={u.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
