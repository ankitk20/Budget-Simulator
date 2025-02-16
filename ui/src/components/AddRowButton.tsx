interface AddRowButtonProps {
    onAddRow: () => void;
  }
  
  const AddRowButton: React.FC<AddRowButtonProps> = ({ onAddRow }) => {
    return (
      <div className="relative group">
        <button
          onClick={onAddRow}
          className="px-3 py-1 text-sm font-semibold text-white bg-green-600 border border-green-700 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 active:bg-green-800 transition-all duration-300"
          >
          +
        </button>
        {/* Tooltip */}
        <span className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-3 min-w-[200px] text-left transition-opacity">
          Add an empty row for the selected category
        </span>
      </div>
    );
  };  
  
  export default AddRowButton;
  