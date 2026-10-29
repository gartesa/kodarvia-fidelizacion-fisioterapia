export default function BrandMark({ size = 36, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-primary ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 100 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 21 H16 L24 8 L32 34 L40 4 L48 21 H62 L70 13 L78 21 H100"
          stroke="#10B981"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
