const LogoIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Slot */}
    <rect x="7" y="5.75" width="10" height="2.5" rx="1.25" fill="currentColor" />
    {/* Box */}
    <rect
      x="4"
      y="8"
      width="16"
      height="12"
      rx="2.5"
      ry="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* Check mark */}
    <path
      d="M9.2 14.6l2.1 2.1 3.9-4.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoIcon;
