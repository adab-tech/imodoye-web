import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import PartnerForm from "../PartnerForm";
import { updatePartner, deletePartner } from "../actions";

export const metadata = { title: "Edit partner — Imodoye Admin" };
export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const rows = await sql`select * from partners where id = ${params.id}`;
  const partner = rows[0];
  if (!partner) return notFound();

  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">PARTNERS</p>
      <h1 className="font-display text-3xl mb-8">{partner.name}</h1>

      <PartnerForm action={updatePartner.bind(null, params.id)} values={partner} />

      <form action={deletePartner.bind(null, params.id)} className="max-w-xl mt-10 pt-8 border-t border-ink/10">
        <button type="submit" className="font-ui text-sm text-terracotta underline">
          Delete this partner
        </button>
      </form>
    </div>
  );
}
