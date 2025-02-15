interface AddRowButtonProps {
    onAddRow: () => void;
  }
  
  const AddRowButton: React.FC<AddRowButtonProps> = ({ onAddRow }) => {
    return (
      <button onClick={onAddRow} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-green-500 text-white rounded">
        +
      </button>
    );
  };
  
  export default AddRowButton;
  