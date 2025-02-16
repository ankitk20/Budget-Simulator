interface ButtonProps {
    label: string;
    onClick: () => void;
    loading?: boolean;
  }
  
  export default function Button({ label, onClick, loading = false }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 
          ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-600"}
        `}
      >
        {label}
      </button>
    );
  }
  