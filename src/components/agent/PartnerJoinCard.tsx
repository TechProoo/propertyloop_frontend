import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { C } from "./ui";

/**
 * Shown to an agent who has not joined the Agent Partner Programme.
 *
 * Registration itself stays on /realtors/partners — it needs a passport photo
 * upload and a live Paystack account-name lookup, and one form to keep
 * correct is better than two.
 */
export default function PartnerJoinCard({
  title,
  secondary,
}: {
  title: string;
  secondary?: { to: string; label: string };
}) {
  return (
    <div
      className="rounded-[20px] p-7 sm:p-9"
      style={{ background: C.primaryInk }}
    >
      <p
        className="text-[11px] font-bold tracking-widest uppercase"
        style={{ color: "#fcd34d" }}
      >
        Agent Partner Programme
      </p>
      <h2
        className="font-heading font-bold text-white mt-2"
        style={{ fontSize: 26, lineHeight: 1.2 }}
      >
        {title}
      </h2>
      <p
        className="mt-3 text-sm max-w-xl"
        style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}
      >
        Register free and you can sell property PropertyLoop holds a mandate on
        — no listing of your own required. Bring the buyer, earn the
        commission.
      </p>

      <ul className="mt-5 space-y-2">
        {[
          "Free to join, free to list",
          "Commission on every sale you bring",
          "Your own referral link",
        ].map((line) => (
          <li
            key={line}
            className="flex items-center gap-2.5 text-sm"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#fcd34d" }} />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Link
          to="/realtors/partners"
          className="inline-flex h-11 px-6 items-center rounded-full text-sm font-bold"
          style={{ background: "#fcd34d", color: "#3f2d06" }}
        >
          Register free
        </Link>
        {secondary && (
          <Link
            to={secondary.to}
            className="text-sm underline underline-offset-4"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
