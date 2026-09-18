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

/** Селект с лейблом и текстом ошибки под полем. */
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
  const empty = props.value === "" || props.value === undefined;

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
        className={`w-full rounded-md border bg-surface px-3 py-2 text-label focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:opacity-60 ${
          empty ? "text-secondary" : "text-foreground"
        } ${
          invalid
            ? "border-error focus-visible:outline-error"
            : "border-border focus-visible:outline-border"
        } ${className}`}
        {...props}
      >
        {placeholder ? (
          <option value="" className="text-secondary">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-foreground"
          >
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
