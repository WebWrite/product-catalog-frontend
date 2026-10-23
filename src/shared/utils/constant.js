export const PASSWORD_CHECKS = [
  { label: "8+ chars", test: (v) => v.length >= 8 },
  { label: "Upper & Lower", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { label: "1+ Number", test: (v) => /\d/.test(v) },
  { label: "1+ Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];
