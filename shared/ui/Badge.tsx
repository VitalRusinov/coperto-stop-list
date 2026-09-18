const variants = {
  stop: {
    label: "Стоп",
    className: "bg-accent text-surface",
  },
  saving: {
    label: "Сохраняется",
    className: "bg-border text-secondary",
  },
} as const;

type BadgeProps = {
  variant: keyof typeof variants;
};

export function Badge({ variant }: BadgeProps) {
  const { label, className } = variants[variant];

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[length:var(--error-size)] font-medium ${className}`}
    >
      {label}
    </span>
  );
}
