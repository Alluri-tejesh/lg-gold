import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export const inputClass =
  'w-full min-h-12 rounded-xl bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60 ring-1 ring-inset ring-line-strong ' +
  'transition-shadow focus:outline-none focus:ring-2 focus:ring-forest-700 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger';

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  /** Receives the generated id so the label, hint and error are wired to the control for screen readers. */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}

/** Label + control + hint/error, laid out the same in every form. */
export const Field: React.FC<FieldProps> = ({ label, required, hint, error, className = '', children }) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest-800">
        {label}
        {required && (
          <span className="text-gold-700" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; wrapperClassName?: string };

export const TextField: React.FC<InputProps> = ({ label, hint, error, required, wrapperClassName, className = '', ...rest }) => (
  <Field label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
    {({ id, describedBy, invalid }) => (
      <input
        id={id}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={`${inputClass} ${className}`}
        {...rest}
      />
    )}
  </Field>
);

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string; wrapperClassName?: string };

export const TextAreaField: React.FC<TextAreaProps> = ({ label, hint, error, required, wrapperClassName, className = '', ...rest }) => (
  <Field label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
    {({ id, describedBy, invalid }) => (
      <textarea
        id={id}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={`${inputClass} resize-y min-h-24 ${className}`}
        {...rest}
      />
    )}
  </Field>
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  options: (string | { value: string; label: string })[];
  wrapperClassName?: string;
};

export const SelectField: React.FC<SelectProps> = ({ label, hint, options, required, wrapperClassName, className = '', ...rest }) => (
  <Field label={label} hint={hint} required={required} className={wrapperClassName}>
    {({ id, describedBy }) => (
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-describedby={describedBy}
          className={`${inputClass} appearance-none pr-11 cursor-pointer ${className}`}
          {...rest}
        >
          {options.map((o) => {
            const v = typeof o === 'string' ? { value: o, label: o } : o;
            return (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    )}
  </Field>
);

/** Pill buttons for picking one of a few options. Keyboard: arrow keys move between them (radio group). */
export function ChoiceChips<T extends string>({
  label,
  value,
  options,
  onChange,
  dark,
  className = '',
}: {
  label: string;
  value: T;
  // The allowed values come from `value`; NoInfer stops TypeScript widening them to any string from the options.
  options: { value: NoInfer<T>; label: React.ReactNode; hint?: React.ReactNode; disabled?: boolean }[];
  onChange: (v: NoInfer<T>) => void;
  dark?: boolean;
  className?: string;
}) {
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const enabled = options.filter((o) => !o.disabled);
    const cur = enabled.findIndex((o) => o.value === options[i].value);
    const next = enabled[(cur + step + enabled.length) % enabled.length];
    onChange(next.value);
    (e.currentTarget.parentElement?.querySelector(`[data-value="${CSS.escape(next.value)}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o, i) => {
        const on = o.value === value;
        // With nothing chosen yet, the first chip is the one Tab lands on.
        const tabbable = on || (i === 0 && !options.some((x) => x.value === value));
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            data-value={o.value}
            tabIndex={tabbable ? 0 : -1}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-11 rounded-xl px-4 py-2 text-left text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 ${
              on
                ? dark
                  ? 'bg-gold-500 text-forest-900 shadow-soft'
                  : 'bg-forest-800 text-white shadow-soft'
                : dark
                ? 'bg-white/8 text-cream ring-1 ring-inset ring-white/20 hover:ring-white/50'
                : 'bg-white text-forest-800 ring-1 ring-inset ring-line-strong hover:ring-forest-700'
            }`}
          >
            <span className="block leading-tight">{o.label}</span>
            {o.hint && <span className={`block text-[13px] font-medium mt-0.5 ${on ? (dark ? 'text-forest-800' : 'text-gold-300') : dark ? 'text-cream/70' : 'text-muted'}`}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
