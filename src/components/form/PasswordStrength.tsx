// src/components/form/PasswordStrength.tsx
interface PasswordStrengthProps {
    password: string;
}

const CHECKS = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

const COLORS = ["#ef4444", "#f59e0b", "#71dd37"];
const LABELS = ["Weak", "Fair", "Strong"];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const checks = CHECKS.map((c) => ({ label: c.label, pass: c.test(password) }));
    const strength = checks.filter((c) => c.pass).length;

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i < strength ? COLORS[strength - 1] : "#e5e7eb",
                        }}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {checks.map((c) => (
                        <span
                            key={c.label}
                            className="text-xs flex items-center gap-1 transition-colors duration-200"
                            style={{ color: c.pass ? "#71dd37" : "#9ca3af" }}
                        >
                            <span>{c.pass ? "✓" : "○"}</span>
                            {c.label}
                        </span>
                    ))}
                </div>
                {strength > 0 && (
                    <span className="text-xs font-semibold" style={{ color: COLORS[strength - 1] }}>
                        {LABELS[strength - 1]}
                    </span>
                )}
            </div>
        </div>
    );
}