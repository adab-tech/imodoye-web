import PartnerForm from "../PartnerForm";
import { createPartner } from "../actions";

export const metadata = { title: "New partner — Imodoye Admin" };

export default function NewPartnerPage() {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">PARTNERS</p>
      <h1 className="font-display text-3xl mb-8">New partner</h1>
      <PartnerForm action={createPartner} />
    </div>
  );
}
