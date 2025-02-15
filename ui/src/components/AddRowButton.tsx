interface AddRowButtonProps {
    onAddRow: () => void;
  }
  
  const AddRowButton: React.FC<AddRowButtonProps> = ({ onAddRow }) => {
    return (
      <div className="relative group">
        <button
          onClick={onAddRow}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-green-500 text-white rounded"
        >
          +
        </button>
        {/* Tooltip */}
        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-3 min-w-[200px] text-left transition-opacity">
          Add an empty row for the selected category
        </span>
      </div>
    );
  };  
  
  export default AddRowButton;
  