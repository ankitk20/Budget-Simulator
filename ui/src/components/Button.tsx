interface ButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export default function Button({ label, onClick, loading = false, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${loading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-600"} ${className}`}
    >
      {label}
    </button>
  );
}
