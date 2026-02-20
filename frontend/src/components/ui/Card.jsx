export default function Card({ children, className = '', variant = 'default' }) {
  return <article className={`card card-${variant} ${className}`.trim()}>{children}</article>;
}
