import React from "react";

const JobFormInput = ({ id, name, label, type, value, onChange, placeholder, required = false }) => {
  const inputStyles =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";
  const labelStyles = "block text-sm font-semibold mb-2 text-gray-700";

  return (
    <div>
      <label htmlFor={id} className={labelStyles}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputStyles}
        required={required}
      />
    </div>
  );
};

export default JobFormInput;
