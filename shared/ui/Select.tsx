import { useId, type SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">;

export function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className = "",
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className="text-label font-medium text-foreground"
      >
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={`w-full rounded-md border bg-surface px-3 py-2 text-label text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          invalid ? "border-error" : "border-border"
        } ${className}`}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {invalid ? (
        <p id={errorId} className="text-[length:var(--error-size)] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
