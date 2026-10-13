import { MdCheckCircle, MdOutlineCancel } from "react-icons/md";

const STRENGTH = [
  { label: "Empty", bar: "bg-indigo-200" },
  { label: "Weak", bar: "bg-red-500" },
  { label: "Fair", bar: "bg-amber-500" },
  { label: "Good", bar: "bg-indigo-500" },
  { label: "Strong", bar: "bg-green-500" },
];

const PASSWORD_CHECKS = [
  { label: "8+ chars", test: (v) => v.length >= 8 },
  { label: "Upper & Lower", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { label: "1+ Number", test: (v) => /\d/.test(v) },
  { label: "1+ Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function PasswordStrength({ password }) {
  const results = PASSWORD_CHECKS.map((c) => ({
    label: c.label,
    passed: c.test(password),
  }));
  const score = results.filter((r) => r.passed).length;
  const level = password ? Math.max(score, 1) : 0;
  const { label, bar } = STRENGTH[level];

  return (
    <div className="mb-6 rounded-xl bg-indigo-50 p-2">
      <div className="mb-2 flex items-center justify-between text-slate-600">
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Password strength
        </span>
        <span className="text-[10px]">{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-colors ${
              i <= level ? bar : "bg-indigo-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {results.map((r) => (
          <span
            key={r.label}
            className={`flex items-center gap-1 text-[10px] ${
              r.passed ? "text-green-600" : "text-slate-500"
            }`}
          >
            {r.passed ? <MdCheckCircle /> : <MdOutlineCancel />}
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PasswordStrength;
