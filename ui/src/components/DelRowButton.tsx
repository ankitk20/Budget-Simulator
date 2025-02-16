interface DelRowButtonProps {
    onDelRow: () => void;
  }
  
  const DelRowButton: React.FC<DelRowButtonProps> = ({ onDelRow }) => {
    return (
      <div className="relative group">
        <button
          onClick={onDelRow}
          className="px-3 py-1 text-sm font-semibold text-white bg-red-600 border border-red-700 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 active:bg-red-800 transition-all duration-300"
          >
          -
        </button>
        {/* Tooltip */}
        <span className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-3 min-w-[200px] text-left transition-opacity">
          Delete the current row
        </span>
      </div>
    );
  };  
  
  export default DelRowButton;
  