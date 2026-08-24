import FellowForm from "../FellowForm";
import { createFellow } from "../actions";

export const metadata = { title: "New fellow — Imodoye Admin" };

export default function NewFellowPage() {
  return (
    <div>
      <p className="font-mono text-xs mb-3 text-indigo">FELLOWS</p>
      <h1 className="font-display text-3xl mb-8">New fellow</h1>
      <FellowForm action={createFellow} />
    </div>
  );
}
