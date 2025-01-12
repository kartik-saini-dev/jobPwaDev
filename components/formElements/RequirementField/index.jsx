import React from "react";

const RequirementField = ({ requirements, onAdd, onRemove, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Requirements</label>
      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Requirement ${index + 1}`}
              value={requirement}
              onChange={(e) => onChange(index, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Requirement
        </button>
      </div>
    </div>
  );
};

export default RequirementField;
