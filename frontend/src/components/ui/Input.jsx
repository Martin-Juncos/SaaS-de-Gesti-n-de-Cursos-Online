export default function Input({
  label,
  id,
  hint,
  error,
  className = '',
  inputClassName = '',
  ...rest
}) {
  return (
    <label htmlFor={id} className={`field ${className}`.trim()}>
      <span className="field-label">{label}</span>
      <input id={id} className={`input ${inputClassName}`.trim()} {...rest} />
      {hint && !error && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
